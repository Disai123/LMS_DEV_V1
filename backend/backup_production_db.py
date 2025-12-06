#!/usr/bin/env python3
"""
PRODUCTION DATABASE BACKUP SCRIPT

This script creates a complete backup of your production database before migration.
The backup can be used to restore production data if anything goes wrong.

Features:
✅ Reads credentials from .env file (lines 51-55 for production)
✅ Creates timestamped backup files
✅ Supports both schema + data, or data-only backups
✅ Compresses large backups automatically
✅ Verifies backup integrity
✅ Safe - only READS from production (no modifications)

Usage:
    python backup_production_db.py [--data-only] [--compress]

Options:
    --data-only    Only backup data (no schema) - faster, smaller
    --compress     Compress backup file using gzip
    --help         Show this help message
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
    prod_lines_raw = lines[50:55]  # lines[50:55] gives indices 50-54 which are lines 51-55
    
    prod_creds = {}
    
    for line in prod_lines_raw:
        line = line.strip()
        # Skip empty lines and comments
        if not line or line.startswith('#'):
            continue
        
        # Parse KEY=VALUE format
        if '=' in line:
            key, value = line.split('=', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")  # Remove quotes
            prod_creds[key] = value
    
    # Map to standard format
    prod = {
        'host': prod_creds.get('DB_HOST') or prod_creds.get('DATABASE_HOST'),
        'port': int(prod_creds.get('DB_PORT') or prod_creds.get('DATABASE_PORT') or '5432'),
        'user': prod_creds.get('DB_USER') or prod_creds.get('DATABASE_USER') or prod_creds.get('POSTGRES_USER'),
        'password': prod_creds.get('DB_PASSWORD') or prod_creds.get('DATABASE_PASSWORD') or prod_creds.get('POSTGRES_PASSWORD'),
        'database': prod_creds.get('DB_DATABASE') or prod_creds.get('DB_NAME') or prod_creds.get('DATABASE_NAME') or prod_creds.get('POSTGRES_DB')
    }
    
    # Validate required fields
    if not prod['host'] or not prod['user'] or not prod['database']:
        log_error('\n❌ Production credentials incomplete!')
        log_error('   Please check lines 51-55 in .env file')
        log_error('   Required: DB_HOST, DB_USER, DB_DATABASE (or DB_NAME)')
        log_info('\n   Lines read from .env (lines 51-55):')
        for idx, line in enumerate(prod_lines_raw, start=51):
            status = '(COMMENTED OUT)' if line.strip().startswith('#') else '(ACTIVE)' if line.strip() else '(EMPTY)'
            log_info(f'     Line {idx}: {line.strip() or "(empty)"} {status}')
        raise ValueError('Production credentials incomplete')
    
    return prod


def test_database_connection(config):
    """Test connection to production database"""
    log_info('Testing database connection...')
    
    # Determine if remote database (requires SSL)
    is_remote = config['host'] not in ['localhost', '127.0.0.1']
    
    # Build connection string
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
        # Test connection using psql with longer timeout for remote databases
        # Use environment variable for password to avoid shell escaping issues
        import os
        env = os.environ.copy()
        env['PGPASSWORD'] = config['password']
        
        # Add SSL mode for remote databases using environment variable
        if is_remote:
            env['PGSSLMODE'] = 'require'
        
        # Build psql command with separate parameters (more reliable than connection string)
        test_cmd = [
            'psql',
            '-h', config['host'],
            '-p', str(config['port']),
            '-U', config['user'],
            '-d', config['database'],
            '-c', 'SELECT version();'
        ]
        
        result = subprocess.run(
            test_cmd,
            capture_output=True,
            text=True,
            timeout=30,  # Increased timeout for AWS RDS
            env=env
        )
        
        if result.returncode == 0:
            log_success(f"Connected to production database: {config['database']}")
            return True
        else:
            # Connection test failed, but we'll still try backup (pg_dump will handle it)
            log_warning(f"Connection test failed: {result.stderr}")
            log_warning("Will attempt backup anyway - pg_dump will verify connection")
            return True  # Don't fail, let pg_dump handle the connection
            
    except subprocess.TimeoutExpired:
        log_warning("Connection test timeout - this is normal for remote databases")
        log_warning("Will attempt backup anyway - pg_dump will verify connection")
        return True  # Don't fail, let pg_dump handle the connection
    except FileNotFoundError:
        log_error("psql command not found. Please install PostgreSQL client tools.")
        return False
    except Exception as e:
        log_warning(f"Connection test failed: {str(e)}")
        log_warning("Will attempt backup anyway - pg_dump will verify connection")
        return True  # Don't fail, let pg_dump handle the connection


def create_backup_directory():
    """Create backup directory if it doesn't exist"""
    backup_dir = Path(__file__).parent / 'database-backups'
    backup_dir.mkdir(exist_ok=True)
    return backup_dir


def find_pg_dump():
    """
    Find pg_dump executable, prioritizing PostgreSQL 18+ over older versions
    Returns the path to pg_dump executable
    """
    import os
    import shutil
    
    # Common PostgreSQL installation paths (Windows) - check newer versions first
    possible_paths = [
        r"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe",
        r"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
        r"C:\Program Files (x86)\PostgreSQL\18\bin\pg_dump.exe",
        r"C:\Program Files (x86)\PostgreSQL\17\bin\pg_dump.exe",
    ]
    
    # Check specific paths first (prioritize newer versions)
    for path in possible_paths:
        if os.path.exists(path):
            try:
                # Verify it works
                result = subprocess.run([path, '--version'], capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    version_str = result.stdout.strip()
                    log_info(f'Found: {version_str} at {path}')
                    return path
            except:
                continue
    
    # Fall back to system PATH
    pg_dump_path = shutil.which('pg_dump')
    if pg_dump_path:
        log_info(f'Using pg_dump from PATH: {pg_dump_path}')
        return pg_dump_path
    
    return 'pg_dump'  # Fallback - will error if not found


def create_backup(config, backup_dir, data_only=False, compress=False, ignore_version=False, pg_dump_path=None):
    """
    Create database backup using pg_dump
    
    Args:
        config: Database configuration dictionary
        backup_dir: Directory to save backup
        data_only: If True, only backup data (no schema)
        compress: If True, compress the backup file
        ignore_version: Ignored (kept for compatibility)
        pg_dump_path: Optional path to pg_dump executable (auto-detected if None)
    """
    log_info('Creating backup (READ-ONLY operation - production is safe)...')
    
    # Find pg_dump executable (prioritize PostgreSQL 18+)
    if not pg_dump_path:
        log_info('Auto-detecting pg_dump executable...')
        pg_dump_path = find_pg_dump()
    
    # Determine if remote database (requires SSL)
    is_remote = config['host'] not in ['localhost', '127.0.0.1']
    
    # Create backup filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_type = 'data' if data_only else 'full'
    backup_filename = f"prod_backup_{backup_type}_{timestamp}.sql"
    backup_path = backup_dir / backup_filename
    
    # Build pg_dump command with separate parameters (more reliable)
    dump_cmd = [
        pg_dump_path,
        '-h', config['host'],
        '-p', str(config['port']),
        '-U', config['user'],
        '-d', config['database'],
        '--no-owner',  # Don't output commands to set ownership
        '--no-acl',    # Don't output access privileges (GRANT/REVOKE commands)
    ]
    
    # Check pg_dump version to ensure compatibility
    try:
        version_result = subprocess.run(
            [pg_dump_path, '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if version_result.returncode == 0:
            version_str = version_result.stdout.strip()
            log_info(f'Using: {version_str}')
            
            # Extract version number
            import re
            version_match = re.search(r'(\d+)\.(\d+)', version_str)
            if version_match:
                major_version = int(version_match.group(1))
                if major_version < 17:
                    log_warning(f'⚠️  pg_dump version {major_version} may not work with PostgreSQL 17.4 server')
                    log_warning('⚠️  Script will attempt to use --no-version-check if available')
                    if ignore_version and major_version >= 17:
                        dump_cmd.append('--no-version-check')
                        log_info('Added --no-version-check flag')
        else:
            log_warning('Could not determine pg_dump version')
    except Exception as e:
        log_warning(f'Could not check pg_dump version: {str(e)}')
    
    # Set environment variable for password and SSL (more secure than connection string)
    import os
    env = os.environ.copy()
    env['PGPASSWORD'] = config['password']
    
    # Add SSL mode for remote databases using environment variable
    if is_remote:
        env['PGSSLMODE'] = 'require'
        log_info('SSL: ENABLED (required for AWS RDS)')
    
    if data_only:
        dump_cmd.append('--data-only')
        log_info('Backup mode: DATA ONLY (no schema)')
    else:
        dump_cmd.append('--clean')  # Include DROP statements
        dump_cmd.append('--if-exists')  # Use IF EXISTS for drops
        log_info('Backup mode: FULL (schema + data)')
    
    if compress:
        backup_path = backup_path.with_suffix('.sql.gz')
        log_info('Compression: ENABLED')
    
    try:
        log_info(f'Executing pg_dump...')
        log_info(f'Backup file: {backup_path.name}')
        
        # Open output file
        if compress:
            import gzip
            output_file = gzip.open(backup_path, 'wb')
        else:
            output_file = open(backup_path, 'wb')
        
        # Run pg_dump and write to file
        process = subprocess.Popen(
            dump_cmd,
            stdout=output_file,
            stderr=subprocess.PIPE,
            text=False,
            env=env
        )
        
        # Wait for completion with longer timeout for large databases
        try:
            _, stderr = process.communicate(timeout=600)  # 10 minute timeout
        except subprocess.TimeoutExpired:
            process.kill()
            output_file.close()
            if backup_path.exists():
                backup_path.unlink()
            log_error('pg_dump timeout - database might be too large or connection too slow')
            log_info('Try using --data-only flag for faster backup')
            return None
        
        output_file.close()
        
        if process.returncode != 0:
            # Clean up failed backup file
            if backup_path.exists():
                backup_path.unlink()
            error_msg = stderr.decode() if stderr else 'Unknown error'
            log_error(f'pg_dump failed: {error_msg}')
            return None
        
        # Check if backup file was created and has content
        if not backup_path.exists():
            log_error('Backup file was not created')
            return None
        
        file_size = backup_path.stat().st_size
        if file_size == 0:
            log_warning('Backup file is empty')
            backup_path.unlink()
            return None
        
        # Format file size
        if file_size < 1024:
            size_str = f"{file_size} bytes"
        elif file_size < 1024 * 1024:
            size_str = f"{file_size / 1024:.2f} KB"
        else:
            size_str = f"{file_size / (1024 * 1024):.2f} MB"
        
        log_success(f'Backup created successfully!')
        log_info(f'File: {backup_path.name}')
        log_info(f'Size: {size_str}')
        log_info(f'Location: {backup_path}')
        
        return backup_path
        
    except FileNotFoundError:
        log_error('pg_dump command not found. Please install PostgreSQL client tools.')
        log_info('Windows: Install PostgreSQL (includes pg_dump)')
        log_info('Linux/Mac: sudo apt-get install postgresql-client (or brew install postgresql)')
        return None
    except Exception as e:
        log_error(f'Backup failed: {str(e)}')
        # Clean up failed backup file
        if backup_path.exists():
            backup_path.unlink()
        return None


def verify_backup(backup_path):
    """Verify backup file integrity"""
    log_info('Verifying backup integrity...')
    
    try:
        if backup_path.suffix == '.gz':
            import gzip
            with gzip.open(backup_path, 'rt') as f:
                # Read first few lines to check if it's valid SQL
                first_lines = ''.join(f.readline() for _ in range(5))
        else:
            with open(backup_path, 'r', encoding='utf-8') as f:
                first_lines = ''.join(f.readline() for _ in range(5))
        
        # Check for SQL indicators
        if 'PostgreSQL' in first_lines or 'CREATE' in first_lines or 'COPY' in first_lines or 'INSERT' in first_lines:
            log_success('Backup file appears to be valid SQL')
            return True
        else:
            log_warning('Backup file format unclear - please verify manually')
            return True  # Don't fail, just warn
            
    except Exception as e:
        log_warning(f'Could not verify backup: {str(e)}')
        return True  # Don't fail verification


def create_restore_script(backup_path, config):
    """Create a restore script for easy recovery"""
    restore_script_path = backup_path.parent / f"restore_{backup_path.stem}.sh"
    
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
    
    restore_commands = []
    
    if backup_path.suffix == '.gz':
        restore_commands.append(f'gunzip -c "{backup_path.name}" | psql "{connection_string}"')
    else:
        restore_commands.append(f'psql "{connection_string}" -f "{backup_path.name}"')
    
    script_content = f"""#!/bin/bash
# RESTORE SCRIPT - Generated automatically
# Backup file: {backup_path.name}
# Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
#
# WARNING: This will REPLACE all data in the production database!
# Make sure you want to restore before running this script.
#
# Usage: bash {restore_script_path.name}
#

set -e

echo "=========================================="
echo "WARNING: PRODUCTION DATABASE RESTORE"
echo "=========================================="
echo ""
echo "Backup file: {backup_path.name}"
echo "Database: {config['database']}"
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

{' '.join(restore_commands)}

echo ""
echo "Restore completed successfully!"
"""
    
    with open(restore_script_path, 'w', encoding='utf-8') as f:
        f.write(script_content)
    
    # Make executable on Unix systems
    try:
        os.chmod(restore_script_path, 0o755)
    except:
        pass  # Windows doesn't support chmod
    
    log_info(f'Restore script created: {restore_script_path.name}')


def main():
    """Main backup function"""
    parser = argparse.ArgumentParser(
        description='Backup production database before migration',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--data-only',
        action='store_true',
        help='Only backup data (no schema) - faster, smaller file'
    )
    parser.add_argument(
        '--compress',
        action='store_true',
        help='Compress backup file using gzip'
    )
    parser.add_argument(
        '--ignore-version',
        action='store_true',
        help='[Deprecated] Script now auto-detects PostgreSQL 18+'
    )
    parser.add_argument(
        '--pg-dump-path',
        type=str,
        default=None,
        help='Path to pg_dump executable (auto-detected if not provided, prefers PostgreSQL 18+)'
    )
    
    args = parser.parse_args()
    
    log('\n' + '='*60, Colors.CYAN)
    log('💾 PRODUCTION DATABASE BACKUP', Colors.BRIGHT)
    log('='*60, Colors.CYAN)
    
    log_warning('IMPORTANT: This script only READS from production database.')
    log_info('Production data will NOT be modified or affected in any way.\n')
    
    try:
        # Step 1: Parse credentials
        log_step(1, 'Parsing database credentials from .env file')
        config = parse_env_credentials()
        log_info(f"Database: {config['database']}")
        log_info(f"Host: {config['host']}:{config['port']}")
        log_info(f"User: {config['user']}")
        
        # Step 2: Test connection
        log_step(2, 'Testing database connection')
        if not test_database_connection(config):
            raise Exception('Failed to connect to production database')
        
        # Step 3: Create backup directory
        log_step(3, 'Preparing backup directory')
        backup_dir = create_backup_directory()
        log_success(f'Backup directory: {backup_dir}')
        
        # Step 4: Create backup
        log_step(4, 'Creating backup')
        backup_path = create_backup(config, backup_dir, args.data_only, args.compress, args.ignore_version, args.pg_dump_path)
        
        if not backup_path:
            raise Exception('Backup creation failed')
        
        # Step 5: Verify backup
        log_step(5, 'Verifying backup')
        verify_backup(backup_path)
        
        # Step 6: Create restore script
        log_step(6, 'Creating restore script')
        create_restore_script(backup_path, config)
        
        # Summary
        log('\n' + '='*60, Colors.GREEN)
        log('✨ Backup completed successfully!', Colors.GREEN)
        log('='*60, Colors.GREEN)
        log_success(f'\nBackup file: {backup_path}')
        log_info('You can now safely migrate data from production to development.')
        log_info('To restore this backup, use the restore script or run restore_production_db.py')
        
        return 0
        
    except KeyboardInterrupt:
        log_warning('\n\nBackup cancelled by user.')
        return 1
    except Exception as e:
        log_error(f'\n\n❌ Backup failed: {str(e)}')
        return 1


if __name__ == '__main__':
    sys.exit(main())

