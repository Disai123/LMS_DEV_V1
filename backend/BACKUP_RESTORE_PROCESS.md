# Production Database Backup & Restore Process

## Overview

This document explains the complete process for backing up and restoring your production database before and after data migration.

---

## 📋 Table of Contents

1. [Why Backup?](#why-backup)
2. [Prerequisites](#prerequisites)
3. [Backup Process](#backup-process)
4. [Migration Process](#migration-process)
5. [Restore Process](#restore-process)
6. [Troubleshooting](#troubleshooting)

---

## 🔒 Why Backup?

**Always backup before migration!** Here's why:

- ✅ **Safety Net**: If something goes wrong during migration, you can restore
- ✅ **Data Protection**: Production data is valuable - never risk losing it
- ✅ **Peace of Mind**: Test migration process with confidence
- ✅ **Rollback Option**: Easy revert if migration causes issues

**Remember**: The backup script only READS from production - it never modifies or deletes data.

---

## 📦 Prerequisites

### 1. Python 3.6+ Installed

Check if Python is installed:
```bash
python --version
# or
python3 --version
```

### 2. PostgreSQL Client Tools

You need `pg_dump` and `psql` commands available:

**Windows:**
- Install PostgreSQL (includes these tools)
- Add PostgreSQL bin directory to PATH

**Linux:**
```bash
sudo apt-get install postgresql-client
# or
sudo yum install postgresql
```

**Mac:**
```bash
brew install postgresql
```

### 3. Database Credentials

Ensure your `.env` file has production credentials in **lines 51-55**:
```env
DB_HOST=database-2.cp4yisk00nwo.ap-southeast-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=LMS_Prod
```

### 4. Network Access

Ensure you can connect to your production database from your machine:
- Check firewall rules
- Verify AWS RDS security group allows your IP
- Test connection manually if needed

---

## 💾 Backup Process

### Step-by-Step Backup

#### 1. Navigate to Backend Directory

```bash
cd backend
```

#### 2. Run Backup Script

**Full Backup (Schema + Data):**
```bash
python backup_production_db.py
```

**Data-Only Backup (Faster, Smaller):**
```bash
python backup_production_db.py --data-only
```

**Compressed Backup (For Large Databases):**
```bash
python backup_production_db.py --compress
```

**Combined Options:**
```bash
python backup_production_db.py --data-only --compress
```

#### 3. What Happens During Backup

1. ✅ Script reads credentials from `.env` file (lines 51-55)
2. ✅ Tests connection to production database
3. ✅ Creates backup directory (`database-backups/`)
4. ✅ Exports database using `pg_dump`
5. ✅ Verifies backup file integrity
6. ✅ Creates restore script for easy recovery

#### 4. Backup File Location

Backups are saved in:
```
backend/database-backups/
  ├── prod_backup_full_20241218_143022.sql
  ├── prod_backup_data_20241218_143022.sql.gz
  └── restore_prod_backup_full_20241218_143022.sh
```

#### 5. Backup File Naming

- `prod_backup_full_TIMESTAMP.sql` - Full backup (schema + data)
- `prod_backup_data_TIMESTAMP.sql` - Data-only backup
- `.gz` extension - Compressed backup

---

## 🔄 Complete Migration Process

### Recommended Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. BACKUP PRODUCTION                                    │
│    python backup_production_db.py --data-only --compress│
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 2. VERIFY BACKUP                                        │
│    Check backup file exists and has content             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 3. MIGRATE DATA (Production → Development)              │
│    npm run db:migrate:prod-to-dev                       │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 4. VERIFY MIGRATION                                     │
│    Check development database has all data              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ 5. TEST APPLICATION                                     │
│    Run your application and test functionality          │
└─────────────────────────────────────────────────────────┘
```

### Quick Command Sequence

```bash
# 1. Backup production
python backup_production_db.py --data-only --compress

# 2. Migrate data
npm run db:migrate:prod-to-dev

# 3. Verify and test
# (Check your application works correctly)
```

---

## 🔙 Restore Process

### When to Restore?

Restore your backup if:
- ❌ Migration failed and corrupted data
- ❌ You need to revert changes
- ❌ You discovered issues after migration
- ❌ You want to test the restore process

### Step-by-Step Restore

#### 1. List Available Backups

```bash
python restore_production_db.py
```

This will show all available backups:
```
Available backups:
  1. prod_backup_full_20241218_143022.sql
     Size: 125.43 MB, Modified: 2024-12-18 14:30:22
  2. prod_backup_data_20241218_140000.sql.gz
     Size: 45.67 MB, Modified: 2024-12-18 14:00:00
```

#### 2. Restore from Specific Backup

**Option A: Interactive Selection**
```bash
python restore_production_db.py
# Then select backup number when prompted
```

**Option B: Direct File Path**
```bash
python restore_production_db.py database-backups/prod_backup_full_20241218_143022.sql
```

**Option C: Compressed Backup**
```bash
python restore_production_db.py database-backups/prod_backup_data_20241218_143022.sql.gz
```

#### 3. What Happens During Restore

1. ⚠️ **Safety Backup Created**: Current state is backed up first
2. ⚠️ **Confirmation Required**: You must type "RESTORE" to confirm
3. ✅ **Triggers Disabled**: Temporarily disabled to avoid foreign key issues
4. ✅ **Data Restored**: Backup file is imported
5. ✅ **Triggers Re-enabled**: Database constraints restored
6. ✅ **Verification**: Process completes successfully

#### 4. Safety Features

- ✅ Creates backup of current state before restore
- ✅ Requires explicit confirmation ("RESTORE")
- ✅ Shows clear warnings about data replacement
- ✅ Can be cancelled at any time (Ctrl+C)

---

## 📊 Backup Types Explained

### Full Backup (`--data-only` flag NOT used)

**Includes:**
- ✅ Database schema (tables, indexes, constraints)
- ✅ All data
- ✅ Sequences
- ✅ DROP statements (can recreate clean database)

**Use When:**
- You need to restore to a completely fresh database
- Schema might have changed
- You want complete database reconstruction

**File Size:** Larger (includes schema)

### Data-Only Backup (`--data-only` flag used)

**Includes:**
- ✅ Only data (no schema)
- ✅ INSERT statements for all records

**Use When:**
- Schema is already correct
- You only need to restore data
- Faster backup/restore process

**File Size:** Smaller (data only)

### Compressed Backup (`--compress` flag)

**Benefits:**
- ✅ Much smaller file size (50-90% reduction)
- ✅ Faster transfer if uploading to cloud
- ✅ Saves disk space

**Drawbacks:**
- ⚠️ Slightly slower restore (needs decompression)
- ⚠️ Cannot view/edit SQL directly

**Recommended for:** Large databases (>100MB)

---

## 🔍 Verification Steps

### After Backup

1. **Check Backup File Exists**
   ```bash
   ls -lh database-backups/prod_backup_*.sql*
   ```

2. **Verify File Size**
   - Should be > 0 bytes
   - Full backup: Usually larger
   - Data-only: Usually smaller

3. **Check File Integrity** (Script does this automatically)
   - File should contain SQL statements
   - No corruption errors

### After Migration

1. **Check Row Counts**
   ```sql
   -- Compare production and development
   SELECT 'users' as table_name, COUNT(*) FROM users;
   SELECT 'courses' as table_name, COUNT(*) FROM courses;
   ```

2. **Test Application**
   - Login functionality
   - Data displays correctly
   - No errors in logs

3. **Verify Critical Data**
   - Check important records exist
   - Verify relationships intact

### After Restore

1. **Verify Data Restored**
   - Check row counts match backup
   - Test application functionality
   - Verify no data loss

---

## 🛠️ Troubleshooting

### Backup Issues

#### "pg_dump command not found"
**Solution:** Install PostgreSQL client tools
```bash
# Windows: Install PostgreSQL from postgresql.org
# Linux: sudo apt-get install postgresql-client
# Mac: brew install postgresql
```

#### "Connection refused" or "Can't connect"
**Solutions:**
- Check firewall settings
- Verify AWS RDS security group allows your IP
- Test connection manually:
  ```bash
  psql "postgresql://user:pass@host:port/db?sslmode=require"
  ```

#### "SSL required" error
**Solution:** Script automatically handles SSL for remote databases. If issues persist:
- Verify your RDS instance requires SSL
- Check SSL certificate configuration

#### "Backup file is empty"
**Possible Causes:**
- Database is actually empty
- Connection issue during backup
- Permissions problem

**Solution:** Check database connection and permissions

### Restore Issues

#### "psql command not found"
**Solution:** Same as backup - install PostgreSQL client tools

#### "Restore timeout"
**Solutions:**
- Large databases take time - be patient
- Use data-only backup if schema is correct
- Check network connection stability

#### "Foreign key constraint violation"
**Solutions:**
- Script automatically disables triggers
- If issue persists, check backup file integrity
- Restore in correct order (dependencies)

#### "Permission denied"
**Solutions:**
- Verify database user has necessary permissions
- Check file permissions on backup file
- Run script with appropriate permissions

---

## 📝 Best Practices

### 1. Regular Backups
- ✅ Backup before any major operation
- ✅ Keep multiple backup versions
- ✅ Store backups in safe location

### 2. Backup Strategy
- **Before Migration**: Data-only backup (faster)
- **Regular Maintenance**: Full backup (complete)
- **Large Databases**: Use compression

### 3. Storage
- ✅ Keep backups in `database-backups/` directory
- ✅ Consider cloud storage for important backups
- ✅ Don't delete backups immediately after migration

### 4. Testing
- ✅ Test restore process in development first
- ✅ Verify backups are valid before deleting
- ✅ Document which backup was used for migration

### 5. Security
- ✅ Backups contain sensitive data - protect them
- ✅ Don't commit backup files to Git
- ✅ Use secure storage for production backups

---

## 🚨 Emergency Procedures

### If Migration Fails

1. **Stop the migration process** (Ctrl+C)
2. **Check what was changed** in development database
3. **Restore from backup** if needed:
   ```bash
   python restore_production_db.py
   ```

### If Production Database is Corrupted

1. **Don't panic** - you have backups!
2. **Identify the backup** to restore from
3. **Restore immediately**:
   ```bash
   python restore_production_db.py database-backups/prod_backup_full_TIMESTAMP.sql
   ```

### If Backup is Missing or Corrupted

1. **Check backup directory**: `database-backups/`
2. **Verify file integrity**: Try opening the file
3. **Check safety backups**: Created before restore operations
4. **Contact database administrator** if needed

---

## 📞 Quick Reference

### Backup Commands
```bash
# Full backup
python backup_production_db.py

# Data-only backup
python backup_production_db.py --data-only

# Compressed backup
python backup_production_db.py --compress

# Combined
python backup_production_db.py --data-only --compress
```

### Restore Commands
```bash
# List and select backup
python restore_production_db.py

# Restore specific backup
python restore_production_db.py database-backups/prod_backup_full_20241218_143022.sql

# Force restore (skip confirmation)
python restore_production_db.py database-backups/backup.sql --force
```

### Migration Command
```bash
npm run db:migrate:prod-to-dev
```

---

## ✅ Checklist

### Before Migration

- [ ] Production database credentials in `.env` (lines 51-55)
- [ ] PostgreSQL client tools installed
- [ ] Network access to production database
- [ ] Backup created successfully
- [ ] Backup file verified
- [ ] Backup location noted

### After Migration

- [ ] Migration completed successfully
- [ ] Development database has data
- [ ] Application tested
- [ ] No errors in logs
- [ ] Backup file kept safe

### If Restore Needed

- [ ] Identify correct backup file
- [ ] Safety backup created (automatic)
- [ ] Restore confirmed
- [ ] Data verified after restore
- [ ] Application tested

---

## 📚 Additional Resources

- **Backup Script**: `backup_production_db.py`
- **Restore Script**: `restore_production_db.py`
- **Migration Script**: `migrate-prod-to-dev.js`
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## 🎯 Summary

1. **Always backup** before migration
2. **Use data-only backups** for faster process
3. **Test restore** to ensure backups work
4. **Keep backups safe** - they're your safety net
5. **Don't panic** - backups allow easy recovery

**Remember**: Better safe than sorry! A backup takes minutes, but data recovery can take hours or days.

---

**Last Updated**: 2024-12-18  
**Scripts Version**: 1.0  
**Compatible With**: PostgreSQL 12+, Python 3.6+

