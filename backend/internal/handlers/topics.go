package handlers

import (
	"cvwo/internal/constants"
	"cvwo/internal/dataaccess"
	"cvwo/internal/models"
	"cvwo/internal/utils"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func FollowTopic(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	topicName := utils.DeslugifyTopicName(chi.URLParam(r, "topic_slug"))
	if topicName == "" {
		http.Error(w, "Invalid topic ID", http.StatusBadRequest)
		return
	}

	var req models.FollowTopicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("FollowTopic: Error decoding request body for user %d: %v", userID, err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Verify topic exists before attempting to follow/unfollow
	_, err := dataaccess.GetTopicByName(isAuthenticated, userID, topicName)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Topic not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch topic", http.StatusInternalServerError)
		return
	}

	if req.IsFollow {
		if err := dataaccess.FollowTopic(userID, topicName); err != nil {
			if err.Error() == constants.NO_ROWS_AFFECTED_ERROR {
				http.Error(w, "User already following this topic", http.StatusConflict)
				return
			}
			http.Error(w, "Could not follow topic", http.StatusInternalServerError)
			return
		}
	} else {
		if err := dataaccess.UnfollowTopic(userID, topicName); err != nil {
			if err.Error() == constants.NO_ROWS_AFFECTED_ERROR {
				http.Error(w, "User already not following this topic", http.StatusConflict)
				return
			}
			http.Error(w, "Could not unfollow topic", http.StatusInternalServerError)
			return
		}
	}

	message := "Topic followed successfully"
	if !req.IsFollow {
		message = "Topic unfollowed successfully"
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": message,
	})
}

func GetTopic(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	topicName := utils.DeslugifyTopicName(chi.URLParam(r, "topic_slug"))

	topic, err := dataaccess.GetTopicByName(isAuthenticated, userID, topicName)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Topic not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch topic", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topic)
}

func ListTopics(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	var req models.ListTopicsRequest
	if err := utils.Decoder.Decode(&req, r.URL.Query()); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	topics, count, err := dataaccess.ListTopics(isAuthenticated, userID, req)
	if err != nil {
		http.Error(w, "Failed to fetch topics", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"topics": topics,
		"count":  count,
	})
}

func ListTopicsSummary(w http.ResponseWriter, r *http.Request) {
	topics, err := dataaccess.ListTopicsSummary()
	if err != nil {
		http.Error(w, "Failed to fetch topics summary", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topics)
}
