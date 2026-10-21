package handlers

import (
	"bakery-api/db"
	"bakery-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsersHandler(c *gin.Context) {
	var users []models.User
	if err := db.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func UpdateUserRoleHandler(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := db.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var body struct {
		Role string `json:"role"`
	}

	if err := c.BindJSON(&body); err != nil || (body.Role != "admin" && body.Role != "driver" && body.Role != "user") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role specified"})
		return
	}

	user.Role = body.Role
	if err := db.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update user role"})
		return
	}

	c.JSON(http.StatusOK, user)
}
