package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"

	"bakery-api/db"
	"bakery-api/models"

	"github.com/gin-gonic/gin"
)

func GetDeliveriesHandler(c *gin.Context) {
	var deliveries []models.Delivery
	if err := db.DB.Preload("Items").Find(&deliveries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch deliveries"})
		return
	}

	c.JSON(http.StatusOK, deliveries)
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

	// Delete old items and insert updated ones
	db.DB.Where("delivery_id = ?", delivery.ID).Delete(&models.DeliveryItem{})
	for i := range newItems {
		newItems[i].DeliveryID = delivery.ID
		db.DB.Create(&newItems[i])
	}

	db.DB.Preload("Items").First(&delivery, id)
	c.JSON(http.StatusOK, delivery)
}

func StartDeliveryHandler(c *gin.Context) {
	id := c.Param("id")
	file, err := c.FormFile("before_photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Before photo required"})
		return
	}

	filename := fmt.Sprintf("uploads/before_%s_%s", id, filepath.Base(file.Filename))
	c.SaveUploadedFile(file, filename)

	var delivery models.Delivery
	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	delivery.Status = "in_progress"
	db.DB.Save(&delivery)
	db.DB.Preload("Items").First(&delivery, id)

	c.JSON(http.StatusOK, delivery)
}

func CompleteDeliveryHandler(c *gin.Context) {
	id := c.Param("id")
	file, err := c.FormFile("after_photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "After photo required"})
		return
	}

	filename := fmt.Sprintf("uploads/after_%s_%s", id, filepath.Base(file.Filename))
	c.SaveUploadedFile(file, filename)

	var delivery models.Delivery
	if err := db.DB.First(&delivery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery not found"})
		return
	}

	delivery.Status = "completed"
	db.DB.Save(&delivery)
	db.DB.Preload("Items").First(&delivery, id)

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
