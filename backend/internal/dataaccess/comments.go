package dataaccess

import (
	"cvwo/internal/constants"
	"cvwo/internal/dataaccess/queries"
	"cvwo/internal/database"
	"cvwo/internal/models"
	"cvwo/internal/utils"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

// CreateComment creates a new comment with proper path handling for nested structure
func CreateComment(comment models.Comment) (int, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Verify the post exists and is not deleted
	checkPostQuery := `
		SELECT EXISTS(SELECT 1 FROM posts
			WHERE id = $1 AND is_deleted = false)`

	var postExists bool
	err = tx.QueryRow(checkPostQuery, comment.PostID).Scan(&postExists)
	if err != nil {
		return 0, err
	}

	// If this is a reply to another comment, verify the parent exists
	var parentPath string
	var parentPostID int
	if comment.ParentID != nil {
		var parentExists bool
		checkParentQuery := `
			SELECT EXISTS(SELECT 1 FROM comments WHERE id = $1),
			COALESCE(path, ''),
			post_id
			FROM comments WHERE id = $1`

		err = tx.QueryRow(checkParentQuery, *comment.ParentID).Scan(
			&parentExists,
			&parentPath,
			&parentPostID,
		)
		if err != nil {
			return 0, err
		}
		if !parentExists {
			return 0, errors.New(constants.NOT_FOUND_ERROR)
		}
		if parentPostID != comment.PostID {
			return 0, errors.New("parent comment does not belong to the same post")
		}
	} else if !postExists {
		return 0, errors.New(constants.NOT_FOUND_ERROR)
	}


	// Insert the comment
	query := `
		INSERT INTO comments (
			post_id,
			content,
			summary,
			user_id,
			created_at,
			updated_at,
			parent_id,
			has_long_content,
			is_deleted)
		VALUES ($1, $2, $3, $4, $5, $5, $6, $7, false) RETURNING id`

	now := time.Now()
	summary, hasLongContent := utils.GenerateCommentSummary(comment)

	var commentID int
	err = tx.QueryRow(query,
		comment.PostID,
		comment.Content,
		summary,
		comment.UserID,
		now,
		comment.ParentID,
		hasLongContent,
	).Scan(&commentID)

	if err != nil {
		return 0, err
	}

	// Update the path
	var path string
	if comment.ParentID != nil {
		path = fmt.Sprintf("%s.%d", parentPath, commentID)
	} else {
		path = fmt.Sprintf("%d", commentID)
	}

	updatePathQuery := `
		UPDATE comments SET
			path = $1
		WHERE id = $2`

	_, err = tx.Exec(updatePathQuery, path, commentID)
	if err != nil {
		return 0, err
	}

	// Update post's comment count
	updatePostQuery := `
		UPDATE posts SET
			no_of_comments = no_of_comments + 1
		WHERE id = $1`

	_, err = tx.Exec(updatePostQuery, comment.PostID)
	if err != nil {
		return 0, err
	}

	// Update parent comment's reply count
	if comment.ParentID != nil {
		updateParentQuery := `
			UPDATE comments SET
				no_of_replies = no_of_replies + 1
			WHERE id = $1`

		_, err = tx.Exec(updateParentQuery, *comment.ParentID)
		if err != nil {
			return 0, err
		}
	}

	return commentID, tx.Commit()
}

// UpdateComment updates an existing comment's content
func UpdateComment(comment models.Comment) error {
	query := `
		UPDATE comments SET
			content = $1,
			summary = $2,
			updated_at = $3,
			has_long_content = $4
		WHERE id = $5`

	now := time.Now()
	summary, hasLongContent := utils.GenerateCommentSummary(comment)

	result, err := database.DB.Exec(query,
		comment.Content,
		summary,
		now,
		hasLongContent,
		comment.ID,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	return nil
}

// DeleteComment performs a soft delete by marking the comment as deleted (tombstone pattern)
func DeleteComment(id int) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get comment details before deletion
	getCommentQuery := `
		SELECT post_id,
		EXISTS(SELECT 1 FROM comments
			WHERE id = $1 AND is_deleted = false)
		FROM comments WHERE id = $1`

	var postID int
	var exists bool
	err = tx.QueryRow(getCommentQuery, id).Scan(&postID, &exists)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	// Perform soft delete
	deleteQuery := `
		UPDATE comments SET
			is_deleted = true,
			deleted_at = $1
		WHERE id = $2 AND is_deleted = false`

	now := time.Now()
	result, err := tx.Exec(deleteQuery, now, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	// Update post's comment count
	updatePostQuery := `
		UPDATE posts SET
			no_of_comments = no_of_comments - 1
		WHERE id = $1`

	_, err = tx.Exec(updatePostQuery, postID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// Transaction to ensure vote and score update are atomic
func VoteComment(vote models.CommentVote) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Check if comment exists and is not deleted (again, for safety)
	checkQuery := `
		SELECT EXISTS(SELECT 1 FROM comments
			WHERE id = $1 AND is_deleted = false)`

	var exists bool
	err = tx.QueryRow(checkQuery, vote.CommentID).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	query := `
		INSERT INTO comment_votes (
			user_id,
			comment_id,
			vote_value)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, comment_id)
		DO UPDATE SET vote_value = EXCLUDED.vote_value`

	_, err = tx.Exec(query, vote.UserID, vote.CommentID, vote.VoteValue)
	if err != nil {
		return err
	}

	// Update comment score
	updateScoreQuery := `
		UPDATE comments SET
			score = COALESCE((
				SELECT SUM(vote_value) FROM comment_votes
				WHERE comment_id = $1), 0)
		WHERE id = $1`

	_, err = tx.Exec(updateScoreQuery, vote.CommentID)
	if err != nil {
		return err
	}

	userIdQuery := `
		SELECT c.user_id
		FROM comments c
		WHERE c.id = $1`

	updateKarmaQuery := queries.MakeUpdateKarmaQuery(userIdQuery)

	_, err = tx.Exec(updateKarmaQuery, vote.CommentID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func ListComments(isAuthenticated bool, currentUserID int, req models.ListCommentsRequest) ([]models.Comment, int, error) {
	args := []any{}
	var queryBuilder strings.Builder

	selectFields := `
		c.id,
		c.post_id,
		c.summary,
		c.created_at,
		c.updated_at,
		c.user_id,
		COALESCE(c.score, 0),
		c.parent_id,
		COALESCE(c.path, ''),
		COALESCE(c.no_of_replies, 0),
		c.is_deleted,
		c.deleted_at,
		c.has_long_content,
		p.title,
		u.username,
		t.name`

	if isAuthenticated {
		query := fmt.Sprintf(`
			SELECT %s,
			COALESCE(v.vote_value, 0)
			FROM comments c

			LEFT JOIN users u ON c.user_id = u.id
			LEFT JOIN posts p ON c.post_id = p.id
			LEFT JOIN topics t ON p.topic_id = t.id
			LEFT JOIN comment_votes v
				ON c.id = v.comment_id
				AND v.user_id = $1
			WHERE 1=1`, selectFields)

		queryBuilder.WriteString(query)
		args = append(args, currentUserID)
	} else {
		query := fmt.Sprintf(`
			SELECT %s,
			0
			FROM comments c

			LEFT JOIN users u ON c.user_id = u.id
			LEFT JOIN posts p ON c.post_id = p.id
			LEFT JOIN topics t ON p.topic_id = t.id
			WHERE 1=1`, selectFields)

		queryBuilder.WriteString(query)
	}

	if req.Search != "" {
		args = append(args, "%"+req.Search+"%")
		queryBuilder.WriteString(fmt.Sprintf(" AND c.content ILIKE $%d", len(args)))
	}

	if req.ShowDeletedComments == false {
		queryBuilder.WriteString(" AND c.is_deleted = false")
	}

	if req.PostID != nil {
		args = append(args, *req.PostID)
		queryBuilder.WriteString(fmt.Sprintf(" AND c.post_id = $%d", len(args)))
	}

	if req.UserID != nil {
		args = append(args, *req.UserID)
		queryBuilder.WriteString(fmt.Sprintf(" AND c.user_id = $%d", len(args)))
	}

	if req.OnlyTopLevel {
		if req.ParentID != nil {
			args = append(args, *req.ParentID)
			queryBuilder.WriteString(fmt.Sprintf(" AND c.parent_id = $%d", len(args)))
		} else {
			queryBuilder.WriteString(" AND c.parent_id IS NULL")
		}
	} else {
		if req.ParentID != nil {
			args = append(args, *req.ParentID)
			// <@ returns all its subpaths, including itself (if it exists in the table)
			queryBuilder.WriteString(fmt.Sprintf(" AND c.path <@ (SELECT path FROM comments WHERE id = $%d) AND c.id != $%d", len(args), len(args)))
		}
	}

	// Get total count for pagination
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s)", queryBuilder.String())
	var totalCount int
	err := database.DB.QueryRow(countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	switch req.Sort {
	case constants.ORDER_BY_VOTES:
		queryBuilder.WriteString(" ORDER BY c.score")
	default:
		queryBuilder.WriteString(" ORDER BY c.created_at")
	}

	switch req.OrderBy {
	case constants.SORT_ASC:
		queryBuilder.WriteString(" ASC")
	default:
		queryBuilder.WriteString(" DESC")
	}

	if req.PageSize > 0 {
		args = append(args, req.PageSize)
		queryBuilder.WriteString(fmt.Sprintf(" LIMIT $%d", len(args)))
		if req.Page > 0 {
			offset := (req.Page - 1) * req.PageSize
			args = append(args, offset)
			queryBuilder.WriteString(fmt.Sprintf(" OFFSET $%d", len(args)))
		}
	}

	rows, err := database.DB.Query(queryBuilder.String(), args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	comments := []models.Comment{}
	for rows.Next() {
		var comment models.Comment
		if err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.Summary,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&comment.UserID,
			&comment.Score,
			&comment.ParentID,
			&comment.Path,
			&comment.NoOfReplies,
			&comment.IsDeleted,
			&comment.DeletedAt,
			&comment.HasLongContent,
			&comment.PostTitle,
			&comment.Username,
			&comment.TopicName,
			&comment.MyVote,
		); err != nil {
			return nil, 0, err
		}

		if !req.ShowPostTitle {
			comment.PostTitle = ""
		}

		// if comment is deleted, clear summary
		// content is not selected in this query
		if comment.IsDeleted {
			comment.Summary = ""
		}

		comments = append(comments, comment)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return comments, totalCount, nil
}

func GetComment(isAuthenticated bool, userID, commentID int) (*models.Comment, error) {
	var query string
	args := []any{commentID}

	selectFields := `
		c.id,
		c.post_id,
		c.content,
		c.summary,
		c.created_at,
		c.updated_at,
		c.user_id,
		COALESCE(c.score, 0),
		c.parent_id,
		COALESCE(c.path, ''),
		COALESCE(c.no_of_replies, 0),
		c.is_deleted,
		c.deleted_at,
		c.has_long_content,
		p.title,
		u.username,
		t.name`

	if isAuthenticated {
		query = fmt.Sprintf(`
			SELECT %s,
			COALESCE(v.vote_value, 0)
			FROM comments c

			LEFT JOIN users u ON c.user_id = u.id
			LEFT JOIN comment_votes v
				ON c.id = v.comment_id
				AND v.user_id = $2
			LEFT JOIN posts p ON c.post_id = p.id
			LEFT JOIN topics t ON p.topic_id = t.id
			WHERE c.id = $1`, selectFields)

		args = append(args, userID)
	} else {
		query = fmt.Sprintf(`
			SELECT %s,
			0
			FROM comments c

			LEFT JOIN users u ON c.user_id = u.id
			LEFT JOIN posts p ON c.post_id = p.id
			LEFT JOIN topics t ON p.topic_id = t.id
			WHERE c.id = $1`, selectFields)
	}

	comment := &models.Comment{}
	err := database.DB.QueryRow(query, args...).Scan(
		&comment.ID,
		&comment.PostID,
		&comment.Content,
		&comment.Summary,
		&comment.CreatedAt,
		&comment.UpdatedAt,
		&comment.UserID,
		&comment.Score,
		&comment.ParentID,
		&comment.Path,
		&comment.NoOfReplies,
		&comment.IsDeleted,
		&comment.DeletedAt,
		&comment.HasLongContent,
		&comment.PostTitle,
		&comment.Username,
		&comment.TopicName,
		&comment.MyVote,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New(constants.NOT_FOUND_ERROR)
		}
		return nil, err
	}

	// if comment is deleted, clear content and summary
	if comment.IsDeleted {
		comment.Content = ""
		comment.Summary = ""
	}

	return comment, nil
}
