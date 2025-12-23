package models

import "time"

type Comment struct {
	ID             int        `json:"id"`
	PostID         int        `json:"post_id"`
	Content        string     `json:"content"`
	Summary        string     `json:"summary"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	UserID         int        `json:"user_id"`
	Score          int        `json:"score"`
	ParentID       *int       `json:"parent_id"`
	Path           string     `json:"path"`
	NoOfReplies    int        `json:"no_of_replies"`
	IsDeleted      bool       `json:"is_deleted"`
	DeletedAt      *time.Time `json:"deleted_at,omitempty"`
	MyVote         int        `json:"my_vote"`
	PostTitle      string     `json:"post_title,omitempty"`
	HasLongContent bool       `json:"has_long_content,omitempty"`
	Username       string     `json:"username,omitempty"`
	TopicName      string     `json:"topic_name,omitempty"`
}

type CommentVote struct {
	UserID    int `json:"user_id"`
	CommentID int `json:"comment_id"`
	VoteValue int `json:"vote_value"`
}

type CreateCommentRequest struct {
	PostID   int    `json:"post_id" schema:"post_id"`
	Content  string `json:"content" schema:"content"`
	ParentID *int   `json:"parent_id,omitempty" schema:"parent_id"`
}

type UpdateCommentRequest struct {
	Content string `json:"content" schema:"content"`
}

type VoteCommentRequest struct {
	VoteValue int `json:"vote_value" schema:"vote_value"`
}

type ListCommentsRequest struct {
	Page                int    `json:"page,omitempty" schema:"page"`
	PageSize            int    `json:"page_size,omitempty" schema:"page_size"`
	Sort                string `json:"sort,omitempty" schema:"sort"`
	OrderBy             string `json:"order_by,omitempty" schema:"order_by"`
	Search              string `json:"search,omitempty" schema:"search"`
	PostID              *int   `json:"post_id,omitempty" schema:"post_id"`
	UserID              *int   `json:"user_id,omitempty" schema:"user_id"`
	ParentID            *int   `json:"parent_id,omitempty" schema:"parent_id"`
	OnlyTopLevel        bool   `json:"only_top_level,omitempty" schema:"only_top_level"`
	ShowDeletedComments bool   `json:"show_deleted_comments,omitempty" schema:"show_deleted_comments"`
	ShowPostTitle       bool   `json:"show_post_title,omitempty" schema:"show_post_title"`
}
