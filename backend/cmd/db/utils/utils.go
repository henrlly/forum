package utils

import (
	"cvwo/embed"
	"encoding/json"
	"fmt"
)

func ReadSqlFile(filename string) ([]byte, error) {
	filePath := fmt.Sprintf("sql/%s", filename)
	return embed.SqlFiles.ReadFile(filePath)
}

func ReadJSONFile(filename string, target any) error {
	filePath := fmt.Sprintf("seed_data/%s", filename)
	data, err := embed.JsonFiles.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read %s: %v", filename, err)
	}

	if err := json.Unmarshal(data, target); err != nil {
		return fmt.Errorf("failed to parse %s: %v", filename, err)
	}

	return nil
}
