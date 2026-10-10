package migrations

import (
	"bakery-api/models"
	"fmt"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) {
	fmt.Println("Running database migrations...")

	err := db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Delivery{},
		&models.DeliveryItem{},
		&models.Request{},
	)

	if err != nil {
		panic(fmt.Sprintf("Failed to run migrations: %v", err))
	}

	fmt.Println("Database migrations completed successfully.")
}
