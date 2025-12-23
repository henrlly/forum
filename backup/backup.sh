#!/bin/sh
set -e

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/postgres_$DATE.sql.gz"

echo "Starting backup: $FILENAME"
pg_dump | gzip > "$FILENAME"
echo "Backup completed"

echo "Deleting backups older than $BACKUP_RETENTION_DAYS days"
find "$BACKUP_DIR" -type f -mtime +$BACKUP_RETENTION_DAYS -delete
echo "Old backups deleted"
