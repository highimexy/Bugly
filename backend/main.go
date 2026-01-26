package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"github.com/highimexy/Bugly/handlers"
	"github.com/highimexy/Bugly/models"
)

func main() {
    db, err := gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Nie udało się połączyć z bazą danych:", err)
    }

    sqlDB, _ := db.DB()
    sqlDB.Exec("PRAGMA foreign_keys = ON;")

    db.AutoMigrate(&models.User{}, &models.Project{}, &models.Bug{})

    r := gin.Default()
    r.SetTrustedProxies(nil)

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

    api := r.Group("/api")
    {
        api.POST("/login", handlers.Login(db))
        api.GET("/projects", handlers.GetProjects(db))
        api.POST("/projects", handlers.CreateProject(db))
        api.DELETE("/projects/:projectId", handlers.DeleteProject(db))
        api.POST("/bugs", handlers.CreateBug(db))
        api.DELETE("/projects/:projectId/bugs/:bugId", handlers.DeleteBug(db))
    }

    log.Println("Serwer Bugly działa na porcie :8081")
    r.Run(":8081")
}