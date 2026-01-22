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
	// 1. Inicjalizacja bazy danych SQLite
	db, err := gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Nie udało się połączyć z bazą danych:", err)
	}

	// --- DODANO: WŁĄCZENIE OBSŁUGI KLUCZY OBCYCH DLA SQLITE ---
	// SQLite domyślnie ignoruje powiązania między tabelami. 
	// Ta linia sprawia, że baza sama pilnuje porządku w danych.
	sqlDB, _ := db.DB()
	sqlDB.Exec("PRAGMA foreign_keys = ON;")
	// ---------------------------------------------------------

	// 2. Automatyczna migracja
	db.AutoMigrate(&models.User{}, &models.Project{}, &models.Bug{})

	// 3. Konfiguracja routera Gin
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// 4. KONFIGURACJA CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// 5. Definicja tras (Routes)
	api := r.Group("/api")
	{
		api.POST("/login", handlers.Login(db))

		// PROJEKTY
		api.GET("/projects", handlers.GetProjects(db))
		api.POST("/projects", handlers.CreateProject(db))
		api.DELETE("/projects/:id", handlers.DeleteProject(db))

		// BŁĘDY
		api.POST("/bugs", handlers.CreateBug(db))
	}

	// 6. Uruchomienie serwera
	log.Println("Serwer Bugly działa na porcie :8081")
	r.Run(":8081")
}