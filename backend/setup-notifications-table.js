/**
 * Run this script ONCE to create or upgrade the notifications table.
 * Usage: cd backend && node setup-notifications-table.js
 */
require('dotenv').config();

if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST.includes('localhost')) {
  process.env.NODE_ENV = 'development';
}

const { sequelize } = require('./models');

const createTables = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    console.log('Setting up notifications table...');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        action_url VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Upgrade legacy schema (link column, missing metadata/updated_at)
    await sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'notifications' AND column_name = 'link'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'notifications' AND column_name = 'action_url'
        ) THEN
          ALTER TABLE notifications RENAME COLUMN link TO action_url;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'notifications' AND column_name = 'action_url'
        ) THEN
          ALTER TABLE notifications ADD COLUMN action_url VARCHAR(255);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'notifications' AND column_name = 'metadata'
        ) THEN
          ALTER TABLE notifications ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'notifications' AND column_name = 'updated_at'
        ) THEN
          ALTER TABLE notifications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
        END IF;
      END $$;
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `);

    console.log('notifications table ready');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up notification tables:', error.message);
    process.exit(1);
  }
};

createTables();
