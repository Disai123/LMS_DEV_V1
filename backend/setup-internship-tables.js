/**
 * Run this script ONCE to create the internship tables.
 * Usage: cd backend && node setup-internship-tables.js
 */
require('dotenv').config();

if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST.includes('localhost')) {
  process.env.NODE_ENV = 'development';
}

const { sequelize } = require('./models');

const createTables = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Create internships table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        logo VARCHAR(500),
        duration VARCHAR(100) NOT NULL DEFAULT '4-12 Weeks',
        mode VARCHAR(20) NOT NULL DEFAULT 'Online' CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
        certificate_type VARCHAR(100) NOT NULL DEFAULT 'Completion',
        domains_offered JSONB DEFAULT '[]'::jsonb,
        key_features JSONB DEFAULT '[]'::jsonb,
        outcomes JSONB DEFAULT '[]'::jsonb,
        highlights JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        published_at TIMESTAMP,
        max_registrations INTEGER,
        current_registrations INTEGER NOT NULL DEFAULT 0,
        created_by INTEGER NOT NULL REFERENCES users(id),
        updated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ internships table created (or already exists)');

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
      CREATE INDEX IF NOT EXISTS idx_internships_is_published ON internships(is_published);
      CREATE INDEX IF NOT EXISTS idx_internships_created_by ON internships(created_by);
    `);

    // Create internship_registrations table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS internship_registrations (
        id SERIAL PRIMARY KEY,
        internship_id INTEGER NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'in_progress', 'completed', 'dropped')),
        registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP,
        certificate_url TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT unique_internship_student UNIQUE (internship_id, student_id)
      );
    `);
    console.log('✅ internship_registrations table created (or already exists)');

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_intern_reg_internship ON internship_registrations(internship_id);
      CREATE INDEX IF NOT EXISTS idx_intern_reg_student ON internship_registrations(student_id);
    `);

    console.log('');
    console.log('🎉 All internship tables ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up internship tables:', error.message);
    process.exit(1);
  }
};

createTables();
