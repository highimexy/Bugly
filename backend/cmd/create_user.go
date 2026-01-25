package main

import (
	"fmt"
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"github.com/highimexy/Bugly/models"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Wczytaj plik .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Błąd ładowania pliku .env")
	}

	db, err := gorm.Open(sqlite.Open("./sqlite.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Błąd bazy:", err)
	}

	db.AutoMigrate(&models.User{})

	// Pobierz dane ze zmiennych środowiskowych
	email := os.Getenv("ADMIN_EMAIL")
	password := os.Getenv("ADMIN_PASSWORD")

	if email == "" || password == "" {
		log.Fatal("Brak danych logowania w pliku .env")
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := models.User{
		Email:    email,
		Password: string(hashedPassword),
	}

	if err := db.Create(&user).Error; err != nil {
		fmt.Printf("Błąd: %v (użytkownik prawdopodobnie już istnieje)\n", err)
	} else {
		fmt.Printf("Sukces! Stworzono użytkownika: %s\n", email)
	}
}