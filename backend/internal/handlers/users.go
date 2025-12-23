package handlers

import (
	"cvwo/internal/dataaccess"
	"cvwo/internal/models"
	"cvwo/internal/utils"
	"encoding/json"
	"net/http"
)

func ListUsers(w http.ResponseWriter, r *http.Request) {
	var req models.ListUsersRequest
	if err := utils.Decoder.Decode(&req, r.URL.Query()); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	users, count, err := dataaccess.ListUsers(req)
	if err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"users": users,
		"count": count,
	})
}
