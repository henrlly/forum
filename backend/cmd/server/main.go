package main

import (
	"cvwo/internal/database"
	"cvwo/internal/routes"
	seedUtil "cvwo/cmd/db/seed"
	"cvwo/cmd/db/operations"
	"flag"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	var (
		seed  = flag.Bool("seed", false, "Seed the database with initial data")
	)

	flag.Parse()

	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()

	if *seed {
		operations.ResetDatabase()
		seedUtil.SeedDatabase()
	}

	r := chi.NewRouter()

	// Enable CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:80", "http://localhost"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Add /api prefix
	r.Route("/api", routes.GetRoutes())

	log.Println("Starting server on :8000...")
	err := http.ListenAndServe(":8000", r)
	if err != nil {
		log.Fatal(err)
	}
}
