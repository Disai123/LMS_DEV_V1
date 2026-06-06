#!/usr/bin/env node

/**
 * One-time migration: Dev RDS PostgreSQL -> local SQLite file.
 * READ-ONLY on RDS. Creates schema via sequelize.sync(), then copies all rows.
 *
 * Usage:
 *   node migrate-rds-to-sqlite.js          # fails if database.sqlite exists
 *   node migrate-rds-to-sqlite.js --force  # overwrite existing file
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { getSSLConfig, getSqliteStorage, trimEnv } = require('./config/database');

const force = process.argv.includes('--force');

function log(msg) {
  console.log(msg);
}

function getRdsConfig() {
  return {
    host: trimEnv(process.env.RDS_DB_HOST || process.env.DB_HOST),
    port: parseInt(trimEnv(process.env.RDS_DB_PORT || process.env.DB_PORT) || '5432', 10),
    user: trimEnv(process.env.RDS_DB_USER || process.env.DB_USER),
    password: trimEnv(process.env.RDS_DB_PASSWORD || process.env.DB_PASSWORD),
    database: trimEnv(process.env.RDS_DB_DATABASE || process.env.DB_DATABASE || process.env.DB_NAME)
  };
}

function transformValue(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return value;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}

function normalizeRowForSqlite(tableName, row) {
  const normalized = { ...row };

  if (tableName === 'notifications') {
    if (normalized.link && !normalized.action_url) {
      normalized.action_url = normalized.link;
    }
    if (!normalized.updated_at && normalized.created_at) {
      normalized.updated_at = normalized.created_at;
    }
  }

  if (tableName === 'hackathon_group_members' && !normalized.added_by && normalized.student_id) {
    normalized.added_by = normalized.student_id;
  }

  if (tableName === 'group_members' && !normalized.added_by && normalized.student_id) {
    normalized.added_by = normalized.student_id;
  }

  return normalized;
}

async function connectRds(config) {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: getSSLConfig(config.host)
  });
  await client.connect();
  return client;
}

async function getRdsTables(client) {
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  return result.rows.map((row) => row.table_name);
}

async function getRowCountPg(client, tableName) {
  const result = await client.query(`SELECT COUNT(*)::int AS count FROM "${tableName}"`);
  return result.rows[0].count;
}

async function fetchTableRows(client, tableName) {
  const result = await client.query(`SELECT * FROM "${tableName}"`);
  return result.rows;
}

async function sqliteTableExists(sqliteSequelize, tableName) {
  const [rows] = await sqliteSequelize.query(
    `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
    { replacements: [tableName] }
  );
  return rows.length > 0;
}

async function tableHasIntegerAutoIncrement(sqliteSequelize, tableName, connection) {
  const [rows] = await sqliteSequelize.query(
    `PRAGMA table_info("${tableName}")`,
    connection ? { connection } : {}
  );
  const idCol = rows.find((col) => col.name === 'id');
  if (!idCol) return false;
  const type = String(idCol.type || '').toUpperCase();
  return idCol.pk === 1 && type.includes('INT');
}

async function getTableImportOrder(client, tables) {
  const result = await client.query(`
    SELECT
      tc.table_name AS child_table,
      ccu.table_name AS parent_table
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
  `);

  const tableSet = new Set(tables);
  const deps = new Map();
  tables.forEach((table) => deps.set(table, new Set()));

  for (const row of result.rows) {
    if (tableSet.has(row.child_table) && tableSet.has(row.parent_table) && row.child_table !== row.parent_table) {
      deps.get(row.child_table).add(row.parent_table);
    }
  }

  const sorted = [];
  const resolved = new Set();

  while (sorted.length < tables.length) {
    let progressed = false;

    for (const table of tables) {
      if (resolved.has(table)) continue;
      const parents = deps.get(table) || new Set();
      const ready = [...parents].every((parent) => resolved.has(parent));
      if (ready) {
        sorted.push(table);
        resolved.add(table);
        progressed = true;
      }
    }

    if (!progressed) {
      const remaining = tables.filter((table) => !resolved.has(table));
      sorted.push(...remaining);
      break;
    }
  }

  return sorted;
}

async function getSqliteColumns(sqliteSequelize, tableName, connection) {
  const [rows] = await sqliteSequelize.query(
    `PRAGMA table_info("${tableName}")`,
    { connection }
  );
  return new Set(rows.map((col) => col.name));
}

async function importTable(sqliteSequelize, tableName, rows, connection) {
  if (!rows.length) {
    log(`   ${tableName}: 0 rows (skipped)`);
    return 0;
  }

  const sqliteColumns = await getSqliteColumns(sqliteSequelize, tableName, connection);
  let skippedColumnsLogged = false;
  let imported = 0;

  for (const row of rows) {
    const mappedRow = normalizeRowForSqlite(tableName, row);
    const skippedColumns = Object.keys(mappedRow).filter((col) => !sqliteColumns.has(col));
    if (skippedColumns.length && !skippedColumnsLogged) {
      log(`   ${tableName}: ignoring RDS-only columns: ${skippedColumns.join(', ')}`);
      skippedColumnsLogged = true;
    }

    const columns = Object.keys(mappedRow).filter((col) => sqliteColumns.has(col));
    if (!columns.length) continue;

    const values = columns.map((col) => transformValue(mappedRow[col]));
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`;

    try {
      await sqliteSequelize.query(sql, {
        replacements: values,
        connection
      });
      imported += 1;
    } catch (insertError) {
      throw new Error(
        `Failed importing ${tableName} row id=${mappedRow.id ?? 'unknown'}: ${insertError.message}`
      );
    }
  }

  log(`   ${tableName}: ${imported} rows`);
  return imported;
}

async function resetAutoIncrement(sqliteSequelize, tableName, connection) {
  const [rows] = await sqliteSequelize.query(
    `SELECT MAX(id) AS max_id FROM "${tableName}"`,
    { connection }
  );
  const maxId = parseInt(rows[0]?.max_id, 10);
  if (!Number.isFinite(maxId)) return;

  await sqliteSequelize.query(
    `INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES (?, ?)`,
    { replacements: [tableName, maxId], connection }
  );
}

async function getSqliteRowCount(sqliteSequelize, tableName) {
  const [rows] = await sqliteSequelize.query(`SELECT COUNT(*) AS count FROM "${tableName}"`);
  return parseInt(rows[0].count, 10);
}

async function main() {
  const rdsConfig = getRdsConfig();
  const sqlitePath = getSqliteStorage();

  if (!rdsConfig.host || !rdsConfig.user || !rdsConfig.database) {
    throw new Error('Missing RDS credentials. Set RDS_DB_* (or DB_*) in .env');
  }

  log('\n=== RDS -> SQLite Migration ===\n');
  log(`Source: ${rdsConfig.host}/${rdsConfig.database}`);
  log(`Target: ${sqlitePath}\n`);

  if (fs.existsSync(sqlitePath) && !force) {
    throw new Error(
      `SQLite file already exists at ${sqlitePath}. Use --force to overwrite.`
    );
  }

  if (fs.existsSync(sqlitePath)) {
    fs.unlinkSync(sqlitePath);
    log('Removed existing SQLite file (--force).\n');
  }

  process.env.DB_DIALECT = 'sqlite';
  process.env.DB_STORAGE = sqlitePath;
  process.env.NODE_ENV = 'development';

  delete require.cache[require.resolve('./config/database')];
  delete require.cache[require.resolve('./models/index')];

  const { sequelize } = require('./models');

  log('Creating SQLite schema from Sequelize models...');
  await sequelize.sync({ force: true });
  log('Schema created.\n');

  log('Connecting to RDS (read-only)...');
  const pgClient = await connectRds(rdsConfig);
  const tables = await getRdsTables(pgClient);
  const importOrder = await getTableImportOrder(pgClient, tables);
  log(`Found ${tables.length} tables on RDS.\n`);

  const connection = await sequelize.connectionManager.getConnection();
  try {
    await sequelize.query('PRAGMA foreign_keys = OFF', { connection });

    log('Importing data (parent tables first, FK checks disabled)...');
    let totalImported = 0;
    for (const tableName of importOrder) {
      if (!(await sqliteTableExists(sequelize, tableName))) {
        log(`   ${tableName}: skipped (no matching Sequelize model/table)`);
        continue;
      }

      const rows = await fetchTableRows(pgClient, tableName);
      const count = await importTable(sequelize, tableName, rows, connection);
      totalImported += count;
      if (rows.length && (await tableHasIntegerAutoIncrement(sequelize, tableName, connection))) {
        await resetAutoIncrement(sequelize, tableName, connection);
      }
    }

    await sequelize.query('PRAGMA foreign_keys = ON', { connection });
    log(`\nImported ${totalImported} total rows.`);
  } finally {
    await sequelize.connectionManager.releaseConnection(connection);
  }

  await pgClient.end();

  log('\nVerifying row counts...');
  const pgClientVerify = await connectRds(rdsConfig);
  let mismatches = 0;

  for (const tableName of tables) {
    const pgCount = await getRowCountPg(pgClientVerify, tableName);
    if (!(await sqliteTableExists(sequelize, tableName))) {
      continue;
    }
    let sqliteCount = 0;
    try {
      sqliteCount = await getSqliteRowCount(sequelize, tableName);
    } catch (_) {
      sqliteCount = -1;
    }
    const match = pgCount === sqliteCount;
    if (!match) {
      mismatches += 1;
      log(`   MISMATCH ${tableName}: RDS=${pgCount}, SQLite=${sqliteCount}`);
    }
  }

  await pgClientVerify.end();
  await sequelize.close();

  log(`\nImported data into ${sqlitePath}`);
  if (mismatches === 0) {
    log('Verification passed — all table row counts match.\n');
    log('Next steps:');
    log('  1. npm start');
    log('  2. Copy database.sqlite to your server and set DB_DIALECT=sqlite + DB_STORAGE on server .env\n');
  } else {
    log(`\nWarning: ${mismatches} table(s) have row count mismatches. Review logs above.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message);
  if (err.original) console.error('Details:', err.original.message || err.original);
  if (err.parent) console.error('SQL error:', err.parent.message || err.parent);
  if (err.sql) console.error('SQL:', err.sql);
  process.exit(1);
});
