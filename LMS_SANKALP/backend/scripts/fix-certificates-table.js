/**
 * Rebuild certificates table without realtime_project FK (SANKALP course-only).
 * Safe to run multiple times — skips if FK already removed.
 */
require('dotenv').config();
const { sequelize } = require('../models');

async function fixCertificatesTable() {
  const [rows] = await sequelize.query(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='certificates'"
  );
  const ddl = rows[0]?.sql || '';
  if (ddl && !ddl.includes('realtime_project_submissions')) {
    console.log('Certificates table already fixed.');
    return;
  }

  await sequelize.query('PRAGMA foreign_keys=OFF');

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS certificates_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL ON UPDATE CASCADE,
      certificate_type TEXT NOT NULL DEFAULT 'course',
      test_attempt_id INTEGER REFERENCES test_attempts(id) ON DELETE SET NULL ON UPDATE CASCADE,
      certificate_number VARCHAR(100) NOT NULL UNIQUE,
      issued_date DATETIME NOT NULL,
      expiry_date DATETIME,
      certificate_url VARCHAR(500),
      verification_code VARCHAR(50) UNIQUE,
      metadata JSON DEFAULT '{}',
      is_valid TINYINT(1) DEFAULT 1,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
    )
  `);

  const [countRows] = await sequelize.query('SELECT COUNT(*) AS c FROM certificates');
  if (Number(countRows[0].c) > 0) {
    await sequelize.query(`
      INSERT INTO certificates_new (
        id, student_id, course_id, certificate_type, test_attempt_id,
        certificate_number, issued_date, expiry_date, certificate_url,
        verification_code, metadata, is_valid, created_at, updated_at
      )
      SELECT
        id, student_id, course_id, certificate_type, test_attempt_id,
        certificate_number, issued_date, expiry_date, certificate_url,
        verification_code, metadata, is_valid, created_at, updated_at
      FROM certificates
    `);
  }

  await sequelize.query('DROP TABLE certificates');
  await sequelize.query('ALTER TABLE certificates_new RENAME TO certificates');

  await sequelize.query('PRAGMA foreign_keys=ON');
  console.log('Certificates table rebuilt without realtime_project FK.');
}

if (require.main === module) {
  fixCertificatesTable()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { fixCertificatesTable };
