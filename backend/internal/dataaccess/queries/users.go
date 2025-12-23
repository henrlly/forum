package queries

import "fmt"

// Update user karma for the user
// User karma is sum of scores from all of the user's posts and comments
func MakeUpdateKarmaQuery(userIdQuery string) string {
	updateKarmaQuery :=
		`UPDATE users SET karma =
			COALESCE((
				SELECT SUM(p.score)
				FROM posts p
				WHERE p.user_id = users.id
			), 0) +
			COALESCE((
				SELECT SUM(c.score)
				FROM comments c
				WHERE c.user_id = users.id
				), 0)
			WHERE users.id = (%s)`
	return fmt.Sprintf(updateKarmaQuery, userIdQuery)
}
