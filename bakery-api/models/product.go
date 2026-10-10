package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name        string  `json:"name" gorm:"size:255"`
	Description string  `json:"description" gorm:"type:text"`
	Price       float64 `json:"price"`
	Category    string  `json:"category" gorm:"size:100"`
	ImageURL    string  `json:"image_url" gorm:"size:500"`
}
