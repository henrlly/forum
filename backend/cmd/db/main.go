package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"cvwo/cmd/db/operations"
	"cvwo/cmd/db/seed"
	"cvwo/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	var (
		action  = flag.String("action", "", "Action: reset, seed")
		envFile = flag.String("env-file", "", "Path to .env file (e.g. ./backend/.env)")
	)
	flag.Parse()

	if *action == "" {
		fmt.Println("Usage: go run main.go --action=<reset|seed> [--env-file=<path>]")
		os.Exit(1)
	}

	if *envFile == "" {
		*envFile = "../.env"
	}

	if err := godotenv.Load(*envFile); err != nil {
		log.Println("No .env file found")
	}

	database.Connect()
	defer database.DB.Close()

	switch *action {
	case "reset":
		operations.ResetDatabase()
	case "seed":
		operations.ResetDatabase()
		seed.SeedDatabase()
	default:
		log.Fatalf("Unknown action: %s", *action)
	}
}
