package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email,omitempty"`
	Username  string    `json:"username"`
	Password  string    `json:"password,omitempty"`
	Karma     int       `json:"karma"`
	CreatedAt time.Time `json:"created_at"`
}

type RegisterRequest struct {
	Email    string `json:"email" schema:"email"`
	Username string `json:"username" schema:"username"`
	Password string `json:"password" schema:"password"`
}

type LoginRequest struct {
	Email    string `json:"email" schema:"email"`
	Password string `json:"password" schema:"password"`
}

type ChangePasswordRequest struct {
	Password string `json:"password" schema:"password"`
}

type UpdateUserRequest struct {
	Email    string `json:"email,omitempty" schema:"email"`
	Username string `json:"username,omitempty" schema:"username"`
}

type ListUsersRequest struct {
	Page     int    `json:"page,omitempty" schema:"page"`
	PageSize int    `json:"page_size,omitempty" schema:"page_size"`
	Sort     string `json:"sort,omitempty" schema:"sort"`
	OrderBy  string `json:"order_by,omitempty" schema:"order_by"`
	Search   string `json:"search,omitempty" schema:"search"`
}
