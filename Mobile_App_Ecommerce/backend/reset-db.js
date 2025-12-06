/**
 * Database Reset Script
 * 
 * This script drops all existing tables and resets the database
 * to ensure clean migrations with correct UUID schema.
 * 
 * Usage: node reset-db.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE || process.env.DB_NAME || 'ecommerce_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established.');

    // Drop all tables in the correct order (respecting foreign keys)
    const tables = [
      'cart_items',
      'order_items',
      'orders',
      'products',
      'users',
      'SequelizeMeta'
    ];

    console.log('\nDropping existing tables...');
    for (const table of tables) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
        console.log(`  ✓ Dropped table: ${table}`);
      } catch (error) {
        console.log(`  ✗ Error dropping table ${table}:`, error.message);
      }
    }

    // Drop enum types
    console.log('\nDropping enum types...');
    await sequelize.query('DROP TYPE IF EXISTS order_status CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS payment_status CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS enum_users_role CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS enum_orders_status CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS enum_orders_payment_status CASCADE;');
    console.log('  ✓ Dropped enum types');

    console.log('\n✓ Database reset complete!');
    console.log('\nYou can now run migrations: npm run db:migrate');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error resetting database:', error);
    await sequelize.close();
    process.exit(1);
  }
}

resetDatabase();

