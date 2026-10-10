package models

import (
	"github.com/golang-jwt/jwt/v4"
)

var JwtKey = []byte("super-secret-bakery-jwt-key")

type Claims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	Name     string `json:"name"`
	UserID   int    `json:"user_id"`
	jwt.RegisteredClaims
}
