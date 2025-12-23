package utils

import (
	"strings"

	"cvwo/internal/constants"
	"cvwo/internal/models"
)

// Returns (summary string, isTruncated bool)
func generateSummary(content string, maxLength int) (string, bool) {
	content = strings.TrimSpace(content)
	if len(content) <= maxLength {
		return content, false
	}
	return content[:maxLength] + "...", true
}

func GenerateCommentSummary(comment models.Comment) (string, bool) {
	return generateSummary(comment.Content, constants.COMMENT_SUMMARY_LENGTH)
}

func GeneratePostSummary(post models.Post) (string, bool) {
	return generateSummary(post.Content, constants.POST_SUMMARY_LENGTH)
}
