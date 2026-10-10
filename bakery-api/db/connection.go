package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	driver := os.Getenv("DB_DRIVER")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	var dsn string
	var err error

	if driver == "mysql" {
		// Example: dev:P@55w0rd@tcp(127.0.0.1:3306)/herth?charset=utf8mb4&parseTime=True&loc=Local
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, host, port, dbname,
		)
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	} else {
		// Example: host=127.0.0.1 user=dev password=P@55w0rd dbname=herth port=3306 sslmode=disable
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			host, user, password, dbname, port,
		)
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	}

	if err != nil {
		log.Fatalf("Failed to connect to %s database: %v", driver, err)
	}

	fmt.Printf("Successfully connected to %s database (%s)!\n", driver, dbname)
}
