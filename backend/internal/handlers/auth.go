package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"cvwo/internal/dataaccess"
	"cvwo/internal/models"
	"cvwo/internal/utils"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte(os.Getenv("JWT_SECRET_KEY"))

func Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if emailErr := utils.ValidateEmail(req.Email); emailErr != "" {
		http.Error(w, emailErr, http.StatusBadRequest)
		return
	}

	if usernameErr := utils.ValidateUsername(req.Username); usernameErr != "" {
		http.Error(w, usernameErr, http.StatusBadRequest)
		return
	}

	if passwordErr := utils.ValidatePassword(req.Password); passwordErr != "" {
		http.Error(w, passwordErr, http.StatusBadRequest)
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		http.Error(w, "Could not hash password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Email:    req.Email,
		Username: req.Username,
		Password: string(hashedPassword),
	}

	if exists, _ := dataaccess.CheckUserExistsByEmail(req.Email); exists {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	}

	if exists, _ := dataaccess.CheckUserExistsByUsername(req.Username); exists {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	if err := dataaccess.CreateUser(user); err != nil {
		http.Error(w, "Could not create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if emailErr := utils.ValidateEmail(req.Email); emailErr != "" {
		http.Error(w, emailErr, http.StatusBadRequest)
		return
	}

	if passwordErr := utils.ValidatePassword(req.Password); passwordErr != "" {
		http.Error(w, passwordErr, http.StatusBadRequest)
		return
	}

	user, err := dataaccess.GetUserByEmail(req.Email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if err := utils.CompareHashAndPassword(user.Password, req.Password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"issuer": user.ID,
		"exp":    time.Now().Add(time.Hour * 24).Unix(), // 1 day expiration
	})

	token, err := claims.SignedString(secretKey)
	if err != nil {
		http.Error(w, "Could not login", http.StatusInternalServerError)
		return
	}

	cookie := &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, cookie)

	json.NewEncoder(w).Encode(map[string]any{
		"username": user.Username,
		"email":    user.Email,
		"id":       user.ID,
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), // Expire immediately
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(w, cookie)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out"})
}

func GetUserAuthData(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	user, err := dataaccess.GetUserByID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"username": user.Username,
		"id":       user.ID,
	})
}
