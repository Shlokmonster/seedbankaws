#!/bin/bash
# SeedBank Database Backup Script

set -e

BACKUP_DIR="$HOME/seedbank/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/seedbank_$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "📦 Starting database backup..."

# Run pg_dump from Docker container
docker exec seedbank_postgres pg_dump -U postgres seedbank_cloud | gzip > "$BACKUP_FILE"

echo "✅ Backup created at $BACKUP_FILE"

# Keep only last 7 backups
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "seedbank_*.sql.gz" -type f -mtime +7 -delete

echo "🎉 Backup process completed successfully!"
