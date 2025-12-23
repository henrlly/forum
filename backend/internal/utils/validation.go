package utils

import (
	"cvwo/internal/constants"
	"fmt"
	"regexp"
)

func ValidateEmail(email string) string {
	if email == "" {
		return "Email is required"
	}
	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	if !emailRegex.MatchString(email) {
		return "Please enter a valid email address"
	}

	return ""
}

func ValidateUsername(username string) string {
	if username == "" {
		return "Username is required"
	}

	if len(username) < constants.MIN_USERNAME_LENGTH {
		return fmt.Sprintf("Username must be at least %d characters", constants.MIN_USERNAME_LENGTH)
	}

	if len(username) > constants.MAX_USERNAME_LENGTH {
		return fmt.Sprintf("Username must be no more than %d characters", constants.MAX_USERNAME_LENGTH)
	}

	// Letters, numbers, and underscores only
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !usernameRegex.MatchString(username) {
		return "Username can only contain letters, numbers, and underscores"
	}

	return ""
}

func ValidatePostTitle(title string) string {
	if title == "" {
		return "Title is required"
	}

	if len(title) > constants.MAX_POST_TITLE_LENGTH {
		return fmt.Sprintf("Title must be less than %d characters", constants.MAX_POST_TITLE_LENGTH)
	}

	return ""
}

func ValidatePostContent(content string) string {
	if len(content) > constants.MAX_POST_CONTENT_LENGTH {
		return fmt.Sprintf("Content must be less than %d characters", constants.MAX_POST_CONTENT_LENGTH)
	}

	return ""
}

func ValidateCommentContent(content string) string {
	if content == "" {
		return "Content is required"
	}

	if len(content) > constants.MAX_COMMENT_CONTENT_LENGTH {
		return fmt.Sprintf("Content must be less than %d characters", constants.MAX_COMMENT_CONTENT_LENGTH)
	}

	return ""
}

func ValidatePassword(password string) string {
	if password == "" {
		return "Password is required"
	}

	if len(password) < constants.MIN_PASSWORD_LENGTH {
		return fmt.Sprintf("Password must be at least %d characters", constants.MIN_PASSWORD_LENGTH)
	}

	if len(password) > constants.MAX_PASSWORD_LENGTH {
		return fmt.Sprintf("Password must be no more than %d characters", constants.MAX_PASSWORD_LENGTH)
	}

	return ""
}
