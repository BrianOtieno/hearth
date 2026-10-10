package models

import (
	"gorm.io/gorm"
)

type Request struct {
	gorm.Model
	Item     string `json:"item" gorm:"size:255"`
	Quantity int    `json:"quantity" gorm:"default:1"`
	Priority string `json:"priority" gorm:"default:'Normal'"` // Normal, Urgent, VIP
	Notes    string `json:"notes" gorm:"type:text"`
	Status   string `json:"status" gorm:"default:'pending'"` // pending, baking, fulfilled
	UserID   uint   `json:"user_id"`
	User     User   `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}
