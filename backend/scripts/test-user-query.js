require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  const [rows] = await sequelize.query('SELECT id, email, student_id FROM users WHERE id = 33');
  console.log('User query OK:', rows[0] || '(no row)');
  await sequelize.close();
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
