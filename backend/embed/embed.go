package embed

import (
	"embed"
)

// Go's embed package to include files at compile time
// filepath relative to this embed.go file
// cannot import data from parent directories

//go:embed sql/*.sql
var SqlFiles embed.FS

//go:embed seed_data/*.json
var JsonFiles embed.FS
