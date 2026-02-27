# User Manual

## Getting Started

### Registration and Login

1. Visit the forum homepage and click **"Register"**.
2. Provide a unique username, email address, and password.
3. After registration, log in with your email and password.

---

### Navigation

* Use the sidebar to access:

  * All Posts
  * Feed (your followed topics)
  * Topics
  * Users
  * Comments
* Click your profile icon in the top bar to:

  * Access profile settings
  * Log out
* Click your username in the top bar to view your public user page.
* Click username/topic chips in posts or comments to view their respective pages.

---

## Lists

* Click the **Show/Hide** button beside the list title to toggle visibility of search, filter, and sort controls.
* Use the search bar to find specific posts, topics, users, or comments by keywords.
* Use the sort dropdown to order lists by:

  * Newest
  * Most Upvotes
  * Most Comments
* Use the filter toggle to narrow topics by followed/unfollowed.
* Use pagination controls at the bottom of lists to navigate multiple pages.

---

## Posts and Comments

* Click a post title to view its content and comment section.
* Add comments using the text area at the bottom of the post page.
* Reply to comments by clicking the **Reply** button.
* Show or hide long comment threads using the **Show replies / Hide replies** button.
* If you are the post author, you can pin a top-level comment to the top of the comment section.
* For long posts/comments:

  * Click **Read more** to expand
  * Click **Show less** to collapse
* Click the share icon to copy a direct link to a post/comment.
* Click the edit icon to edit your own posts/comments.
* Click the delete icon to delete your own posts/comments.
  *(Only the content and title are removed to preserve discussion context.)*

---

## Creating a Post

* Click the **New Post** button beside the title in:

  * All Posts
  * Feed
  * Topic pages
* Select a topic.
* Enter a title and content.
* Click **Create Post**.

---

## Account Settings

* Change your password.
* Edit your username or email.
* View your:

  * User ID
  * Karma
  * Account creation date

---

## Other Features

* Click the light/dark mode icon in the top bar to toggle themes.

---

# Appendix: Feature List

## Authentication

* User registration with email, username, and password validation
* Secure login with JWT token
* Password hashing using bcrypt
* Profile management (update username, email, password)

---

## Lists (Topics, Users, Comments, Posts)

* Text search
* Pagination
* Sorting by various criteria
* Filtering for followed topics

---

## Topics

* Topic description
* Follow/unfollow functionality
* Topic statistics:

  * Post count
  * Follower count
* Sorting by:

  * Name
  * Post count
  * Follower count

---

## Users

* User statistics (karma, account creation date)
* List of posts by a user
* List of comments by a user
* Sorting by:

  * Newest
  * Oldest
  * Karma

---

## Comments

* Show/hide long comments (backend truncation for smaller API responses)
* Nested replies
* Creation and edited timestamps
* Editing and soft deletion
* Direct comment linking
* Hierarchical reply threads
* Lists:

  * All comments
  * Comments by post
  * Comments by user
* Sorting by:

  * Newest
  * Oldest
  * Score

---

## Posts

* Show/hide long posts (backend truncation)
* Creation and edited timestamps
* Editing and soft deletion
* Pinning a comment
* Direct post linking
* Lists:

  * All posts
  * Posts by topic
  * Feed (followed topics)
  * Posts by user
* Sorting by:

  * Newest
  * Oldest
  * Score
  * Comment count

---

## Voting

* Voting on posts and comments
* Karma calculation based on post and comment scores

---

## User Interface

* Fully responsive design
* Material-UI component library
* Dark/light theme support
* Loading states and error alerts
* Real-time form validation
* Modal dialogs
* Snackbar notifications

---

## Performance Optimizations

* Database indexes
* Frontend caching with TanStack Query

---

## Deployment

* Docker containerization
* GitHub Actions CI/CD pipeline
* Automatic HTTPS with Caddy
* Automated backups

---

## Backend

* Air for hot reloading
* Request/response validation
* Atomic transactions
* Database seeding scripts
* Parameterized SQL queries for security
