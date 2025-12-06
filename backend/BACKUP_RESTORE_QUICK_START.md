# Quick Start: Backup & Restore Process

## 🚀 Complete Process in 3 Steps

### Step 1: Backup Production Database

```bash
cd backend
python backup_production_db.py --data-only --compress
```

**What this does:**
- Creates backup of production data (READ-ONLY - safe!)
- Saves to `database-backups/` directory
- Compresses to save space
- Creates restore script automatically

**Time:** 2-5 minutes (depending on database size)

---

### Step 2: Migrate Data (Production → Development)

```bash
npm run db:migrate:prod-to-dev
```

**What this does:**
- Reads data from production (safe - no changes)
- Imports to development database
- Verifies migration success

**Time:** 5-10 minutes

---

### Step 3: If Needed - Restore from Backup

```bash
python restore_production_db.py
```

**What this does:**
- Lists available backups
- Creates safety backup before restore
- Restores data to production
- Requires confirmation ("RESTORE")

**Time:** 5-10 minutes

---

## 📋 Complete Workflow

```
┌────────────────────────────────────────────┐
│ 1. BACKUP PRODUCTION                      │
│    python backup_production_db.py         │
│    --data-only --compress                 │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ 2. VERIFY BACKUP FILE EXISTS              │
│    Check: database-backups/ folder        │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ 3. MIGRATE DATA                           │
│    npm run db:migrate:prod-to-dev         │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ 4. TEST APPLICATION                       │
│    Verify data migrated correctly         │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ ✅ MIGRATION COMPLETE                     │
│    Keep backup file safe                  │
└────────────────────────────────────────────┘
```

---

## 🔙 Restore Process (If Needed)

### Option 1: Interactive (Recommended)

```bash
python restore_production_db.py
```

Then select backup number from the list.

### Option 2: Direct File

```bash
python restore_production_db.py database-backups/prod_backup_data_20241218_143022.sql.gz
```

---

## ⚙️ Prerequisites

Before running scripts, ensure:

1. ✅ Python 3.6+ installed
   ```bash
   python --version
   ```

2. ✅ PostgreSQL client tools installed
   - Windows: Install PostgreSQL (includes pg_dump, psql)
   - Linux: `sudo apt-get install postgresql-client`
   - Mac: `brew install postgresql`

3. ✅ `.env` file has production credentials (lines 51-55)
   ```env
   DB_HOST=your_host
   DB_PORT=5432
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_DATABASE=LMS_Prod
   ```

---

## 📁 File Locations

- **Backup Script**: `backend/backup_production_db.py`
- **Restore Script**: `backend/restore_production_db.py`
- **Backup Files**: `backend/database-backups/`
- **Documentation**: `backend/BACKUP_RESTORE_PROCESS.md`

---

## ⚠️ Important Notes

1. **Backup is READ-ONLY**: Production database is never modified
2. **Always backup first**: Before any migration
3. **Keep backups safe**: Don't delete immediately
4. **Test restore**: Verify backups work before relying on them

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| `pg_dump not found` | Install PostgreSQL client tools |
| `Connection refused` | Check firewall/security group |
| `SSL required` | Script handles automatically |
| `Backup file empty` | Check database connection |

---

## 📞 Need More Help?

- **Full Documentation**: See `BACKUP_RESTORE_PROCESS.md`
- **Backup Script Help**: `python backup_production_db.py --help`
- **Restore Script Help**: `python restore_production_db.py --help`

---

**Remember**: Always backup before migration! 🛡️

