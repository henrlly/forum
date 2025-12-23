package handlers

import (
	"cvwo/internal/constants"
	"cvwo/internal/dataaccess"
	"cvwo/internal/models"
	"cvwo/internal/utils"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

// CreateComment handles creating a new comment
func CreateComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	var req models.CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate content
	if contentErr := utils.ValidateCommentContent(strings.TrimSpace(req.Content)); contentErr != "" {
		http.Error(w, contentErr, http.StatusBadRequest)
		return
	}
	if req.PostID <= 0 {
		http.Error(w, "Valid post ID is required", http.StatusBadRequest)
		return
	}

	comment := models.Comment{
		PostID:   req.PostID,
		Content:  strings.TrimSpace(req.Content),
		UserID:   userID,
		ParentID: req.ParentID,
	}

	commentID, err := dataaccess.CreateComment(comment)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		http.Error(w, "Could not create comment", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"message":    "Comment created successfully",
		"comment_id": commentID,
	})
}

// UpdateComment handles updating an existing comment
func UpdateComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	var req models.UpdateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get the existing comment to check ownership
	comment, err := dataaccess.GetComment(isAuthenticated, userID, commentID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
		return
	}

	if comment.IsDeleted {
		http.Error(w, "Cannot edit deleted comment", http.StatusGone)
		return
	}

	if comment.UserID != userID {
		http.Error(w, "You can only edit your own comments", http.StatusForbidden)
		return
	}

	// Validate updated content
	if contentErr := utils.ValidateCommentContent(strings.TrimSpace(req.Content)); contentErr != "" {
		http.Error(w, contentErr, http.StatusBadRequest)
		return
	}

	// Update the comment
	comment.Content = strings.TrimSpace(req.Content)
	if err := dataaccess.UpdateComment(*comment); err != nil {
		http.Error(w, "Could not update comment", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Comment updated successfully",
	})
}

// DeleteComment handles deleting a comment
func DeleteComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	comment, err := dataaccess.GetComment(isAuthenticated, userID, commentID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
		return
	}

	if comment.IsDeleted {
		http.Error(w, "Comment already deleted", http.StatusGone)
		return
	}

	if comment.UserID != userID {
		http.Error(w, "You can only delete your own comments", http.StatusForbidden)
		return
	}

	if err := dataaccess.DeleteComment(commentID); err != nil {
		http.Error(w, "Could not delete comment", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Comment deleted successfully",
	})
}

// VoteComment handles voting on a comment
func VoteComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	var req models.VoteCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.VoteValue != -1 && req.VoteValue != 0 && req.VoteValue != 1 {
		http.Error(w, "Vote value must be -1, 0, or 1", http.StatusBadRequest)
		return
	}

	comment, err := dataaccess.GetComment(isAuthenticated, userID, commentID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
		return
	}

	if comment.IsDeleted {
		http.Error(w, "Cannot vote on deleted comment", http.StatusGone)
		return
	}

	vote := models.CommentVote{
		UserID:    userID,
		CommentID: commentID,
		VoteValue: req.VoteValue,
	}

	if err := dataaccess.VoteComment(vote); err != nil {
		http.Error(w, "Could not record vote", http.StatusInternalServerError)
		return
	}

	// Get updated comment to return new score
	updatedComment, err := dataaccess.GetComment(isAuthenticated, userID, commentID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"message": "Vote recorded successfully",
		"score":   updatedComment.Score,
	})
}

func ListComments(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	var req models.ListCommentsRequest
	if err := utils.Decoder.Decode(&req, r.URL.Query()); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	comments, count, err := dataaccess.ListComments(isAuthenticated, userID, req)
	if err != nil {
		http.Error(w, "Failed to fetch comments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"comments": comments,
		"count":    count,
	})
}

func GetComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	commentID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	comment, err := dataaccess.GetComment(isAuthenticated, userID, commentID)

	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Comment not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
