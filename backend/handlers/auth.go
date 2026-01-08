package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/highimexy/Bugly/auth"
	"github.com/highimexy/Bugly/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Błędne dane"})
			return
		}

		var user models.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Nie znaleziono użytkownika"})
			return
		}

		// Sprawdzanie hasła
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Błędne hasło"})
			return
		}

		token, _ := auth.GenerateJWT(user.Email)
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}