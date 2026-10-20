package models

import (
	"gorm.io/gorm"
)

type DeliveryItem struct {
	gorm.Model
	DeliveryID  uint   `json:"delivery_id"`
	ProductName string `json:"product_name" gorm:"size:255"`
	Quantity    int    `json:"quantity"`
}

type Delivery struct {
	gorm.Model
	StoreName   string         `json:"store_name" gorm:"size:255"`
	StoreLat    float64        `json:"store_lat"`
	StoreLng    float64        `json:"store_lng"`
	BeforePhoto string         `json:"before_photo" gorm:"size:500"`
	AfterPhoto  string         `json:"after_photo" gorm:"size:500"`
	Status      string         `json:"status" gorm:"default:'pending'"` // pending, in_progress, completed
	Notes       string         `json:"notes" gorm:"type:text"`
	UserID      uint           `json:"user_id"`
	User        User           `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Items       []DeliveryItem `json:"items" gorm:"foreignKey:DeliveryID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
