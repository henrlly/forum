package models

type Topic struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	NoOfPosts     int    `json:"no_of_posts"`
	NoOfFollowers int    `json:"no_of_followers"`
	IsFollowing   bool   `json:"is_following"`
}

type UserTopic struct {
	UserID  int `json:"user_id"`
	TopicID int `json:"topic_id"`
}

type FollowTopicRequest struct {
	IsFollow bool `json:"is_follow" schema:"is_follow"`
}

type ListTopicsRequest struct {
	Page            int    `json:"page,omitempty" schema:"page"`
	PageSize        int    `json:"page_size,omitempty" schema:"page_size"`
	Sort            string `json:"sort,omitempty" schema:"sort"`
	OrderBy         string `json:"order_by,omitempty" schema:"order_by"`
	Search          string `json:"search,omitempty" schema:"search"`
	FilterFollowing bool   `json:"filter_following,omitempty" schema:"filter_following"`
}
