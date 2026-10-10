package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Username string `json:"username" gorm:"type:varchar(191);uniqueIndex;not null"`
	Password string `json:"-"`
	Role     string `json:"role"`
}
