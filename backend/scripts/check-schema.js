require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  const [userCols] = await sequelize.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name IN (
      'student_id','education_level','notification_preferences','college_name','bio','phone'
    ) ORDER BY column_name
  `);
  const [enrollCols] = await sequelize.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name IN ('test_passed')
  `);
  const [statusEnum] = await sequelize.query(`
    SELECT e.enumlabel FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'enum_enrollments_status'
    ORDER BY e.enumsortorder
  `);
  const [testCols] = await sequelize.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'course_tests' AND column_name IN ('time_limit_minutes','max_attempts')
  `);
  console.log('User columns:', userCols.map(c => c.column_name).join(', ') || '(none)');
  console.log('Enrollment test_passed:', enrollCols.length ? 'yes' : 'NO');
  console.log('Enrollment status enum:', statusEnum.map(e => e.enumlabel).join(', '));
  console.log('Course test columns:', testCols.map(c => c.column_name).join(', ') || '(none)');
  await sequelize.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
