package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	ID    string `gorm:"primaryKey" json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Bugs  []Bug  `json:"bugs" gorm:"constraint:OnDelete:CASCADE;"` 
}

type Bug struct {
	ID               string    `gorm:"primaryKey" json:"id"`
	CreatedAt        time.Time `json:"createdAt"`
	ProjectId         string    `json:"projectId"`
	Title            string    `json:"title"`
	StepsToReproduce string    `json:"stepsToReproduce"`
	ActualResult     string    `json:"actualResult"`
	ExpectedResult   string    `json:"expectedResult"`
	Priority         string    `json:"priority"` 
	ScreenshotURL    string    `json:"screenshotUrl"`
	Device           string    `json:"device"`
}