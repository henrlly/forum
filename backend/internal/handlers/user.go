package handlers

import (
	"encoding/json"
	"net/http"

	"cvwo/internal/dataaccess"
	"cvwo/internal/models"
	"cvwo/internal/utils"

	"github.com/go-chi/chi/v5"
	"golang.org/x/crypto/bcrypt"
)

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	var req models.ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if passwordErr := utils.ValidatePassword(req.Password); passwordErr != "" {
		http.Error(w, passwordErr, http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 14)
	if err != nil {
		http.Error(w, "Could not hash password", http.StatusInternalServerError)
		return
	}

	if err := dataaccess.UpdateUserPassword(userID, string(hashedPassword)); err != nil {
		http.Error(w, "Could not update password", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Password updated successfully"})
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	currentUserID, isAuthenticated := GetUserFromContext(r)

	var user *models.User
	var err error

	username := chi.URLParam(r, "username")

	if username == "" {
		// no username provided, get current user's profile
		if !isAuthenticated {
			http.Error(w, "Authentication required", http.StatusUnauthorized)
		} else {
			user, err = dataaccess.GetUserByID(currentUserID)
		}
	} else {
		// username provided, get that user's profile
		user, err = dataaccess.GetUserByUsername(username)
	}

	// error getting user
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// hide email if not the current user
	email := ""
	if isAuthenticated && currentUserID == user.ID {
		email = user.Email
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":         user.ID,
		"username":   user.Username,
		"email":      email,
		"created_at": user.CreatedAt,
		"karma":      user.Karma,
	})
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	var req models.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := dataaccess.GetUserByID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Update only provided fields
	if req.Email != "" {
		if emailErr := utils.ValidateEmail(req.Email); emailErr != "" {
			http.Error(w, emailErr, http.StatusBadRequest)
			return
		}
		if req.Email != user.Email {
			if exists, _ := dataaccess.CheckUserExistsByEmail(req.Email); exists {
				http.Error(w, "Email already exists", http.StatusConflict)
				return
			}
			user.Email = req.Email
		}
	}

	if req.Username != "" {
		if usernameErr := utils.ValidateUsername(req.Username); usernameErr != "" {
			http.Error(w, usernameErr, http.StatusBadRequest)
			return
		}
		if req.Username != user.Username {
			if exists, _ := dataaccess.CheckUserExistsByUsername(req.Username); exists {
				http.Error(w, "Username already exists", http.StatusConflict)
				return
			}
			user.Username = req.Username
		}
	}

	if err := dataaccess.UpdateUserData(user); err != nil {
		http.Error(w, "Could not update profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Profile updated successfully",
	})
}
