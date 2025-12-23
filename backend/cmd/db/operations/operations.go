package operations

import (
	"cvwo/internal/database"
	"cvwo/cmd/db/utils"
	"fmt"
	"log"
)

func ResetDatabase() {
	fmt.Println("Resetting database...")

	// Drop existing tables
	dropSQL, err := utils.ReadSqlFile("drop.sql")
	if err != nil {
		log.Fatal("Failed to read drop.sql:", err)
	}

	if _, err := database.DB.Exec(string(dropSQL)); err != nil {
		log.Printf("Warning: Failed to execute drop queries: %v", err)
	}

	// Recreate tables
	schemaSQL, err := utils.ReadSqlFile("schema.sql")
	if err != nil {
		log.Fatal("Failed to read schema.sql:", err)
	}

	if _, err := database.DB.Exec(string(schemaSQL)); err != nil {
		log.Fatal("Failed to execute schema:", err)
	}

	fmt.Println("Database reset completed!")
}
