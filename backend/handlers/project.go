package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/Bugly/models"
	"gorm.io/gorm"
)

// GetProjects pobiera wszystkie projekty wraz z przypisanymi do nich błędami
func GetProjects(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var projects []models.Project
		// Preload("Bugs") sprawia, że GORM automatycznie dociągnie listę błędów dla każdego projektu
		if err := db.Preload("Bugs").Find(&projects).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się pobrać projektów"})
			return
		}
		c.JSON(http.StatusOK, projects)
	}
}

// CreateProject zapisuje nowy projekt w bazie danych
func CreateProject(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newProject models.Project
		if err := c.ShouldBindJSON(&newProject); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nieprawidłowe dane projektu"})
			return
		}

		if err := db.Create(&newProject).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się stworzyć projektu"})
			return
		}
		c.JSON(http.StatusCreated, newProject)
	}
}

// DeleteProject usuwa projekt (błędy zostaną usunięte kaskadowo dzięki gorm:constraint)
func DeleteProject(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        // ZMIANA: "id" -> "projectId" (musi być identycznie jak w api.DELETE("/projects/:projectId", ...))
        projectId := c.Param("projectId")

        err := db.Transaction(func(tx *gorm.DB) error {
            // Usuwamy błędy
            if err := tx.Unscoped().Where("project_id = ?", projectId).Delete(&models.Bug{}).Error; err != nil {
                return err
            }

            // Usuwamy projekt
            result := tx.Unscoped().Where("id = ?", projectId).Delete(&models.Project{})
            
            if result.Error != nil {
                return result.Error
            }
            
            if result.RowsAffected == 0 {
                return gorm.ErrRecordNotFound
            }

            return nil
        })

        if err != nil {
            if err == gorm.ErrRecordNotFound {
                c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
            }
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Project and its bugs deleted successfully"})
    }
}

// CreateBug dodaje błąd do bazy danych
func CreateBug(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newBug models.Bug
		if err := c.ShouldBindJSON(&newBug); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nieprawidłowe dane błędu"})
			return
		}

		if err := db.Create(&newBug).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Nie udało się zapisać błędu"})
			return
		}
		c.JSON(http.StatusCreated, newBug)
	}
}

// Usuwanie błędu
func DeleteBug(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		pID := c.Param("projectId")
		bID := c.Param("bugId")

		// Usuwamy błąd filtrując po OBU kluczach
		result := db.Where("id = ? AND project_id = ?", bID, pID).Delete(&models.Bug{})
		
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete bug"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Bug deleted"})
	}
}