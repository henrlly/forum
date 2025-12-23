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

func CreateUser(user models.User) error {
	query := `
		INSERT INTO users (email, username, password)
		VALUES ($1, $2, $3)`

	_, err := database.DB.Exec(query, user.Email, user.Username, user.Password)
	return err
}

// Retrieves username, email, password and id (for login)
func GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id,
		username,
		email,
		password
		FROM users
		WHERE email = $1`

	err := database.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

// Retrieves username, email, id, and created_at (for GetUserData)
func GetUserByID(id int) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id,
		username,
		email,
		karma,
		created_at
		FROM users
		WHERE id = $1`

	err := database.DB.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Karma,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Retrieves username, email, id, and created_at (for GetUserData)
func GetUserByUsername(username string) (*models.User, error) {
	user := &models.User{}
	query := `
		SELECT id,
		username,
		email,
		karma,
		created_at
		FROM users
		WHERE username = $1`

	err := database.DB.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Karma,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func UpdateUserPassword(id int, newPassword string) error {
	query := `
		UPDATE users SET
			password = $1
		WHERE id = $2`

	_, err := database.DB.Exec(query, newPassword, id)
	return err
}

func UpdateUserData(user *models.User) error {
	query := `
		UPDATE users SET
			email = $1,
			username = $2
		WHERE id = $3`

	_, err := database.DB.Exec(query,
		user.Email,
		user.Username,
		user.ID,
	)
	return err
}

func CheckUserExistsByEmail(email string) (bool, error) {
	query := `
		SELECT id
		FROM users
		WHERE email = $1`

	var id int
	err := database.DB.QueryRow(query, email).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func CheckUserExistsByUsername(username string) (bool, error) {
	query := `
		SELECT id
		FROM users
		WHERE username = $1`

	var id int
	err := database.DB.QueryRow(query, username).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// Retrieves users with pagination, sorting, and search functionality
func ListUsers(req models.ListUsersRequest) ([]models.User, int, error) {
	baseQuery := `
			SELECT id,
			username,
			karma,
			created_at
			FROM users
			WHERE 1=1`

	args := []any{}

	var queryBuilder strings.Builder
	queryBuilder.WriteString(baseQuery)

	if req.Search != "" {
		args = append(args, "%"+req.Search+"%")
		queryBuilder.WriteString(fmt.Sprintf(" AND username ILIKE $%d", len(args)))
	}

	// Get total count for pagination
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) AS count_query", queryBuilder.String())
	var totalCount int
	err := database.DB.QueryRow(countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	if req.Sort != "" {
		switch req.Sort {
		case constants.ORDER_BY_KARMA:
			queryBuilder.WriteString(" ORDER BY karma")
		default:
			queryBuilder.WriteString(" ORDER BY created_at")
		}
	}

	if req.OrderBy != "" {
		switch req.OrderBy {
		case constants.SORT_ASC:
			queryBuilder.WriteString(" ASC")
		default:
			queryBuilder.WriteString(" DESC")
		}
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

	users := []models.User{}
	for rows.Next() {
		var user models.User
		if err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Karma,
			&user.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return users, totalCount, nil
}
