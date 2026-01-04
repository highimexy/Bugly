package main

import (
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	Title string
	Slug string `gorm:"uniqueIndex:idx_slug"`
	Likes uint
}

var db, err = gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{})

func main(){
	db.AutoMigrate(&Post{})
}