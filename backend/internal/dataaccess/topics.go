package dataaccess

import (
	"cvwo/internal/constants"
	"cvwo/internal/database"
	"cvwo/internal/models"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

// ListTopics retrieves all topics with their post and follower counts
func ListTopicsSummary() ([]models.Topic, error) {
	query := `
		SELECT id,
		name
		FROM topics
		ORDER BY name ASC`

	rows, err := database.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	topics := []models.Topic{}
	for rows.Next() {
		var topic models.Topic
		if err := rows.Scan(&topic.ID, &topic.Name); err != nil {
			return nil, err
		}
		topics = append(topics, topic)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return topics, nil
}

// ListTopics retrieves all topics with their post and follower counts
func ListTopics(isAuthenticated bool, currentUserID int, req models.ListTopicsRequest) ([]models.Topic, int, error) {
	args := []any{}
	var queryBuilder strings.Builder

	selectFields := `
		t.id,
		t.name,
		t.no_of_posts,
		t.no_of_followers,
		t.description`

	if isAuthenticated {
		query := fmt.Sprintf(`
			SELECT %s,
			CASE WHEN ut.user_id IS NOT NULL THEN true ELSE false END
			FROM topics t

			LEFT JOIN user_topics ut
				ON t.id = ut.topic_id
				AND ut.user_id = $1
			WHERE 1=1`, selectFields)

		queryBuilder.WriteString(query)
		args = append(args, currentUserID)
	} else {
		query := fmt.Sprintf(`
			SELECT %s,
			0
			FROM topics t
			WHERE 1=1`, selectFields)

		queryBuilder.WriteString(query)
	}

	if req.Search != "" {
		args = append(args, "%"+req.Search+"%")
		queryBuilder.WriteString(fmt.Sprintf(" AND t.name ILIKE $%d", len(args)))
	}

	if req.FilterFollowing {
		if !isAuthenticated {
			return nil, 0, errors.New("user must be authenticated when filtering by following status")
		}
		queryBuilder.WriteString(" AND ut.user_id IS NOT NULL")
	}

	// Get total count for pagination
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s)", queryBuilder.String())
	var totalCount int
	err := database.DB.QueryRow(countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	switch req.Sort {
	case constants.ORDER_BY_POSTS:
		queryBuilder.WriteString(" ORDER BY t.no_of_posts")
	case constants.ORDER_BY_FOLLOWERS:
		queryBuilder.WriteString(" ORDER BY t.no_of_followers")
	default:
		queryBuilder.WriteString(" ORDER BY t.name")
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

	topics := []models.Topic{}
	for rows.Next() {
		var topic models.Topic
		if err := rows.Scan(
			&topic.ID,
			&topic.Name,
			&topic.NoOfPosts,
			&topic.NoOfFollowers,
			&topic.Description,
			&topic.IsFollowing,
		); err != nil {
			return nil, 0, err
		}
		topics = append(topics, topic)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return topics, totalCount, nil
}

func GetTopicByName(isAuthenticated bool, userID int, topicName string) (*models.Topic, error) {
	var query string
	args := []any{topicName}
	topic := &models.Topic{}

	selectFields := `
		t.id,
		t.name,
		t.no_of_posts,
		t.no_of_followers,
		t.description`

	if isAuthenticated {
		query = fmt.Sprintf(`
			SELECT %s,
			CASE WHEN ut.user_id IS NOT NULL THEN true ELSE false END
			FROM topics t

			LEFT JOIN user_topics ut
				ON t.id = ut.topic_id
				AND ut.user_id = $2
			WHERE t.name = $1`, selectFields)

		args = append(args, userID)
	} else {
		query = fmt.Sprintf(`
					SELECT %s,
					0
					FROM topics t
					WHERE t.name = $1`, selectFields)
	}

	err := database.DB.QueryRow(query, args...).Scan(
		&topic.ID,
		&topic.Name,
		&topic.NoOfPosts,
		&topic.NoOfFollowers,
		&topic.Description,
		&topic.IsFollowing,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New(constants.NOT_FOUND_ERROR)
		}
		return nil, err
	}
	return topic, nil
}

// Transaction to ensure both insert and update are atomic
func FollowTopic(userID int, topicName string) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get topic ID from topic name
	selectQuery := `
		SELECT id
		FROM topics
		WHERE name = $1`

	var topicID int
	err = tx.QueryRow(selectQuery, topicName).Scan(&topicID)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New(constants.NOT_FOUND_ERROR)
		}
		return fmt.Errorf("failed to get topic ID: %w", err)
	}

	query := `
		INSERT INTO user_topics (user_id, topic_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, topic_id) DO NOTHING`

	res, err := tx.Exec(query, userID, topicID)
	if err != nil {
		return fmt.Errorf("failed to follow topic: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	updateTopicQuery := `
		UPDATE topics SET
			no_of_followers = no_of_followers + 1
		WHERE id = $1`

	_, err = tx.Exec(updateTopicQuery, topicID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

// Transaction to ensure both delete and update are atomic
func UnfollowTopic(userID int, topicName string) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get topic ID from topic name
	selectQuery := `
		SELECT id
		FROM topics
		WHERE name = $1`

	var topicID int
	err = tx.QueryRow(selectQuery, topicName).Scan(&topicID)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New(constants.NOT_FOUND_ERROR)
		}
		return fmt.Errorf("failed to get topic ID: %w", err)
	}

	query := `
		DELETE FROM user_topics
	 	WHERE user_id = $1 AND topic_id = $2`

	res, err := tx.Exec(query, userID, topicID)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New(constants.NO_ROWS_AFFECTED_ERROR)
	}

	updateTopicQuery := `
		UPDATE topics SET
			no_of_followers = no_of_followers - 1
		WHERE id = $1`

	_, err = tx.Exec(updateTopicQuery, topicID)
	if err != nil {
		return err
	}

	return tx.Commit()
}
