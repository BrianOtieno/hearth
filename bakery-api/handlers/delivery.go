package handlers

import (
	"bakery-api/db"
	"bakery-api/models"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func GetDeliveriesHandler(c *gin.Context) {
	var deliveries []models.Delivery

	role, _ := c.Get("role")
	userId, exists := c.Get("user_id")

	query := db.DB.Preload("User").Preload("Items").Order("created_at desc")

	// Enforce role-based querying: non-admins only see their own deliveries
	if role != "admin" && exists {
		query = query.Where("user_id = ?", userId)
	}

	if err := query.Find(&deliveries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch deliveries"})
		return
	}

	c.JSON(http.StatusOK, deliveries)
}

func CreateDeliveryHandler(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var body struct {
		StoreName   string  `json:"store_name"`
		StoreLat    float64 `json:"store_lat"`
		StoreLng    float64 `json:"store_lng"`
		BeforePhoto string  `json:"before_photo"`
		AfterPhoto  string  `json:"after_photo"`
		Notes       string  `json:"notes"`
	}

	if err := c.BindJSON(&body); err != nil || body.StoreName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	newDeliv := models.Delivery{
		StoreName:   body.StoreName,
		StoreLat:    body.StoreLat,
		StoreLng:    body.StoreLng,
		BeforePhoto: body.BeforePhoto,
		AfterPhoto:  body.AfterPhoto,
		Notes:       body.Notes,
		Status:      "completed",
		UserID:      uint(userId.(int)),
	}

	if err := db.DB.Create(&newDeliv).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create delivery record"})
		return
	}

	db.DB.Preload("User").Preload("Items").First(&newDeliv, newDeliv.ID)
	c.JSON(http.StatusCreated, newDeliv)
}

func UpdateDeliveryHandler(c *gin.Context) {
	id := c.Param("id")
	userId, exists := c.Get("user_id")
	role, _ := c.Get("role")

	var delivery models.Delivery
	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	// Non-admins can only edit their own submissions
	if role != "admin" && exists && delivery.UserID != uint(userId.(int)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to edit this delivery"})
		return
	}

	var body struct {
		StoreName   string  `json:"store_name"`
		StoreLat    float64 `json:"store_lat"`
		StoreLng    float64 `json:"store_lng"`
		BeforePhoto string  `json:"before_photo"`
		AfterPhoto  string  `json:"after_photo"`
		Notes       string  `json:"notes"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if body.StoreName != "" {
		delivery.StoreName = body.StoreName
	}
	delivery.StoreLat = body.StoreLat
	delivery.StoreLng = body.StoreLng
	delivery.Notes = body.Notes
	if body.BeforePhoto != "" {
		delivery.BeforePhoto = body.BeforePhoto
	}
	if body.AfterPhoto != "" {
		delivery.AfterPhoto = body.AfterPhoto
	}

	if err := db.DB.Save(&delivery).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update delivery record"})
		return
	}

	db.DB.Preload("User").Preload("Items").First(&delivery, delivery.ID)
	c.JSON(http.StatusOK, delivery)
}

func UpdateDeliveryItemsHandler(c *gin.Context) {
	id := c.Param("id")
	var delivery models.Delivery

	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	var newItems []models.DeliveryItem
	if err := c.BindJSON(&newItems); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid items payload"})
		return
	}

	db.DB.Where("delivery_id = ?", delivery.ID).Delete(&models.DeliveryItem{})
	for i := range newItems {
		newItems[i].DeliveryID = delivery.ID
		db.DB.Create(&newItems[i])
	}

	db.DB.Preload("User").Preload("Items").First(&delivery, id)
	c.JSON(http.StatusOK, delivery)
}

func StartDeliveryHandler(c *gin.Context) {
	id := c.Param("id")
	file, err := c.FormFile("before_photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Before photo required"})
		return
	}

	os.MkdirAll("./uploads", os.ModePerm)
	filename := fmt.Sprintf("uploads/before_%s_%d%s", id, time.Now().UnixNano(), filepath.Ext(file.Filename))
	c.SaveUploadedFile(file, filename)

	serverURL := os.Getenv("SERVER_URL")
	if serverURL == "" {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8000"
		}
		serverURL = fmt.Sprintf("http://localhost:%s", port)
	}

	photoURL := fmt.Sprintf("%s/%s", serverURL, filename)

	var delivery models.Delivery
	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	delivery.Status = "in_progress"
	delivery.BeforePhoto = photoURL
	db.DB.Save(&delivery)
	db.DB.Preload("User").Preload("Items").First(&delivery, id)

	c.JSON(http.StatusOK, delivery)
}

func CompleteDeliveryHandler(c *gin.Context) {
	id := c.Param("id")
	file, err := c.FormFile("after_photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "After photo required"})
		return
	}

	os.MkdirAll("./uploads", os.ModePerm)
	filename := fmt.Sprintf("uploads/after_%s_%d%s", id, time.Now().UnixNano(), filepath.Ext(file.Filename))
	c.SaveUploadedFile(file, filename)

	serverURL := os.Getenv("SERVER_URL")
	if serverURL == "" {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8000"
		}
		serverURL = fmt.Sprintf("http://localhost:%s", port)
	}

	photoURL := fmt.Sprintf("%s/%s", serverURL, filename)

	var delivery models.Delivery
	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	delivery.Status = "completed"
	delivery.AfterPhoto = photoURL
	db.DB.Save(&delivery)
	db.DB.Preload("User").Preload("Items").First(&delivery, id)

	c.JSON(http.StatusOK, delivery)
}

func AdminSummaryHandler(c *gin.Context) {
	var deliveries []models.Delivery
	db.DB.Find(&deliveries)

	var total int64 = int64(len(deliveries))
	var completed int64 = 0

	for _, d := range deliveries {
		if d.Status == "completed" {
			completed++
		}
	}

	summary := gin.H{
		"total":     total,
		"completed": completed,
		"pending":   total - completed,
	}

	c.JSON(http.StatusOK, summary)
}
