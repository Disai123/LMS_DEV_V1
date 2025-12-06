#!/bin/bash
# RESTORE SCRIPT - Generated automatically
# Backup file: prod_backup_full_20251206_092958.sql
# Created: 2025-12-06 09:30:12
#
# WARNING: This will REPLACE all data in the production database!
# Make sure you want to restore before running this script.
#
# Usage: bash restore_prod_backup_full_20251206_092958.sh
#

set -e

echo "=========================================="
echo "WARNING: PRODUCTION DATABASE RESTORE"
echo "=========================================="
echo ""
echo "Backup file: prod_backup_full_20251206_092958.sql"
echo "Database: LMS_Prod"
echo ""
echo "WARNING: This will REPLACE all current data!"
echo ""
read -p "Type 'RESTORE' to confirm: " confirm

if [ "$confirm" != "RESTORE" ]; then
    echo "Restore cancelled."
    exit 1
fi

echo ""
echo "Starting restore..."
cd "$(dirname "$0")"

psql "postgresql://postgres:Datapx1_1234@database-2.cp4yisk00nwo.ap-southeast-1.rds.amazonaws.com:5432/LMS_Prod?sslmode=require" -f "prod_backup_full_20251206_092958.sql"

echo ""
echo "Restore completed successfully!"
