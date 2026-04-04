const { sequelize, ContactMessage } = require('../models');

async function syncTable() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync only the ContactMessage table
    await ContactMessage.sync({ alter: true });
    console.log('ContactMessage table synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing ContactMessage table:', error);
    process.exit(1);
  }
}

syncTable();
