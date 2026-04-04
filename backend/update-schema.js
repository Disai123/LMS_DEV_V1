require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: false
        }
    }
);

async function checkSchema() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established.');

    const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_scores'");
    const existingColumns = results.map(r => (r.column_name || r.COLUMN_NAME).toLowerCase());
    console.log('Existing columns:', existingColumns);

    const neededColumns = [
        { name: 'total_internship_points', type: 'INTEGER DEFAULT 0' },
        { name: 'internships_completed_count', type: 'INTEGER DEFAULT 0' },
        { name: 'pq_score', type: 'DECIMAL(4,2) DEFAULT 0.00' }
    ];
    
    for (const col of neededColumns) {
      if (!existingColumns.includes(col.name.toLowerCase())) {
        console.log(`Adding column: ${col.name}`);
        await sequelize.query(`ALTER TABLE student_scores ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      }
    }
    
    console.log('Schema update complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating schema:', err);
    process.exit(1);
  }
}

checkSchema();
