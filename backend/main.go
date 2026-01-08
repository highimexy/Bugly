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

	// 2. Automatyczna migracja (tworzenie tabel na podstawie modeli)
	db.AutoMigrate(&models.User{})

	// 3. Konfiguracja routera Gin
	r := gin.Default()

	// 4. KONFIGURACJA CORS (Bardzo ważne dla Reacta!)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, 
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// 5. Definicja tras (Routes)
	api := r.Group("/api")
	{
		// Przekazujemy instancję bazy danych do handlera
		api.POST("/login", handlers.Login(db))
	}

	// 6. Uruchomienie serwera
	log.Println("Serwer Bugly działa na porcie :8080")
	r.Run(":8080")
}