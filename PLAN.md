# Execution Plan

## Project Overview

This execution plan outlines the development of a full-stack web forum application built with a **React/TypeScript frontend**, **Go backend**, and **PostgreSQL database**.

The forum provides core functionality for users to:

* View topics
* Create posts
* Create comments
* Authenticate with a simple user system

---

# User Stories

* As a visitor, I can register with an email and username so that I can participate in the forum.
* As a registered user, I can login with my email and password so that I can access my account.
* As a registered user, I can update my profile information so that I can keep my details current.
* As a visitor, I can view other users' profiles and their karma scores so that I can learn about community members.
* As a visitor, I can browse all available topics so that I can find areas of interest.
* As a registered user, I can follow/unfollow topics so that I can customize my feed.
* As a visitor, I can search for topics by name so that I can quickly find relevant discussions.
* As a registered user, I can create posts within topics so that I can share content and start discussions.
* As a visitor, I can view all posts in a topic so that I can see what's being discussed.
* As a post author, I can edit my own posts so that I can correct mistakes or add information.
* As a post author, I can delete my own posts so that I can remove content that's no longer relevant.
* As a visitor, I can search for posts by title or content so that I can find specific discussions.
* As a registered user, I can comment on posts so that I can participate in discussions.
* As a registered user, I can reply to other comments so that I can have threaded conversations.
* As a comment author, I can edit my own comments so that I can fix errors.
* As a comment author, I can delete my own comments so that I can remove inappropriate or outdated content.
* As a registered user, I can upvote/downvote posts so that I can show approval or disapproval.
* As a registered user, I can upvote/downvote comments so that quality content rises to the top.
* As a visitor, I can see post and comment scores so that I can identify popular content.
* As a post author, I can pin important comments on my posts so that key information is highlighted.
* As a visitor, I can see when posts/comments are deleted so that I understand the discussion context.
* As a registered user, I can see my personalized feed with posts from topics I follow so that I can focus on content that interests me.
* As a visitor, I can navigate through paginated list views so that pages load quickly.
* As a visitor, I can sort content by different criteria (newest, score, etc.) so that I can find the most relevant information.
* As a visitor, I can see user karma scores so that I can gauge community standing and credibility.

---

# Architecture

## Frontend (React + TypeScript)

* React with TypeScript for type safety
* Vite for fast development and optimized builds
* Material UI for consistent, accessible UI components
* TanStack Router for type-safe client-side routing
* TanStack Query for server state management and caching
* React Hook Form + Zod for form handling and schema validation
* Axios for communication with the backend RESTful API

---

## Backend (Go)

Forked from the sample Go application provided.

* Chi for lightweight HTTP routing
* golang-jwt for JWT-based authentication
* gorilla/schema for request parsing
* pq for PostgreSQL driver
* Air for hot reloading during development
* RESTful endpoints for:

  * Users
  * Topics
  * Posts
  * Comments
* Search, sorting, filtering, and pagination for list endpoints

---

## Database (PostgreSQL)

* `ltree` extension for efficient nested comments with path queries
* `pg_trgm` extension for fuzzy text search with GIN indexes

### Tables

* `users` – User accounts with karma scoring
* `topics` – Discussion categories with follower counts
* `user_topics` – Follow tracking between users and topics
* `posts` – Forum posts with soft deletion support
* `comments` – Nested comments using `ltree` for path storage
* `post_votes` and `comment_votes` – Vote tracking for scoring system

---

# Deployment

* Docker Compose for containerized local development and production
* AWS EC2 for hosting
* Caddy for reverse proxy and automatic HTTPS
