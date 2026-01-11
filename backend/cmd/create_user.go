package main

import (
	"fmt"
	"log"

	"github.com/glebarez/sqlite"
	"github.com/highimexy/Bugly/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
    // 1. Połączenie z bazą
    // UWAGA: Jeśli jesteś w folderze /backend, ścieżka to "./sqlite.db"
    db, err := gorm.Open(sqlite.Open("./sqlite.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Błąd bazy:", err)
    }

    // DODAJ TĘ LINIĘ - ona stworzy tabelę users, jeśli jej nie ma
    db.AutoMigrate(&models.User{})

    email := "admin@bugly.com"
    password := "haslo123!2024"

    // ... reszta kodu (bcrypt, tworzenie usera) ...
    // 2. Hashowanie hasła
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

    user := models.User{
        Email:    email,
        Password: string(hashedPassword),
    }

    if err := db.Create(&user).Error; err != nil {
        fmt.Printf("Błąd: %v\n", err)
    } else {
        fmt.Printf("Sukces! Stworzono użytkownika: %s\n", email)
    }
}