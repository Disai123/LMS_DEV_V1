/**
 * Run this script ONCE to create the notifications table.
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
    console.log('✅ Database connected');

    console.log('🔄 Setting up notifications table...');

    // Create notifications table with correct schema
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
    console.log('✅ notifications table created with correct schema');

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
    `);
    console.log('✅ notifications indexes created');

    console.log('');
    console.log('🎉 Notification tables ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up notification tables:', error.message);
    process.exit(1);
  }
};

createTables();
