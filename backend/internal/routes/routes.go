package routes

import (
	"cvwo/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		// Use standard middleware
		r.Use(middleware.Logger)
		r.Use(middleware.Recoverer)

		r.Post("/register", handlers.Register)
		r.Post("/login", handlers.Login)
		r.Post("/logout", handlers.Logout)

		r.Get("/topics-summary", handlers.ListTopicsSummary)
		r.Get("/users", handlers.ListUsers)

		// Can serve both authenticated and non-authenticated users
		// But authenticated users might get different responses
		r.Group(func(r chi.Router) {
			r.Use(handlers.OptionalAuthMiddleware)

			// Will get user's email if authenticated and username matches
			r.Get("/users/{username}", handlers.GetProfile)

			// Will get user's follow status if authenticated
			r.Get("/topics", handlers.ListTopics)
			r.Get("/topics/{topic_slug}", handlers.GetTopic)

			// Will get user's upvote status if authenticated
			r.Get("/posts", handlers.ListPosts)
			r.Get("/posts/{id}", handlers.GetPost)

			// Will get user's upvote status if authenticated
			r.Get("/comments", handlers.ListComments)
			r.Get("/comments/{id}", handlers.GetComment)
		})

		// Require authentication (will return 401 if not authenticated)
		r.Group(func(r chi.Router) {
			r.Use(handlers.OptionalAuthMiddleware)
			r.Use(handlers.RequireAuthMiddleware)

			r.Get("/me", handlers.GetUserAuthData)

			r.Post("/change-password", handlers.ChangePassword)
			r.Put("/profile", handlers.UpdateProfile)

			r.Post("/topics/{topic_slug}/follow", handlers.FollowTopic)

			r.Post("/posts", handlers.CreatePost)
			r.Put("/posts/{id}", handlers.UpdatePost)
			r.Delete("/posts/{id}", handlers.DeletePost)
			r.Post("/posts/{id}/vote", handlers.VotePost)
			r.Post("/posts/{id}/pin-comment", handlers.PinComment)

			r.Post("/comments", handlers.CreateComment)
			r.Put("/comments/{id}", handlers.UpdateComment)
			r.Delete("/comments/{id}", handlers.DeleteComment)
			r.Post("/comments/{id}/vote", handlers.VoteComment)
		})
	}
}
