package main

import (
	"log"
	"os" // <--- DODAŁEM TO: Potrzebne do czytania zmiennych środowiskowych

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"github.com/highimexy/Bugly/handlers"
	"github.com/highimexy/Bugly/models"
)

func main() {
    // 1. BAZA DANYCH (SQLite)
    // UWAGA: Na darmowym Renderze plik sqlite.db zniknie przy każdym restarcie (deployu).
    // Do pokazu dla kierownika to wystarczy, ale dane nie będą trwałe.
    db, err := gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Nie udało się połączyć z bazą danych:", err)
    }

    sqlDB, _ := db.DB()
    sqlDB.Exec("PRAGMA foreign_keys = ON;")

    db.AutoMigrate(&models.User{}, &models.Project{}, &models.Bug{})

    r := gin.Default()
    
    // Na Renderze ufamy proxy
    r.SetTrustedProxies(nil) 

    // 2. KONFIGURACJA CORS (Dynamiczna)
    // Pobieramy adres frontendu ze zmiennej środowiskowej.
    // Jeśli jej nie ma (np. lokalnie), używamy localhost:5173
    clientURL := os.Getenv("CLIENT_URL")
    if clientURL == "" {
        clientURL = "http://localhost:5173"
    }

    log.Println("Konfiguracja CORS dla adresu:", clientURL)

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{clientURL}, // <--- TU ZMIANA: Używamy zmiennej
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
        api.GET("/projects/:projectId", handlers.GetProjectDetails(db))
        api.POST("/bugs", handlers.CreateBug(db))
        api.DELETE("/projects/:projectId/bugs/:bugId", handlers.DeleteBug(db))
    }

    // 3. PORT (Dynamiczny)
    // Render wymaga, aby aplikacja słuchała na porcie podanym w zmiennej PORT
    port := os.Getenv("PORT")
    if port == "" {
        port = "8081" // Lokalnie
    }

    log.Println("Serwer Bugly startuje na porcie :" + port)
    r.Run(":" + port) // <--- TU ZMIANA: Używamy zmiennej port
}