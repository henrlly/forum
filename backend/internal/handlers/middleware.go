package handlers

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

// Context keys for storing user info
type contextKey string
const UserIDKey contextKey = "userID"
const IsAuthenticatedKey contextKey = "isAuthenticated"

// Extracts user info if available, doesn't return 401 if not authenticated
func OptionalAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// No cookie
		cookie, err := r.Cookie("jwt")
		if err != nil {
			ctx = context.WithValue(ctx, IsAuthenticatedKey, false)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (any, error) {
			return secretKey, nil // secretKey is defined in auth.go
		})

		// Invalid token
		if err != nil || !token.Valid {
			ctx = context.WithValue(ctx, IsAuthenticatedKey, false)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// Invalid claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx = context.WithValue(ctx, IsAuthenticatedKey, false)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// Invalid user ID
		userIDFloat, ok := claims["issuer"].(float64)
		if !ok {
			ctx = context.WithValue(ctx, IsAuthenticatedKey, false)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}
		userID := int(userIDFloat)

		// Authenticated
		ctx = context.WithValue(ctx, UserIDKey, userID)
		ctx = context.WithValue(ctx, IsAuthenticatedKey, true)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Enforces authentication, returns 401 if not authenticated
func RequireAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		isAuthenticated, ok := r.Context().Value(IsAuthenticatedKey).(bool)
		if !ok || !isAuthenticated {
			http.Error(w, "Authentication required", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Extracts user information from request context
func GetUserFromContext(r *http.Request) (userID int, isAuthenticated bool) {
	isAuth, ok := r.Context().Value(IsAuthenticatedKey).(bool)
	if !ok {
		return 0, false
	}

	if !isAuth {
		return 0, false
	}

	userIDVal, ok := r.Context().Value(UserIDKey).(int)
	if !ok {
		return 0, false
	}

	return userIDVal, true
}
