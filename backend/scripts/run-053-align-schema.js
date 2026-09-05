/**
 * Run migration 053 and record it in SequelizeMeta.
 * Usage: node scripts/run-053-align-schema.js
 */
require('dotenv').config();
const path = require('path');
const { sequelize } = require('../models');
const migration = require('../migrations/053-align-models-schema-catch-up.js');

(async () => {
  const qi = sequelize.getQueryInterface();
  const Sequelize = require('sequelize');

  console.log('Running 053-align-models-schema-catch-up.js...\n');
  await migration.up(qi, Sequelize);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      name VARCHAR(255) NOT NULL PRIMARY KEY
    )
  `);

  await sequelize.query(
    `INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT DO NOTHING`,
    { replacements: { name: '053-align-models-schema-catch-up.js' } }
  );

  const [rows] = await sequelize.query(
    `SELECT name FROM "SequelizeMeta" WHERE name = '053-align-models-schema-catch-up.js'`
  );
  console.log('\nSequelizeMeta recorded:', rows.length ? 'yes' : 'NO');

  await sequelize.close();
  console.log('Done.');
})().catch(async (e) => {
  console.error(e);
  try {
    await sequelize.close();
  } catch (_) {}
  process.exit(1);
});
