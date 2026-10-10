package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"bakery-api/db"
	"bakery-api/migrations"
	"bakery-api/models"
	"bakery-api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	// Set JWT secret dynamically from environment variable
	if jwtSecret := os.Getenv("JWT_SECRET"); jwtSecret != "" {
		models.JwtKey = []byte(jwtSecret)
	}

	// 1. Connect to Database
	db.Connect()

	// 2. Run Auto-Migrations
	migrations.RunMigrations(db.DB)

	r := gin.Default()

	// Enable CORS for frontend communication
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	os.MkdirAll("./uploads", 0755)
	r.Static("/uploads", "./uploads")

	// Register all application routes
	routes.RegisterRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	fmt.Printf("Bakery API running on http://localhost:%s\n", port)
	r.Run(":" + port)
}
