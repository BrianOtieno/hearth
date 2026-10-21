package routes

import (
	"bakery-api/handlers"
	"bakery-api/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	// Public Auth Routes (without email requirement)
	r.POST("/auth/login", handlers.LoginHandler)
	r.POST("/auth/register", handlers.RegisterHandler)

	// Authenticated Group
	authenticated := r.Group("/")
	authenticated.Use(middleware.AuthMiddleware())
	{
		authenticated.GET("/deliveries", handlers.GetDeliveriesHandler)
		authenticated.POST("/deliveries", handlers.CreateDeliveryHandler)
		authenticated.PUT("/deliveries/:id", handlers.UpdateDeliveryHandler)
		authenticated.PUT("/deliveries/:id/items", handlers.UpdateDeliveryItemsHandler)
		authenticated.POST("/deliveries/:id/start", handlers.StartDeliveryHandler)
		authenticated.POST("/deliveries/:id/complete", handlers.CompleteDeliveryHandler)
		authenticated.GET("/admin/summary", handlers.AdminSummaryHandler)

		// User & Driver Management Routes (Admin Only)
		authenticated.GET("/users", middleware.AdminOnlyMiddleware(), handlers.GetUsersHandler)
		authenticated.PATCH("/users/:id/role", middleware.AdminOnlyMiddleware(), handlers.UpdateUserRoleHandler)

		authenticated.GET("/requests", handlers.GetRequestsHandler)
		authenticated.POST("/requests", handlers.CreateRequestHandler)
		authenticated.GET("/products", handlers.GetProductsHandler)
		authenticated.POST("/products", middleware.AdminOnlyMiddleware(), handlers.CreateProductHandler)
		authenticated.PUT("/products/:id", middleware.AdminOnlyMiddleware(), handlers.UpdateProductHandler)
		authenticated.DELETE("/products/:id", middleware.AdminOnlyMiddleware(), handlers.DeleteProductHandler)
		authenticated.PATCH("/requests/:id/status", middleware.AdminOnlyMiddleware(), handlers.UpdateRequestStatusHandler)
		authenticated.POST("/upload", handlers.UploadImageHandler)
	}
}
