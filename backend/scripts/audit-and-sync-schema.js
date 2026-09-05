/**
 * Compare all Sequelize models to live Postgres tables/columns,
 * then create missing tables and add missing columns (no migrations).
 *
 * Uses pg Client for information_schema (Sequelize quoteIdentifiers:false
 * can mangle those catalog queries).
 *
 * Usage: node scripts/audit-and-sync-schema.js
 *        node scripts/audit-and-sync-schema.js --dry-run
 */
require('dotenv').config();
const { Client } = require('pg');
const { sequelize } = require('../models');
const models = require('../models');

const dryRun = process.argv.includes('--dry-run');
const SKIP_KEYS = new Set(['sequelize', 'Sequelize', 'Op', 'QueryTypes']);

function pgClient() {
  return new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'postgres'
  });
}

function getModelEntries() {
  return Object.keys(models)
    .filter((k) => !SKIP_KEYS.has(k) && models[k] && typeof models[k].getTableName === 'function')
    .map((name) => {
      const m = models[name];
      const t = m.getTableName();
      const tableName = typeof t === 'string' ? t : t.tableName;
      return { name, model: m, tableName };
    })
    .sort((a, b) => a.tableName.localeCompare(b.tableName));
}

function expectedColumns(model) {
  const cols = [];
  for (const [attr, def] of Object.entries(model.rawAttributes || {})) {
    if (def.type && def.type.key === 'VIRTUAL') continue;
    cols.push(def.field || attr);
  }
  return cols;
}

async function loadCatalog(client) {
  const tablesRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  const tableSet = new Set(tablesRes.rows.map((t) => t.table_name));

  const colsRes = await client.query(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public'
  `);
  const colMap = {};
  for (const c of colsRes.rows) {
    if (!colMap[c.table_name]) colMap[c.table_name] = new Set();
    colMap[c.table_name].add(c.column_name);
  }
  return { tableSet, colMap };
}

async function main() {
  await sequelize.authenticate();
  const client = pgClient();
  await client.connect();

  console.log(
    dryRun
      ? `DRY RUN — DB=${client.database}\n`
      : `AUDIT + SYNC (no new migrations) — DB=${client.database}\n`
  );

  let { tableSet, colMap } = await loadCatalog(client);
  const entries = getModelEntries();
  const missingTables = [];
  const missingColumns = [];

  for (const { name, model, tableName } of entries) {
    if (!tableSet.has(tableName)) {
      missingTables.push({ name, model, tableName });
      continue;
    }
    const dbCols = colMap[tableName] || new Set();
    const miss = expectedColumns(model).filter((c) => !dbCols.has(c));
    if (miss.length) missingColumns.push({ name, model, tableName, columns: miss });
  }

  console.log('=== MISSING TABLES (model exists, DB lacks) ===');
  if (!missingTables.length) console.log('(none)');
  else missingTables.forEach((x) => console.log(`  ${x.name} -> ${x.tableName}`));

  console.log('\n=== MISSING COLUMNS (model has, DB lacks) ===');
  if (!missingColumns.length) console.log('(none)');
  else {
    missingColumns.forEach((x) =>
      console.log(`  ${x.tableName} [${x.name}]: ${x.columns.join(', ')}`)
    );
  }

  // Extra: tables in DB with no matching model (informational)
  const modelTables = new Set(entries.map((e) => e.tableName));
  const orphanTables = [...tableSet].filter((t) => !modelTables.has(t) && t !== 'SequelizeMeta');
  console.log('\n=== DB TABLES WITH NO MODEL (informational) ===');
  if (!orphanTables.length) console.log('(none)');
  else orphanTables.sort().forEach((t) => console.log(`  ${t}`));

  if (dryRun) {
    console.log(`\nChecked ${entries.length} models against ${tableSet.size} DB tables.`);
    await client.end();
    await sequelize.close();
    return;
  }

  console.log('\n=== APPLYING FIXES ===');

  for (const { name, model, tableName } of missingTables) {
    console.log(`Creating table ${tableName} (${name})...`);
    await model.sync();
    console.log(`  OK: ${tableName}`);
  }

  for (const { name, model, tableName, columns } of missingColumns) {
    console.log(`Altering ${tableName} (${name}) for: ${columns.join(', ')}...`);
    await model.sync({ alter: true });
    console.log(`  OK: ${tableName}`);
  }

  ({ tableSet, colMap } = await loadCatalog(client));
  let remaining = 0;
  for (const { name, model, tableName } of entries) {
    if (!tableSet.has(tableName)) {
      console.log(`STILL MISSING TABLE: ${tableName} [${name}]`);
      remaining++;
      continue;
    }
    const miss = expectedColumns(model).filter((c) => !(colMap[tableName] || new Set()).has(c));
    if (miss.length) {
      console.log(`STILL MISSING COLUMNS on ${tableName}: ${miss.join(', ')}`);
      remaining++;
    }
  }

  if (remaining === 0) {
    console.log('\nAll model tables/columns are present in the database.');
  } else {
    console.log(`\n${remaining} gap(s) remain — check logs above.`);
  }

  await client.end();
  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
