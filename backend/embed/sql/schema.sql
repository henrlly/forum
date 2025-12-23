-- Enable ltree extension for path to comment for nested comments
CREATE EXTENSION IF NOT EXISTS ltree;

-- Enable pg_trgm extension for better text search performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- SERIAL PRIMARY KEY starts from 1 by default

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    karma INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    no_of_posts INTEGER DEFAULT 0,
    no_of_followers INTEGER DEFAULT 0
);

-- User topics table
CREATE TABLE IF NOT EXISTS user_topics (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, topic_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    -- pinned_comment_id INTEGER REFERENCES comments(id) ON DELETE SET NULL, -- moved to the end
    score INTEGER DEFAULT 0,
    no_of_comments INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    path LTREE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    no_of_replies INTEGER DEFAULT 0,
    has_long_content BOOLEAN DEFAULT FALSE
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    vote_value INTEGER CHECK (vote_value IN (-1, 0, 1)),
    PRIMARY KEY (user_id, post_id)
);

-- Comment votes table
CREATE TABLE IF NOT EXISTS comment_votes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    vote_value INTEGER CHECK (vote_value IN (-1, 0, 1)),
    PRIMARY KEY (user_id, comment_id)
);

-- Add pinned_comment_id column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS
    pinned_comment_id INTEGER REFERENCES comments(id) ON DELETE SET NULL;

-- Indexes
-- Users table
CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON users USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_karma ON users (karma);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- Topics table
CREATE INDEX IF NOT EXISTS idx_topics_name_trgm ON topics USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_topics_no_of_posts ON topics (no_of_posts);
CREATE INDEX IF NOT EXISTS idx_topics_no_of_followers ON topics (no_of_followers);

-- User topics table
-- user_id is the first column in the primary key, so it is already indexed
CREATE INDEX IF NOT EXISTS idx_user_topics_topic_id ON user_topics (topic_id);

-- Posts table
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_topic_id ON posts (topic_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_score ON posts (score);
CREATE INDEX IF NOT EXISTS idx_posts_no_of_comments ON posts (no_of_comments);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at);

-- Post votes table
-- user_id is the first column in the primary key, so it is already indexed
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes (post_id);

-- Comments table
CREATE INDEX IF NOT EXISTS idx_comments_path_gist ON comments USING GIST (path);
CREATE INDEX IF NOT EXISTS idx_comments_content_trgm ON comments USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_score ON comments (score);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);

-- Comment votes table
-- user_id is the first column in the primary key, so it is already indexed
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes (comment_id);
