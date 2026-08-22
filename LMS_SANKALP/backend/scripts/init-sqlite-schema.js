require('dotenv').config();
const { sequelize } = require('../models');

async function initSchema() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite database.');

    await sequelize.sync({ force: process.env.DB_FORCE === 'true' });
    console.log('Schema synced successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Schema init failed:', error);
    process.exit(1);
  }
}

initSchema();
