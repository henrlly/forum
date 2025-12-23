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

// CreatePost handles HTTP requests to create a new post
// Requires authentication and validates input data before creation
func CreatePost(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate title
	if titleErr := utils.ValidatePostTitle(strings.TrimSpace(req.Title)); titleErr != "" {
		http.Error(w, titleErr, http.StatusBadRequest)
		return
	}

	// Validate content
	if contentErr := utils.ValidatePostContent(strings.TrimSpace(req.Content)); contentErr != "" {
		http.Error(w, contentErr, http.StatusBadRequest)
		return
	}
	if req.TopicID <= 0 {
		http.Error(w, "Valid topic ID is required", http.StatusBadRequest)
		return
	}

	post := models.Post{
		TopicID: req.TopicID,
		Title:   strings.TrimSpace(req.Title),
		Content: strings.TrimSpace(req.Content),
		UserID:  userID,
	}

	postID, err := dataaccess.CreatePost(post)
	if err != nil {
		http.Error(w, "Could not create post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"message": "Post created successfully",
		"post_id": postID,
	})
}

// UpdatePost handles HTTP requests to update an existing post
// Only allows the post author to make changes and validates ownership
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	var req models.UpdatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	post, err := dataaccess.GetPost(isAuthenticated, userID, postID)

	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch post", http.StatusInternalServerError)
		return
	}

	if post.IsDeleted {
		http.Error(w, "Cannot edit deleted post", http.StatusGone)
		return
	}

	if post.UserID != userID {
		http.Error(w, "You can only edit your own posts", http.StatusForbidden)
		return
	}

	if req.Title != "" {
		post.Title = strings.TrimSpace(req.Title)
	}
	if req.Content != "" {
		post.Content = strings.TrimSpace(req.Content)
	}

	// Validate updated title
	if titleErr := utils.ValidatePostTitle(post.Title); titleErr != "" {
		http.Error(w, titleErr, http.StatusBadRequest)
		return
	}

	// Validate updated content
	if contentErr := utils.ValidatePostContent(post.Content); contentErr != "" {
		http.Error(w, contentErr, http.StatusBadRequest)
		return
	}

	if err := dataaccess.UpdatePost(*post); err != nil {
		http.Error(w, "Could not update post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Post updated successfully",
	})
}

// DeletePost handles soft deletion of posts by marking them as deleted
// Only allows the post author to delete their own posts
func DeletePost(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	post, err := dataaccess.GetPost(isAuthenticated, userID, postID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch post", http.StatusInternalServerError)
		return
	}

	if post.IsDeleted {
		http.Error(w, "Post already deleted", http.StatusGone)
		return
	}

	if post.UserID != userID {
		http.Error(w, "You can only delete your own posts", http.StatusForbidden)
		return
	}

	if err := dataaccess.DeletePost(postID); err != nil {
		http.Error(w, "Could not delete post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Post deleted successfully",
	})
}

// VotePost handles voting on posts (upvote/downvote/remove vote)
// Validates vote values and prevents voting on deleted posts
func VotePost(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	var req models.VotePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.VoteValue != -1 && req.VoteValue != 0 && req.VoteValue != 1 {
		http.Error(w, "Vote value must be -1, 0, or 1", http.StatusBadRequest)
		return
	}

	post, err := dataaccess.GetPost(isAuthenticated, userID, postID)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	if post.IsDeleted {
		http.Error(w, "Cannot vote on deleted post", http.StatusGone)
		return
	}

	vote := models.PostVote{
		UserID:    userID,
		PostID:    postID,
		VoteValue: req.VoteValue,
	}

	if err := dataaccess.VotePost(vote); err != nil {
		http.Error(w, "Could not record vote", http.StatusInternalServerError)
		return
	}

	// maybe don't return updated score? get new store in seperate request?
	updatedPost, err := dataaccess.GetPost(isAuthenticated, userID, postID)
	if err != nil {
		http.Error(w, "Could not fetch updated post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"message": "Vote recorded successfully",
		"score":   updatedPost.Score,
	})
}

// GetPost retrieves a single post by ID from URL parameters
// Returns the post data as JSON if found, otherwise returns 404
func GetPost(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	post, err := dataaccess.GetPost(isAuthenticated, userID, postID)

	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch post", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func ListPosts(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)

	var req models.ListPostsRequest
	if err := utils.Decoder.Decode(&req, r.URL.Query()); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	posts, count, err := dataaccess.ListPosts(isAuthenticated, userID, req)
	if err != nil {
		http.Error(w, "Failed to fetch posts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]any{
		"posts": posts,
		"count": count,
	})
}

// GetPost retrieves a single post by ID from URL parameters
// Returns the post data as JSON if found, otherwise returns 404
func PinComment(w http.ResponseWriter, r *http.Request) {
	userID, isAuthenticated := GetUserFromContext(r)
	if !isAuthenticated {
		http.Error(w, "Authentication required", http.StatusUnauthorized)
		return
	}

	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	var req models.PinCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	post, err := dataaccess.GetPost(isAuthenticated, userID, postID)
	if err != nil {
		if err.Error() == constants.NOT_FOUND_ERROR {
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch post", http.StatusInternalServerError)
		return
	}

	if post.UserID != userID {
		http.Error(w, "You can only pin comments on your own posts", http.StatusForbidden)
		return
	}

	var message string
	if req.CommentID != nil {
		comment, err := dataaccess.GetComment(isAuthenticated, userID, *req.CommentID)
		if err != nil {
			if err.Error() == constants.NOT_FOUND_ERROR {
				http.Error(w, "Comment not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Failed to fetch comment", http.StatusInternalServerError)
			return
		}

		if comment.PostID != postID {
			http.Error(w, "Comment does not belong to this post", http.StatusBadRequest)
			return
		}

		if comment.ParentID != nil {
			http.Error(w, "Only top-level comments can be pinned", http.StatusBadRequest)
			return
		}

		if err := dataaccess.PinComment(postID, *req.CommentID); err != nil {
			http.Error(w, "Could not pin comment", http.StatusInternalServerError)
			return
		}
		message = "Comment pinned successfully"
	} else {
		if err := dataaccess.UnpinComment(postID); err != nil {
			http.Error(w, "Could not unpin comment", http.StatusInternalServerError)
			return
		}
		message = "Comment unpinned successfully"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"message": message,
	})
}
