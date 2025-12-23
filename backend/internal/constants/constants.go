package constants

// Field length constraints
const MAX_POST_TITLE_LENGTH = 500
const MAX_POST_CONTENT_LENGTH = 10_000
const MAX_COMMENT_CONTENT_LENGTH = 10_000

// User fields
const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 100

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 20

// Summary lengths
const COMMENT_SUMMARY_LENGTH = 400
const POST_SUMMARY_LENGTH = 400

// Error messages
const NO_ROWS_AFFECTED_ERROR = "no rows affected"
const NOT_FOUND_ERROR = "not found"

// Pagination defaults
const MAX_PAGE_SIZE = 10_000

// Sorting options
const ORDER_BY_NEW = "created_at"

const ORDER_BY_NAME = "name"
const ORDER_BY_FOLLOWERS = "no_of_followers"
const ORDER_BY_POSTS = "no_of_posts"

const ORDER_BY_KARMA = "karma"

const ORDER_BY_VOTES = "score"
const ORDER_BY_COMMENTS = "no_of_comments"

const SORT_ASC = "asc"
const SORT_DESC = "desc"
