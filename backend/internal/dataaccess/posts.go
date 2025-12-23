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

// CreatePost creates a new post in the database with automatic summary generation
// Uses transaction to ensure both post creation and topic count update are atomic
// Returns the newly created post ID or an error if creation fails
func CreatePost(post models.Post) (int, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Insert the new post
	query := `
		INSERT INTO posts (
			topic_id,
			title,
			summary,
			content,
			user_id,
			created_at,
			updated_at,
			is_deleted)
		VALUES ($1, $2, $3, $4, $5, $6, $6, false) RETURNING id`

	var postID int
	now := time.Now()
	summary, _ := utils.GeneratePostSummary(post)
	err = tx.QueryRow(query,
		post.TopicID,
		post.Title,
		summary,
		post.Content,
		post.UserID,
		now,
	).Scan(&postID)
	if err != nil {
		return 0, err
	}

	// Update topic post count
	updateTopicQuery := `
		UPDATE topics SET
			no_of_posts = no_of_posts + 1
		WHERE id = $1`

	_, err = tx.Exec(updateTopicQuery, post.TopicID)
	if err != nil {
		return 0, err
	}

	return postID, tx.Commit()
}

// UpdatePost modifies an existing post's content and regenerates its summary
// Only updates non-deleted posts and returns error if post is not found or deleted
func UpdatePost(post models.Post) error {
	query := `
		UPDATE posts SET
			title = $1,
			summary = $2,
			content = $3,
			updated_at = $4
		WHERE id = $5 AND is_deleted = false`

	now := time.Now()
	summary, _ := utils.GeneratePostSummary(post)

	result, err := database.DB.Exec(query,
		post.Title,
		summary,
		post.Content,
		now,
		post.ID,
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

// DeletePost performs a soft delete by marking the post as deleted (tombstone pattern)
// Preserves data integrity while hiding the post from normal queries
// Uses transaction to ensure both post deletion and topic count update are atomic
// Using tombstone - mark as deleted instead of actually deleting
func DeletePost(id int) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// First get the topic_id before marking as deleted
	getTopicQuery := `
		SELECT topic_id
		FROM posts WHERE id = $1
		AND is_deleted = false`

	var topicID int
	err = tx.QueryRow(getTopicQuery, id).Scan(&topicID)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
		}
		return err
	}

	// Mark post as deleted
	now := time.Now()
	deleteQuery := `
		UPDATE posts SET
			is_deleted = true,
			deleted_at = $1
		WHERE id = $2 AND is_deleted = false`

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

	// Update topic's post count
	updateTopicQuery := `
		UPDATE topics SET
			no_of_posts = no_of_posts - 1
		WHERE id = $1`

	_, err = tx.Exec(updateTopicQuery, topicID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// VotePost records or updates a user's vote on a post
// Uses upsert pattern (INSERT ... ON CONFLICT) and atomic transactions
// Automatically recalculates post score based on all votes
// Transaction to ensure vote and score update are atomic
func VotePost(vote models.PostVote) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Check if post exists and is not deleted (again, for safety)
	checkQuery := `
		SELECT EXISTS(SELECT 1 FROM posts
			WHERE id = $1 AND is_deleted = false)`

	var exists bool
	err = tx.QueryRow(checkQuery, vote.PostID).Scan(&exists)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	query := `
		INSERT INTO post_votes (
			user_id,
			post_id,
			vote_value)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, post_id)
		DO UPDATE SET vote_value = EXCLUDED.vote_value`

	_, err = tx.Exec(query, vote.UserID, vote.PostID, vote.VoteValue)
	if err != nil {
		return err
	}

	// Update post score
	updateScoreQuery := `
		UPDATE posts SET
			score = COALESCE((
				SELECT SUM(vote_value) FROM post_votes
				WHERE post_id = $1), 0)
		WHERE id = $1`

	_, err = tx.Exec(updateScoreQuery, vote.PostID)
	if err != nil {
		return err
	}

	userIdQuery := `
		SELECT p.user_id
	    FROM posts p
	    WHERE p.id = $1`

	updateKarmaQuery := queries.MakeUpdateKarmaQuery(userIdQuery)

	_, err = tx.Exec(updateKarmaQuery, vote.PostID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// GetPosts retrieves a paginated list of posts with optional filtering by topic and user
// Excludes deleted posts and orders by creation date (newest first)
// Parameters: limit (max results), offset (pagination), topicID (optional filter), userID (optional filter)
func ListPosts(isAuthenticated bool, currentUserID int, req models.ListPostsRequest) ([]models.Post, int, error) {
	args := []any{}
	var queryBuilder strings.Builder

	// no content, no pinned_comment_id field
	selectFields := `
		p.id,
		p.topic_id,
		p.title,
		p.summary,
		p.created_at,
		p.updated_at,
		p.user_id,
		COALESCE(p.score, 0),
		COALESCE(p.no_of_comments, 0),
		p.is_deleted,
		p.deleted_at,
		t.name,
		u.username`

	if isAuthenticated {
		args = append(args, currentUserID)
		if req.FilterFollowingTopics {
			query := fmt.Sprintf(`
				SELECT %s,
				COALESCE(v.vote_value, 0)
				FROM posts p

				LEFT JOIN post_votes v
					ON p.id = v.post_id
					AND v.user_id = $1
				LEFT JOIN topics t ON p.topic_id = t.id
				LEFT JOIN users u ON p.user_id = u.id
				INNER JOIN user_topics ut
					ON p.topic_id = ut.topic_id
					AND ut.user_id = $1
				WHERE 1=1`, selectFields)

			queryBuilder.WriteString(query)
		} else {
			query := fmt.Sprintf(`
				SELECT %s,
				COALESCE(v.vote_value, 0)
				FROM posts p

				LEFT JOIN post_votes v
					ON p.id = v.post_id
					AND v.user_id = $1
				LEFT JOIN topics t ON p.topic_id = t.id
				LEFT JOIN users u ON p.user_id = u.id
				WHERE 1=1`, selectFields)

			queryBuilder.WriteString(query)
		}
	} else {
		query := fmt.Sprintf(`
			SELECT %s,
			0
			FROM posts p

			LEFT JOIN topics t ON p.topic_id = t.id
			LEFT JOIN users u ON p.user_id = u.id
			WHERE 1=1`, selectFields)

		queryBuilder.WriteString(query)
	}

	if req.Search != "" {
		args = append(args, "%"+req.Search+"%")
		queryBuilder.WriteString(fmt.Sprintf(" AND p.title ILIKE $%d", len(args)))
	}

	if req.ShowDeletedPosts == false {
		queryBuilder.WriteString(" AND p.is_deleted = false")
	}

	if req.UserID != nil {
		args = append(args, *req.UserID)
		queryBuilder.WriteString(fmt.Sprintf(" AND p.user_id = $%d", len(args)))
	}

	if req.TopicID != nil {
		args = append(args, *req.TopicID)
		queryBuilder.WriteString(fmt.Sprintf(" AND p.topic_id = $%d", len(args)))
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
		queryBuilder.WriteString(" ORDER BY p.score")
	case constants.ORDER_BY_COMMENTS:
		queryBuilder.WriteString(" ORDER BY p.no_of_comments")
	default:
		queryBuilder.WriteString(" ORDER BY p.created_at")
	}

	switch req.OrderBy {
	case constants.SORT_ASC:
		queryBuilder.WriteString(" ASC")
	default:
		queryBuilder.WriteString(" DESC")
	}

	if req.PageSize <= 0 || req.PageSize > constants.MAX_PAGE_SIZE {
		req.PageSize = constants.MAX_PAGE_SIZE
	}

	args = append(args, req.PageSize)
	queryBuilder.WriteString(fmt.Sprintf(" LIMIT $%d", len(args)))

	if req.Page > 0 {
		offset := (req.Page - 1) * req.PageSize
		args = append(args, offset)
		queryBuilder.WriteString(fmt.Sprintf(" OFFSET $%d", len(args)))
	}

	rows, err := database.DB.Query(queryBuilder.String(), args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(
			&post.ID,
			&post.TopicID,
			&post.Title,
			&post.Summary,
			&post.CreatedAt,
			&post.UpdatedAt,
			&post.UserID,
			&post.Score,
			&post.NoOfComments,
			&post.IsDeleted,
			&post.DeletedAt,
			&post.TopicName,
			&post.Username,
			&post.MyVote,
		); err != nil {
			return nil, 0, err
		}

		// if post is deleted, clear title and summary
		// content is not selected in this query
		if post.IsDeleted {
			post.Title = ""
			post.Summary = ""
		}

		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return posts, totalCount, nil
}

// GetPostByID retrieves a single post by its ID, including deleted posts
// Returns nil and error if post is not found or deleted
func GetPost(isAutheticated bool, userID, postID int) (*models.Post, error) {
	var query string
	args := []any{postID}
	post := &models.Post{}

	selectFields := `
		p.id,
		p.topic_id,
		p.title,
		p.summary,
		p.content,
		p.created_at,
		p.updated_at,
		p.user_id,
		p.pinned_comment_id,
		COALESCE(p.score, 0),
		COALESCE(p.no_of_comments, 0),
		p.is_deleted,
		p.deleted_at,
		t.name,
		u.username`

	if isAutheticated {
		query = fmt.Sprintf(`
			SELECT %s,
			COALESCE(v.vote_value, 0)
			FROM posts p

			LEFT JOIN post_votes v
				ON p.id = v.post_id AND v.user_id = $2
			LEFT JOIN topics t ON p.topic_id = t.id
			LEFT JOIN users u ON p.user_id = u.id
			WHERE p.id = $1`, selectFields)

		args = append(args, userID)
	} else {
		query = fmt.Sprintf(`
			  SELECT %s,
			  0
			  FROM posts p

			  LEFT JOIN topics t ON p.topic_id = t.id
			  LEFT JOIN users u ON p.user_id = u.id
			  WHERE p.id = $1`, selectFields)
	}
	err := database.DB.QueryRow(query, args...).Scan(
		&post.ID,
		&post.TopicID,
		&post.Title,
		&post.Summary,
		&post.Content,
		&post.CreatedAt,
		&post.UpdatedAt,
		&post.UserID,
		&post.PinnedCommentID,
		&post.Score,
		&post.NoOfComments,
		&post.IsDeleted,
		&post.DeletedAt,
		&post.TopicName,
		&post.Username,
		&post.MyVote,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New(constants.NOT_FOUND_ERROR)
		}
		return nil, err
	}

	// if post is deleted, clear title, summary and content
	if post.IsDeleted {
		post.Title = ""
		post.Summary = ""
		post.Content = ""
	}

	return post, nil
}

func PinComment(postID, commentID int) error {
	query := `
		UPDATE posts SET
			pinned_comment_id = $2
		WHERE id = $1 AND is_deleted = false`

	result, err := database.DB.Exec(query, postID, commentID)
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

func UnpinComment(postID int) error {
	query := `
		UPDATE posts SET
			pinned_comment_id = NULL
		WHERE id = $1 AND is_deleted = false`

	result, err := database.DB.Exec(query, postID)
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
