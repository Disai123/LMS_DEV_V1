#!/usr/bin/env node

/**
 * PRODUCTION TO DEVELOPMENT DATA MIGRATION SCRIPT
 * 
 * This script migrates data from Production database to Development database
 * 
 * Features:
 * ✅ Reads credentials from .env file (lines 13-17 for dev, 51-55 for prod)
 * ✅ Creates backup of production data
 * ✅ Exports data from production (READ-ONLY, no changes to prod)
 * ✅ Imports data to development database
 * ✅ Verifies migration success
 * ✅ Resets sequences after import
 * 
 * IMPORTANT: This script only READS from production - it does NOT modify production data
 * 
 * Usage: node migrate-prod-to-dev.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { Client } = require('pg');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}📋 Step ${step}: ${message}${colors.reset}`);
  log('─'.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Parse .env file and extract credentials from specific line ranges
 */
/**
 * Parse .env file and extract credentials based on section headers
 */
function parseEnvCredentials() {
  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found in backend directory');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.replace(/\r\n/g, '\n').split('\n');

  // Helper to parse a block of lines until next empty line or section
  const parseBlock = (startIndex) => {
    const config = {};
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Stop at empty line or next section header
      if (!line || (line.startsWith('#') && line.includes('Configuration'))) {
        break;
      }

      // Handle commented lines (strip leading #)
      const cleanLine = line.replace(/^#\s*/, '');

      if (cleanLine.includes('=')) {
        const [key, ...values] = cleanLine.split('=');
        if (key && values.length > 0) {
          const val = values.join('=').trim().replace(/^["']|["']$/g, '');
          config[key.trim()] = val;
        }
      }
    }
    return config;
  };

  // Find sections
  let localConfig = {};
  let remoteConfig = {};

  lines.forEach((line, index) => {
    if (line.includes('Database Configuration(local setup)')) {
      localConfig = parseBlock(index);
    }
    if (line.includes('Database Configuration(Dev setup) latest')) {
      remoteConfig = parseBlock(index);
    }
  });

  // Map to script format
  // PROD object in script = SOURCE (Remote AWS DB)
  const prod = {
    host: remoteConfig.DB_HOST,
    user: remoteConfig.DB_USER,
    password: remoteConfig.DB_PASSWORD,
    database: remoteConfig.DB_DATABASE,
    port: parseInt(remoteConfig.DB_PORT || '5432')
  };

  // DEV object in script = DESTINATION (Localhost)
  const dev = {
    host: localConfig.DB_HOST || 'localhost',
    user: localConfig.DB_USER || 'postgres',
    password: localConfig.DB_PASSWORD,
    database: localConfig.DB_DATABASE || 'postgres',
    port: parseInt(localConfig.DB_PORT || '5432')
  };

  // Validation
  const validate = (config, name) => {
    if (!config.host || !config.user || !config.database) {
      throw new Error(`Incomplete configuration for ${name}. Found: ${JSON.stringify(config)}`);
    }
  };

  try {
    validate(prod, 'Production (Source)');
    validate(dev, 'Development (Target)');
  } catch (error) {
    logError('Parsing Failed. Debug Info:');
    logError('Local Parsed: ' + JSON.stringify(localConfig));
    logError('Remote Parsed: ' + JSON.stringify(remoteConfig));
    throw error;
  }

  return { dev, prod };
}

/**
 * Get SSL configuration for database connection
 * AWS RDS requires SSL for remote connections
 */
function getSSLConfig(config) {
  // Check if it's a remote database (not localhost)
  const isRemote = config.host !== 'localhost' &&
    config.host !== '127.0.0.1' &&
    !config.host.startsWith('192.168.') &&
    !config.host.startsWith('10.');
  return isRemote ? { rejectUnauthorized: false } : false;
}

/**
 * Test database connection
 */
async function testConnection(config, name) {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: getSSLConfig(config)
  });

  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    logSuccess(`Connected to ${name} database: ${config.database}`);
    await client.end();
    return true;
  } catch (error) {
    logError(`Failed to connect to ${name} database: ${error.message}`);
    await client.end().catch(() => { });
    return false;
  }
}

/**
 * Get list of all tables in database
 */
async function getTables(config, name) {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: getSSLConfig(config)
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    await client.end();
    return result.rows.map(row => row.table_name);
  } catch (error) {
    logError(`Failed to get tables from ${name}: ${error.message}`);
    await client.end().catch(() => { });
    return [];
  }
}

/**
 * Get row count for a table
 */
async function getRowCount(config, tableName, name) {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: getSSLConfig(config)
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
    await client.end();
    return parseInt(result.rows[0].count);
  } catch (error) {
    logWarning(`Could not count rows in ${tableName}: ${error.message}`);
    await client.end().catch(() => { });
    return 0;
  }
}

/**
 * Find PostgreSQL executable (pg_dump or psql), prioritizing PostgreSQL 18+ over older versions
 */
function findPgTool(toolName = 'pg_dump') {
  // Common PostgreSQL installation paths (Windows) - check newer versions first
  const possiblePaths = [
    `C:\\Program Files\\PostgreSQL\\18\\bin\\${toolName}.exe`,
    `C:\\Program Files\\PostgreSQL\\17\\bin\\${toolName}.exe`,
    `C:\\Program Files (x86)\\PostgreSQL\\18\\bin\\${toolName}.exe`,
    `C:\\Program Files (x86)\\PostgreSQL\\17\\bin\\${toolName}.exe`,
  ];

  // Check specific paths first (prioritize newer versions)
  for (const toolPath of possiblePaths) {
    if (fs.existsSync(toolPath)) {
      try {
        // Verify it works
        const versionOutput = execSync(`"${toolPath}" --version`, { encoding: 'utf8', timeout: 5000 });
        if (versionOutput) {
          const version = versionOutput.trim();
          logInfo(`Found: ${version} at ${toolPath}`);
          return toolPath;
        }
      } catch (e) {
        // Continue to next path
        continue;
      }
    }
  }

  // Fall back to system PATH (but warn if it's an old version)
  try {
    const versionOutput = execSync(`${toolName} --version`, { encoding: 'utf8', timeout: 5000 });
    const version = versionOutput.trim();
    logInfo(`Using ${toolName} from PATH: ${version}`);

    // Check if version is too old
    const versionMatch = version.match(/(\d+)\.(\d+)/);
    if (versionMatch) {
      const majorVersion = parseInt(versionMatch[1]);
      if (majorVersion < 17) {
        logWarning(`⚠️  WARNING: ${toolName} version ${majorVersion} may not work with PostgreSQL 17.4 server`);
        logWarning(`⚠️  PostgreSQL 18 found at: C:\\Program Files\\PostgreSQL\\18\\bin\\${toolName}.exe`);
        logWarning(`⚠️  Please ensure PostgreSQL 18 is in your PATH, or the script will use it automatically`);
      }
    }

    return toolName;
  } catch (e) {
    logError(`${toolName} not found in PATH or standard locations`);
    throw new Error(`${toolName} command not found. Please install PostgreSQL client tools.`);
  }
}

/**
 * Find pg_dump executable, prioritizing PostgreSQL 18+ over older versions
 */
function findPgDump() {
  return findPgTool('pg_dump');
}

/**
 * Export data from production using pg_dump
 */
async function exportProductionData(prodConfig, backupFile) {
  logInfo('Exporting data from production (READ-ONLY operation - production is safe)...');

  // Find pg_dump executable (prioritize PostgreSQL 18+)
  logInfo('Auto-detecting pg_dump executable...');
  const pgDumpPath = findPgDump();

  // Determine if remote database (requires SSL)
  const isRemote = prodConfig.host !== 'localhost' && prodConfig.host !== '127.0.0.1';

  // Build pg_dump command with separate parameters (more reliable than connection string)
  // Using FULL backup (schema + data) so we create tables AND import data in one go
  const dumpArgs = [
    pgDumpPath,
    '-h', prodConfig.host,
    '-p', prodConfig.port.toString(),
    '-U', prodConfig.user,
    '-d', prodConfig.database,
    '--no-owner',
    '--no-acl',
    '--clean',  // Drop existing objects before recreating
    '--if-exists'  // Only drop if exists (safer)
  ];

  // Set environment variables for password and SSL
  const env = { ...process.env };
  env.PGPASSWORD = prodConfig.password;
  if (isRemote) {
    env.PGSSLMODE = 'require';
    logInfo('SSL: ENABLED (required for AWS RDS)');
  }

  logInfo(`Executing: pg_dump (schema + data)...`);

  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(backupFile);
    const dumpProcess = spawn(dumpArgs[0], dumpArgs.slice(1), {
      env: env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    dumpProcess.stdout.pipe(outputStream);

    let stderr = '';
    dumpProcess.stderr.on('data', (data) => {
      const errorText = data.toString();
      stderr += errorText;
      process.stderr.write(data); // Show errors to user in real-time
    });

    dumpProcess.on('close', (code) => {
      outputStream.end();

      // Small delay to ensure file is fully written
      setTimeout(() => {
        if (code !== 0) {
          logError(`pg_dump failed with exit code ${code}`);
          if (stderr) {
            logError(`Error details: ${stderr.trim()}`);
          }

          // Clean up failed backup file
          if (fs.existsSync(backupFile)) {
            try {
              fs.unlinkSync(backupFile);
            } catch (e) {
              // Ignore cleanup errors
            }
          }

          reject(new Error(`pg_dump failed: ${stderr || 'Unknown error'}`));
        } else {
          // Verify backup file was created and has content
          if (fs.existsSync(backupFile)) {
            const stats = fs.statSync(backupFile);
            if (stats.size > 0) {
              logSuccess(`Backup created: ${backupFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
              resolve(true);
            } else {
              reject(new Error('Backup file is empty'));
            }
          } else {
            reject(new Error('Backup file was not created'));
          }
        }
      }, 500);
    });

    dumpProcess.on('error', (error) => {
      outputStream.end();
      logError(`pg_dump process error: ${error.message}`);
      if (error.code === 'ENOENT') {
        reject(new Error('pg_dump command not found. Please install PostgreSQL client tools.'));
      } else {
        reject(error);
      }
    });
  });
}

/**
 * Import data to development using psql
 */
async function importToDevelopment(devConfig, backupFile) {
  logInfo('Importing data to development database...');

  // Find psql executable (prioritize PostgreSQL 18+)
  logInfo('Auto-detecting psql executable...');
  const psqlPath = findPgTool('psql');

  // Determine if remote database (requires SSL)
  const isRemote = devConfig.host !== 'localhost' && devConfig.host !== '127.0.0.1';

  // Set environment variables for password and SSL
  const env = { ...process.env };
  env.PGPASSWORD = devConfig.password;
  if (isRemote) {
    env.PGSSLMODE = 'require';
    logInfo('SSL: ENABLED (required for AWS RDS)');
  }

  // Simple import - just pipe SQL file into psql
  logInfo('Importing data from backup file...');

  return new Promise((resolve, reject) => {
    const inputStream = fs.createReadStream(backupFile);
    const psqlArgs = [
      '-h', devConfig.host,
      '-p', devConfig.port.toString(),
      '-U', devConfig.user,
      '-d', devConfig.database
    ];

    const psqlProcess = spawn(psqlPath, psqlArgs, {
      env: env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    inputStream.pipe(psqlProcess.stdin);

    let stderr = '';

    psqlProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    psqlProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      // Show errors but ignore expected ones from --clean flag
      if (text.includes('ERROR') || text.includes('FATAL')) {
        // Ignore expected errors:
        // - "does not exist" (from DROP IF EXISTS)
        // - "already exists" (might happen in some edge cases)
        const isExpectedError = text.includes('does not exist') ||
          text.includes('already exists') ||
          text.includes('constraint') && text.includes('does not exist');
        if (!isExpectedError) {
          process.stderr.write(data);
        }
      }
    });

    psqlProcess.on('close', (code) => {
      inputStream.close();

      // Check if errors are just expected ones
      const expectedErrors = (stderr.match(/does not exist/g) || []).length +
        (stderr.match(/already exists/g) || []).length;
      const totalErrors = (stderr.match(/ERROR/g) || []).length;
      const unexpectedErrors = totalErrors - expectedErrors;

      if (code !== 0) {
        if (unexpectedErrors === 0) {
          // Only expected errors - import likely succeeded
          logSuccess('Schema and data imported successfully (some expected warnings ignored)');
          resolve(true);
        } else {
          logError(`Import failed with exit code ${code}`);
          // Show first 500 chars of error for debugging
          const errorPreview = stderr.substring(0, 500);
          logError(`Error preview: ${errorPreview}${stderr.length > 500 ? '...' : ''}`);
          reject(new Error(`Import failed: ${errorPreview.substring(0, 200)}`));
        }
        return;
      }

      logSuccess('Schema and data imported successfully');
      resolve(true);
    });

    psqlProcess.on('error', (error) => {
      inputStream.close();
      logError(`psql error: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Reset sequences in development database
 */

async function resetSequences(devConfig) {
  logInfo('Resetting sequences...');

  const client = new Client({
    host: devConfig.host,
    port: devConfig.port,
    user: devConfig.user,
    password: devConfig.password,
    database: devConfig.database,
    ssl: getSSLConfig(devConfig)
  });

  try {
    await client.connect();

    // Get all sequences
    const sequencesResult = await client.query(`
      SELECT sequence_name, 
             REPLACE(sequence_name, '_id_seq', '') as table_name
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
      AND sequence_name LIKE '%_id_seq';
    `);

    for (const seq of sequencesResult.rows) {
      try {
        const tableName = seq.table_name;
        // Check if table exists and get max id
        const maxResult = await client.query(`SELECT MAX(id) as max_id FROM "${tableName}"`);
        const maxId = maxResult.rows[0].max_id || 0;

        if (maxId > 0) {
          await client.query(`SELECT setval('${seq.sequence_name}', ${maxId}, true)`);
          logInfo(`Reset sequence ${seq.sequence_name} to ${maxId}`);
        }
      } catch (err) {
        logWarning(`Could not reset sequence ${seq.sequence_name}: ${err.message}`);
      }
    }

    await client.end();
    logSuccess('Sequences reset successfully');
    return true;
  } catch (error) {
    logError(`Failed to reset sequences: ${error.message}`);
    await client.end().catch(() => { });
    return false;
  }
}

/**
 * Verify migration by comparing row counts
 */
async function verifyMigration(prodConfig, devConfig) {
  logStep('Verification', 'Comparing data between production and development');

  const prodTables = await getTables(prodConfig, 'production');
  const devTables = await getTables(devConfig, 'development');

  logInfo(`Production tables: ${prodTables.length}`);
  logInfo(`Development tables: ${devTables.length}`);

  let allMatch = true;
  const comparison = [];

  for (const table of prodTables) {
    if (devTables.includes(table)) {
      const prodCount = await getRowCount(prodConfig, table, 'production');
      const devCount = await getRowCount(devConfig, table, 'development');

      const match = prodCount === devCount;
      comparison.push({ table, prodCount, devCount, match });

      if (match) {
        logSuccess(`${table}: ${prodCount} rows (match)`);
      } else {
        logWarning(`${table}: Prod=${prodCount}, Dev=${devCount} (mismatch)`);
        allMatch = false;
      }
    } else {
      logWarning(`Table ${table} exists in production but not in development`);
      allMatch = false;
    }
  }

  return allMatch;
}

/**
 * Main migration function
 */
async function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🚀 PRODUCTION TO DEVELOPMENT DATA MIGRATION', 'bright');
  log('='.repeat(60), 'cyan');

  logWarning('IMPORTANT: This script only READS from production database.');
  logInfo('Production data will NOT be modified or affected in any way.\n');

  try {
    // Step 1: Parse credentials
    logStep(1, 'Parsing database credentials from .env file');
    const { dev, prod } = parseEnvCredentials();

    logInfo(`Production: ${prod.database} @ ${prod.host}:${prod.port}`);
    logInfo(`Development: ${dev.database} @ ${dev.host}:${dev.port}`);

    // Step 2: Test connections
    logStep(2, 'Testing database connections');
    const prodConnected = await testConnection(prod, 'production');
    const devConnected = await testConnection(dev, 'development');

    if (!prodConnected || !devConnected) {
      throw new Error('Failed to connect to one or both databases');
    }

    // Step 3: Confirm migration
    logStep(4, 'Migration confirmation');
    logWarning('This will REPLACE all data in the development database!');
    logInfo('Press Ctrl+C to cancel, or wait 5 seconds to continue...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 4: Create backup directory
    const backupDir = path.join(__dirname, 'migration-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFile = path.join(backupDir, `prod-to-dev-${timestamp}.sql`);

    // Step 5: Export from production (schema + data)
    logStep(4, 'Exporting schema and data from production (READ-ONLY)');
    try {
      await exportProductionData(prod, backupFile);

      // Verify backup file was created
      if (!fs.existsSync(backupFile)) {
        throw new Error('Backup file was not created');
      }

      const stats = fs.statSync(backupFile);
      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }

      logSuccess(`Backup created: ${backupFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      throw new Error(`Failed to export data from production: ${error.message}`);
    }

    // Step 6: Import to development (schema + data)
    logStep(5, 'Importing schema and data to development');
    try {
      await importToDevelopment(dev, backupFile);
    } catch (error) {
      throw new Error(`Failed to import data to development: ${error.message}`);
    }

    // Step 7: Reset sequences
    logStep(6, 'Resetting sequences');
    await resetSequences(dev);

    // Step 8: Verify migration
    logStep(7, 'Verifying migration');
    const verified = await verifyMigration(prod, dev);

    if (verified) {
      logSuccess('\n✅ Migration completed successfully!');
      logInfo(`Backup file saved at: ${backupFile}`);
    } else {
      logWarning('\n⚠️  Migration completed with some discrepancies');
      logInfo('Please review the verification results above');
    }

    log('\n' + '='.repeat(60), 'green');
    log('✨ Migration process completed!', 'green');
    log('='.repeat(60), 'green');

  } catch (error) {
    logError(`\n❌ Migration failed: ${error.message}`);
    logError(error.stack);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main().catch(error => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };

