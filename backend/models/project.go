package models

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	ID    string `gorm:"primaryKey" json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Bugs  []Bug  `json:"bugs" gorm:"constraint:OnDelete:CASCADE;"` // Relacja: jeden projekt ma wiele błędów
}

type Bug struct {
	gorm.Model
	ID        string `gorm:"primaryKey" json:"id"`
	ProjectId string `json:"projectId"`
	Title     string `json:"title"`
	Priority  string `json:"priority"` // Low, Medium, High
	Status    string `json:"status"`   // Open, Resolved
}