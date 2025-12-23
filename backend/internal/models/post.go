package models

import "time"

type Post struct {
	ID              int        `json:"id"`
	TopicID         int        `json:"topic_id"`
	Title           string     `json:"title"`
	Summary         string     `json:"summary"`
	Content         string     `json:"content"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	UserID          int        `json:"user_id"`
	PinnedCommentID *int       `json:"pinned_comment_id,omitempty"`
	Score           int        `json:"score"`
	NoOfComments    int        `json:"no_of_comments"`
	IsDeleted       bool       `json:"is_deleted"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty"`
	MyVote          int        `json:"my_vote,omitempty"`
	TopicName       string     `json:"topic_name,omitempty"`
	Username        string     `json:"username,omitempty"`
}

type PostVote struct {
	UserID    int `json:"user_id"`
	PostID    int `json:"post_id"`
	VoteValue int `json:"vote_value"`
}

type CreatePostRequest struct {
	TopicID int    `json:"topic_id" schema:"topic_id"`
	Title   string `json:"title" schema:"title"`
	Content string `json:"content" schema:"content"`
}

type UpdatePostRequest struct {
	Title   string `json:"title,omitempty" schema:"title"`
	Content string `json:"content,omitempty" schema:"content"`
}

type VotePostRequest struct {
	VoteValue int `json:"vote_value" schema:"vote_value"`
}

type ListPostsRequest struct {
	Page                 int    `json:"page,omitempty" schema:"page"`
	PageSize             int    `json:"page_size,omitempty" schema:"page_size"`
	Sort                 string `json:"sort,omitempty" schema:"sort"`
	OrderBy              string `json:"order_by,omitempty" schema:"order_by"`
	Search               string `json:"search,omitempty" schema:"search"`
	TopicID              *int   `json:"topic_id,omitempty" schema:"topic_id"`
	UserID               *int   `json:"user_id,omitempty" schema:"user_id"`
	FilterFollowingTopics bool   `json:"filter_following_topics,omitempty" schema:"filter_following_topics"`
	ShowDeletedPosts     bool   `json:"show_deleted_posts,omitempty" schema:"show_deleted_posts"`
}

type PinCommentRequest struct {
	CommentID *int `json:"comment_id" schema:"comment_id"`
}
