/**
 * Safely add missing tables/columns to match Sequelize models.
 * No migrations. Uses ADD COLUMN IF NOT EXISTS / model.sync() for new tables only.
 *
 * Usage: node scripts/fix-schema-gaps.js
 */
require('dotenv').config();
const { Client } = require('pg');
const {
  sequelize,
  InternshipSubmission,
  GroupMember,
  HackathonGroupMember,
  Internship
} = require('../models');

function pgClient() {
  return new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || process.env.DB_NAME || 'postgres'
  });
}

async function columnExists(client, table, column) {
  const res = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name=$1 AND column_name=$2`,
    [table, column]
  );
  return res.rowCount > 0;
}

async function tableExists(client, table) {
  const res = await client.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema='public' AND table_name=$1`,
    [table]
  );
  return res.rowCount > 0;
}

async function addColumn(client, table, column, ddl) {
  if (await columnExists(client, table, column)) {
    console.log(`  skip ${table}.${column} (exists)`);
    return;
  }
  console.log(`  add ${table}.${column}`);
  await client.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
}

async function main() {
  await sequelize.authenticate();
  const client = pgClient();
  await client.connect();
  console.log(`Fixing schema gaps in DB=${client.database}\n`);

  // 1) Missing table
  if (!(await tableExists(client, 'internship_submissions'))) {
    console.log('Creating internship_submissions...');
    await InternshipSubmission.sync();
    console.log('  OK');
  } else {
    console.log('internship_submissions already exists');
  }

  // 2) internships dates
  console.log('\ninternships:');
  await addColumn(client, 'internships', 'start_date', 'TIMESTAMP WITH TIME ZONE NULL');
  await addColumn(client, 'internships', 'end_date', 'TIMESTAMP WITH TIME ZONE NULL');

  // 3) hackathon_group_members.added_by
  console.log('\nhackathon_group_members:');
  await addColumn(
    client,
    'hackathon_group_members',
    'added_by',
    'INTEGER NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL'
  );

  // 4) group_members missing member fields (was a bare join table)
  console.log('\ngroup_members:');
  const hasId = await columnExists(client, 'group_members', 'id');
  if (!hasId) {
    console.log('  add group_members.id');
    await client.query(`
      ALTER TABLE group_members ADD COLUMN id SERIAL
    `);
    // Promote to PK if none
    const pk = await client.query(`
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema='public' AND table_name='group_members'
        AND constraint_type='PRIMARY KEY'
    `);
    if (pk.rowCount === 0) {
      await client.query(`ALTER TABLE group_members ADD PRIMARY KEY (id)`);
      console.log('  set PRIMARY KEY (id)');
    }
  } else {
    console.log('  skip group_members.id (exists)');
  }

  await addColumn(
    client,
    'group_members',
    'joined_at',
    'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()'
  );
  await addColumn(
    client,
    'group_members',
    'is_leader',
    'BOOLEAN NOT NULL DEFAULT FALSE'
  );

  // status enum-like varchar (matches model values)
  if (!(await columnExists(client, 'group_members', 'status'))) {
    console.log('  add group_members.status');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE enum_group_members_status AS ENUM ('active', 'inactive', 'pending');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
    await client.query(`
      ALTER TABLE group_members
      ADD COLUMN status enum_group_members_status NOT NULL DEFAULT 'active'
    `);
  } else {
    console.log('  skip group_members.status (exists)');
  }

  await addColumn(
    client,
    'group_members',
    'added_by',
    'INTEGER NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL'
  );

  // Ensure unique (group_id, student_id) if missing
  const uniq = await client.query(`
    SELECT 1 FROM pg_indexes
    WHERE tablename='group_members' AND indexname='unique_group_student'
  `);
  if (uniq.rowCount === 0) {
    try {
      await client.query(`
        CREATE UNIQUE INDEX unique_group_student ON group_members (group_id, student_id)
      `);
      console.log('  created unique_group_student index');
    } catch (e) {
      console.log('  unique index skipped:', e.message);
    }
  }

  console.log('\nRe-checking model gaps...');
  await client.end();

  // Quick re-check via same logic as audit
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['scripts/audit-and-sync-schema.js', '--dry-run'], {
    cwd: require('path').join(__dirname, '..'),
    encoding: 'utf8'
  });
  process.stdout.write(r.stdout || '');
  if (r.stderr) process.stderr.write(r.stderr);
  await sequelize.close();
  process.exit(r.status || 0);
}

main().catch(async (e) => {
  console.error(e);
  try {
    await sequelize.close();
  } catch (_) {}
  process.exit(1);
});
