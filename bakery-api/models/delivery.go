package models

import (
	"gorm.io/gorm"
)

type DeliveryItem struct {
	gorm.Model
	DeliveryID uint    `json:"delivery_id"`
	ProductID  uint    `json:"product_id"`
	Product    Product `json:"product" gorm:"foreignKey:ProductID"`
	Quantity   int     `json:"quantity"`
}

type Delivery struct {
	gorm.Model
	StoreName string         `json:"store_name"`
	DriverID  uint           `json:"driver_id"`
	Driver    User           `json:"driver" gorm:"foreignKey:DriverID"`
	Status    string         `json:"status"` // pending, in_progress, completed
	Items     []DeliveryItem `json:"items" gorm:"foreignKey:DeliveryID"`
}
