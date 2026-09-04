require('dotenv').config();
const { sequelize } = require('../models');

async function main() {
  const [cols] = await sequelize.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'notifications'
    ORDER BY ordinal_position
  `);
  console.log(cols);
  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
