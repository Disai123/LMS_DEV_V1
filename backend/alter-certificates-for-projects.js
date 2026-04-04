/**
 * One-time script: Alter the existing 'certificates' table to support
 * realtime project certificates (Option A).
 *
 * Run once from the backend/ folder:
 *   node alter-certificates-for-projects.js
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const isRemote = host !== 'localhost' && host !== '127.0.0.1';

const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    dialectOptions: isRemote ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // 1. Make course_id nullable
    await sequelize.query(`
      ALTER TABLE certificates ALTER COLUMN course_id DROP NOT NULL;
    `);
    console.log('✅ course_id is now nullable');

    // 2. Add realtime_project_submission_id column (if not exists)
    const [rtCol] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'certificates' AND column_name = 'realtime_project_submission_id';
    `);
    if (rtCol.length === 0) {
      await sequelize.query(`
        ALTER TABLE certificates
        ADD COLUMN realtime_project_submission_id INTEGER
        REFERENCES realtime_project_submissions(id)
        ON UPDATE CASCADE ON DELETE SET NULL;
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_certs_rp_submission
        ON certificates(realtime_project_submission_id);
      `);
      console.log('✅ Added realtime_project_submission_id column + index');
    } else {
      console.log('ℹ️  realtime_project_submission_id already exists, skipping');
    }

    // 3. Add certificate_type ENUM column (if not exists)
    const [typeCol] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'certificates' AND column_name = 'certificate_type';
    `);
    if (typeCol.length === 0) {
      // Create ENUM type first (PostgreSQL needs it)
      await sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE enum_certificates_certificate_type AS ENUM ('course', 'realtime_project');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
      `);
      await sequelize.query(`
        ALTER TABLE certificates
        ADD COLUMN certificate_type enum_certificates_certificate_type
        NOT NULL DEFAULT 'course';
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_certs_type
        ON certificates(certificate_type);
      `);
      console.log('✅ Added certificate_type column + index');
    } else {
      console.log('ℹ️  certificate_type already exists, skipping');
    }

    console.log('\n🎉 Done! certificates table is now ready for realtime project certificates.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
