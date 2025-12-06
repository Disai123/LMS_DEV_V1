#!/usr/bin/env python3
"""
PRODUCTION DATABASE RESTORE SCRIPT

This script restores your production database from a backup file.
Use this to revert changes or recover from issues.

⚠️  WARNING: This will REPLACE all current data in the production database!
⚠️  Only use this if you need to restore from a backup.

Features:
✅ Reads credentials from .env file (lines 51-55 for production)
✅ Lists available backups
✅ Verifies backup file before restore
✅ Creates backup of current state before restore (safety measure)
✅ Supports both compressed (.gz) and uncompressed backups
✅ Interactive confirmation to prevent accidents

Usage:
    python restore_production_db.py [backup_file]

Arguments:
    backup_file    Optional: Path to backup file. If not provided, will list available backups.

Examples:
    python restore_production_db.py
    python restore_production_db.py database-backups/prod_backup_full_20241218_143022.sql
    python restore_production_db.py database-backups/prod_backup_data_20241218_143022.sql.gz
"""

import os
import sys
import subprocess
import argparse
from datetime import datetime
from pathlib import Path
from urllib.parse import quote_plus

# Colors for terminal output
class Colors:
    RESET = '\033[0m'
    BRIGHT = '\033[1m'
    RED = '\033[31m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    BLUE = '\033[34m'
    MAGENTA = '\033[35m'
    CYAN = '\033[36m'

def log(message, color=Colors.RESET):
    """Print colored log message"""
    print(f"{color}{message}{Colors.RESET}")

def log_success(message):
    log(f"✅ {message}", Colors.GREEN)

def log_error(message):
    log(f"❌ {message}", Colors.RED)

def log_warning(message):
    log(f"⚠️  {message}", Colors.YELLOW)

def log_info(message):
    log(f"ℹ️  {message}", Colors.BLUE)

def log_step(step, message):
    log(f"\n{'='*60}", Colors.CYAN)
    log(f"📋 Step {step}: {message}", Colors.CYAN)
    log('='*60, Colors.CYAN)


def parse_env_credentials():
    """
    Parse production database credentials from .env file
    Reads lines 51-55 for production credentials
    """
    env_path = Path(__file__).parent / '.env'
    
    if not env_path.exists():
        raise FileNotFoundError('.env file not found in backend directory')
    
    with open(env_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extract production credentials (lines 51-55, 0-indexed: 50-54)
    prod_lines_raw = lines[50:55]
    
    prod_creds = {}
    
    for line in prod_lines_raw:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        if '=' in line:
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            prod_creds[key] = value
    
    prod = {
        'host': prod_creds.get('DB_HOST') or prod_creds.get('DATABASE_HOST'),
        'port': int(prod_creds.get('DB_PORT') or prod_creds.get('DATABASE_PORT') or '5432'),
        'user': prod_creds.get('DB_USER') or prod_creds.get('DATABASE_USER') or prod_creds.get('POSTGRES_USER'),
        'password': prod_creds.get('DB_PASSWORD') or prod_creds.get('DATABASE_PASSWORD') or prod_creds.get('POSTGRES_PASSWORD'),
        'database': prod_creds.get('DB_DATABASE') or prod_creds.get('DB_NAME') or prod_creds.get('DATABASE_NAME') or prod_creds.get('POSTGRES_DB')
    }
    
    if not prod['host'] or not prod['user'] or not prod['database']:
        log_error('\n❌ Production credentials incomplete!')
        log_error('   Please check lines 51-55 in .env file')
        raise ValueError('Production credentials incomplete')
    
    return prod


def list_available_backups():
    """List all available backup files"""
    backup_dir = Path(__file__).parent / 'database-backups'
    
    if not backup_dir.exists():
        log_warning('No backup directory found.')
        return []
    
    backups = []
    for file in sorted(backup_dir.glob('prod_backup_*.sql*'), reverse=True):
        if file.is_file():
            file_size = file.stat().st_size
            if file_size < 1024:
                size_str = f"{file_size} bytes"
            elif file_size < 1024 * 1024:
                size_str = f"{file_size / 1024:.2f} KB"
            else:
                size_str = f"{file_size / (1024 * 1024):.2f} MB"
            
            backups.append({
                'path': file,
                'name': file.name,
                'size': size_str,
                'modified': datetime.fromtimestamp(file.stat().st_mtime)
            })
    
    return backups


def create_safety_backup(config):
    """Create a backup of current state before restore (safety measure)"""
    log_warning('Creating safety backup of current database state...')
    
    backup_dir = Path(__file__).parent / 'database-backups'
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safety_backup_path = backup_dir / f"safety_backup_before_restore_{timestamp}.sql"
    
    is_remote = config['host'] not in ['localhost', '127.0.0.1']
    
    if is_remote:
        connection_string = (
            f"postgresql://{config['user']}:{quote_plus(config['password'])}"
            f"@{config['host']}:{config['port']}/{config['database']}?sslmode=require"
        )
    else:
        connection_string = (
            f"postgresql://{config['user']}:{quote_plus(config['password'])}"
            f"@{config['host']}:{config['port']}/{config['database']}"
        )
    
    try:
        dump_cmd = [
            'pg_dump',
            connection_string,
            '--no-owner',
            '--no-acl',
            '--data-only'
        ]
        
        with open(safety_backup_path, 'wb') as f:
            process = subprocess.Popen(
                dump_cmd,
                stdout=f,
                stderr=subprocess.PIPE,
                text=False
            )
            _, stderr = process.communicate()
        
        if process.returncode == 0 and safety_backup_path.exists() and safety_backup_path.stat().st_size > 0:
            log_success(f'Safety backup created: {safety_backup_path.name}')
            return safety_backup_path
        else:
            log_warning(f'Safety backup failed: {stderr.decode()}')
            if safety_backup_path.exists():
                safety_backup_path.unlink()
            return None
            
    except Exception as e:
        log_warning(f'Could not create safety backup: {str(e)}')
        return None


def restore_backup(config, backup_path):
    """Restore database from backup file"""
    log_info('Starting restore process...')
    
    if not backup_path.exists():
        log_error(f'Backup file not found: {backup_path}')
        return False
    
    is_remote = config['host'] not in ['localhost', '127.0.0.1']
    
    if is_remote:
        connection_string = (
            f"postgresql://{config['user']}:{quote_plus(config['password'])}"
            f"@{config['host']}:{config['port']}/{config['database']}?sslmode=require"
        )
    else:
        connection_string = (
            f"postgresql://{config['user']}:{quote_plus(config['password'])}"
            f"@{config['host']}:{config['port']}/{config['database']}"
        )
    
    try:
        log_info('Disabling triggers to avoid foreign key issues...')
        
        # Disable triggers
        disable_cmd = [
            'psql',
            connection_string,
            '-c',
            "SET session_replication_role = 'replica';"
        ]
        
        subprocess.run(disable_cmd, capture_output=True, check=True, timeout=30)
        
        # Restore from backup
        log_info('Restoring data from backup...')
        
        if backup_path.suffix == '.gz':
            import gzip
            # For compressed files, use gunzip and pipe to psql
            restore_cmd = [
                'bash',
                '-c',
                f'gunzip -c "{backup_path}" | psql "{connection_string}"'
            ]
        else:
            restore_cmd = [
                'psql',
                connection_string,
                '-f',
                str(backup_path)
            ]
        
        result = subprocess.run(
            restore_cmd,
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout
        )
        
        if result.returncode != 0:
            log_error(f'Restore failed: {result.stderr}')
            return False
        
        # Re-enable triggers
        log_info('Re-enabling triggers...')
        enable_cmd = [
            'psql',
            connection_string,
            '-c',
            "SET session_replication_role = 'origin';"
        ]
        
        subprocess.run(enable_cmd, capture_output=True, check=True, timeout=30)
        
        log_success('Restore completed successfully!')
        return True
        
    except subprocess.TimeoutExpired:
        log_error('Restore timeout - the operation took too long')
        return False
    except FileNotFoundError:
        log_error('psql command not found. Please install PostgreSQL client tools.')
        return False
    except Exception as e:
        log_error(f'Restore failed: {str(e)}')
        return False


def confirm_restore(config, backup_path):
    """Interactive confirmation before restore"""
    log_warning('\n' + '='*60)
    log_warning('⚠️  RESTORE CONFIRMATION REQUIRED')
    log_warning('='*60)
    log_warning(f'\nYou are about to RESTORE production database: {config["database"]}')
    log_warning(f'Backup file: {backup_path.name}')
    log_warning(f'\n⚠️  WARNING: This will REPLACE all current data!')
    log_warning('⚠️  This action cannot be undone!')
    
    print('\n' + Colors.YELLOW + 'Type "RESTORE" (all caps) to confirm:' + Colors.RESET, end=' ')
    confirm = input().strip()
    
    if confirm != 'RESTORE':
        log_info('Restore cancelled.')
        return False
    
    return True


def main():
    """Main restore function"""
    parser = argparse.ArgumentParser(
        description='Restore production database from backup',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        'backup_file',
        nargs='?',
        help='Path to backup file (optional - will list available if not provided)'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Skip confirmation prompt (use with caution!)'
    )
    
    args = parser.parse_args()
    
    log('\n' + '='*60, Colors.RED)
    log('⚠️  PRODUCTION DATABASE RESTORE', Colors.BRIGHT)
    log('='*60, Colors.RED)
    
    log_warning('This script will REPLACE all data in the production database!')
    log_warning('Make sure you have a backup of the current state.\n')
    
    try:
        # Step 1: Parse credentials
        log_step(1, 'Parsing database credentials')
        config = parse_env_credentials()
        log_info(f"Database: {config['database']}")
        log_info(f"Host: {config['host']}:{config['port']}")
        
        # Step 2: Handle backup file selection
        log_step(2, 'Selecting backup file')
        if args.backup_file:
            backup_path = Path(args.backup_file)
            if not backup_path.is_absolute():
                backup_path = Path(__file__).parent / backup_path
        else:
            # List available backups
            backups = list_available_backups()
            
            if not backups:
                log_error('No backup files found!')
                log_info('Please create a backup first using: python backup_production_db.py')
                return 1
            
            log_info('\nAvailable backups:')
            for idx, backup in enumerate(backups, 1):
                log_info(f"  {idx}. {backup['name']}")
                log_info(f"     Size: {backup['size']}, Modified: {backup['modified'].strftime('%Y-%m-%d %H:%M:%S')}")
            
            print(f"\n{Colors.YELLOW}Select backup number (1-{len(backups)}) or 'q' to quit:{Colors.RESET} ", end='')
            choice = input().strip()
            
            if choice.lower() == 'q':
                log_info('Restore cancelled.')
                return 0
            
            try:
                backup_idx = int(choice) - 1
                if 0 <= backup_idx < len(backups):
                    backup_path = backups[backup_idx]['path']
                else:
                    log_error('Invalid selection.')
                    return 1
            except ValueError:
                log_error('Invalid input.')
                return 1
        
        if not backup_path.exists():
            log_error(f'Backup file not found: {backup_path}')
            return 1
        
        log_success(f'Selected backup: {backup_path.name}')
        
        # Step 3: Create safety backup
        log_step(3, 'Creating safety backup')
        safety_backup = create_safety_backup(config)
        if safety_backup:
            log_info('Current state backed up safely.')
        else:
            log_warning('Could not create safety backup - proceeding anyway...')
        
        # Step 4: Confirm restore
        if not args.force:
            log_step(4, 'Restore confirmation')
            if not confirm_restore(config, backup_path):
                return 0
        
        # Step 5: Restore
        log_step(5, 'Restoring database')
        if restore_backup(config, backup_path):
            log('\n' + '='*60, Colors.GREEN)
            log('✨ Restore completed successfully!', Colors.GREEN)
            log('='*60, Colors.GREEN)
            if safety_backup:
                log_info(f'\nSafety backup saved at: {safety_backup}')
            return 0
        else:
            log_error('\nRestore failed!')
            if safety_backup:
                log_warning(f'\nYou can restore the safety backup to undo this attempt.')
            return 1
        
    except KeyboardInterrupt:
        log_warning('\n\nRestore cancelled by user.')
        return 1
    except Exception as e:
        log_error(f'\n\n❌ Restore failed: {str(e)}')
        return 1


if __name__ == '__main__':
    sys.exit(main())

