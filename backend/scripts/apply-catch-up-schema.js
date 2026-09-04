/**
 * One-shot: apply catch-up schema + mark blocked migrations as up
 * Run: node scripts/apply-catch-up-schema.js
 */
require('dotenv').config();
const { sequelize } = require('../models');
const catchUp = require('../migrations/052-catch-up-profile-and-assessment-fields.js');

async function main() {
  console.log('\nApplying catch-up schema (052)...\n');
  await catchUp.up(sequelize.getQueryInterface(), require('sequelize'));

  const migration051 = require('../migrations/051-create-notifications.js');
  try {
    const [[{ exists }]] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'notifications'
      ) AS exists
    `);
    if (!exists) {
      console.log('Running 051-create-notifications.js...');
      await migration051.up(sequelize.getQueryInterface(), require('sequelize'));
      console.log('notifications table created');
    } else {
      console.log('notifications table already exists');
    }
  } catch (e) {
    console.warn('Could not run 051 migration:', e.message);
  }

  const pending = [
    '048-create-internship-registrations.js',
    '049-create-internship-submissions.js',
    '050-add-internship-and-pq-fields-to-scores.js',
    '051-create-notifications.js',
    '052-catch-up-profile-and-assessment-fields.js',
    'add-package-plan-fields.js'
  ];

  for (const name of pending) {
    try {
      await sequelize.query(
        'INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT DO NOTHING',
        { replacements: { name } }
      );
      console.log('Marked up:', name);
    } catch (e) {
      // fallback without ON CONFLICT for older PG
      try {
        await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (:name)', {
          replacements: { name }
        });
        console.log('Marked up:', name);
      } catch (e2) {
        if (e2.message.includes('duplicate') || e2.message.includes('unique')) {
          console.log('Already marked:', name);
        } else {
          console.log('Skip mark', name, e2.message);
        }
      }
    }
  }

  await sequelize.close();
  console.log('\nDone. Run: node scripts/check-schema.js\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
