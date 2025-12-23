package seed

import (
	dbUtils "cvwo/cmd/db/utils"
	"cvwo/internal/dataaccess"
	"cvwo/internal/database"
	"cvwo/internal/models"
	"cvwo/internal/utils"
	"fmt"
	"log"
)

func SeedDatabase() {
	fmt.Println("Seeding database from JSON files...")

	// Load topics
	var topics []models.Topic
	if err := dbUtils.ReadJSONFile("topics.json", &topics); err != nil {
		log.Fatal(err)
	}

	for _, topic := range topics {
		database.DB.Exec("INSERT INTO topics (name, description) VALUES ($1, $2)", topic.Name, topic.Description)
	}
	fmt.Printf("Inserted %d topics\n", len(topics))

	// Load users
	var seedUsers []models.User
	if err := dbUtils.ReadJSONFile("users.json", &seedUsers); err != nil {
		log.Fatal(err)
	}

	// Register users
	for _, user := range seedUsers {
		hashedPassword, err := utils.HashPassword(user.Password)
		if err != nil {
			log.Fatalf("Could not hash password for user %s: %v", user.Email, err)
		}
		user.Password = string(hashedPassword)
		err = dataaccess.CreateUser(user)
		if err != nil {
			log.Fatalf("Failed to register user %s: %v", user.Email, err)
		}
	}

	fmt.Printf("Inserted %d users\n", len(seedUsers))

	// Load posts
	var seedPosts []models.Post
	if err := dbUtils.ReadJSONFile("posts.json", &seedPosts); err != nil {
		log.Fatal(err)
	}

	// Create posts
	for _, post := range seedPosts {
		_, err := dataaccess.CreatePost(post)
		if err != nil {
			log.Fatalf("Failed to create post titled '%s': %v", post.Title, err)
		}
	}

	fmt.Printf("Inserted %d posts\n", len(seedPosts))

	// Load comments
	var seedComments []models.Comment
	if err := dbUtils.ReadJSONFile("comments.json", &seedComments); err != nil {
		log.Fatal(err)
	}

	// Create comments
	for _, comment := range seedComments {
		_, err := dataaccess.CreateComment(comment)
		if err != nil {
			log.Fatalf("Failed to create comment on post %d: %v", comment.PostID, err)
		}
	}

	fmt.Printf("Inserted %d comments\n", len(seedComments))

	// Load users' followed topics
	var userTopics []UserTopicSeed
	if err := dbUtils.ReadJSONFile("user_topics.json", &userTopics); err != nil {
		log.Fatal(err)
	}

	// Follow topics
	for _, ut := range userTopics {
		err := dataaccess.FollowTopic(ut.UserID, ut.TopicName)
		if err != nil {
			log.Fatalf("Failed to follow topic %s for user %d: %v", ut.TopicName, ut.UserID, err)
		}
	}

	fmt.Printf("Inserted %d user-topic follows\n", len(userTopics))

	// Load post votes
	var postVotes []models.PostVote
	if err := dbUtils.ReadJSONFile("post_votes.json", &postVotes); err != nil {
		log.Fatal(err)
	}

	// Vote on posts
	for _, vote := range postVotes {
		err := dataaccess.VotePost(vote)
		if err != nil {
			log.Fatalf("Failed to record vote for post %d by user %d: %v", vote.PostID, vote.UserID, err)
		}
	}

	fmt.Printf("Inserted %d post votes\n", len(postVotes))

	// Load comment votes
	var commentVotes []models.CommentVote
	if err := dbUtils.ReadJSONFile("comment_votes.json", &commentVotes); err != nil {
		log.Fatal(err)
	}

	// Vote on comments
	for _, vote := range commentVotes {
		err := dataaccess.VoteComment(vote)
		if err != nil {
			log.Fatalf("Failed to record vote for comment %d by user %d: %v", vote.CommentID, vote.UserID, err)
		}
	}

	fmt.Printf("Inserted %d comment votes\n", len(commentVotes))

	fmt.Println("Database seeded successfully!")
}
