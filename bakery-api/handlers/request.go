package handlers

import (
	"bakery-api/db"
	"bakery-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetRequestsHandler(c *gin.Context) {
	var requests []models.Request
	if err := db.DB.Order("created_at desc").Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch requests"})
		return
	}
	c.JSON(http.StatusOK, requests)
}

func CreateRequestHandler(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var body struct {
		Item     string `json:"item"`
		Quantity int    `json:"quantity"`
		Priority string `json:"priority"`
		Notes    string `json:"notes"`
	}

	if err := c.BindJSON(&body); err != nil || body.Item == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if body.Quantity <= 0 {
		body.Quantity = 1
	}
	if body.Priority == "" {
		body.Priority = "Normal"
	}

	newReq := models.Request{
		Item:     body.Item,
		Quantity: body.Quantity,
		Priority: body.Priority,
		Notes:    body.Notes,
		Status:   "pending",
		UserID:   uint(userId.(int)),
	}

	if err := db.DB.Create(&newReq).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not log request"})
		return
	}

	// Load user association for immediate display
	db.DB.Preload("User").First(&newReq, newReq.ID)

	c.JSON(http.StatusCreated, newReq)
}

func UpdateRequestStatusHandler(c *gin.Context) {
	id := c.Param("id")
	var request models.Request
	if err := db.DB.First(&request, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	request.Status = body.Status
	if err := db.DB.Save(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update request status"})
		return
	}

	c.JSON(http.StatusOK, request)
}
