/**
 * Reset SQLite DB to Python-only demo: one course, admin + Sandhya.
 * Usage: npm run db:reset-demo
 */
require('dotenv').config();
const { sequelize } = require('../models');

const PYTHON_COURSE_ID = parseInt(process.env.DEMO_PYTHON_COURSE_ID || '3', 10);
const ADMIN_EMAIL = (process.env.DEMO_ADMIN_EMAIL || 'admin@aishani.com').toLowerCase();
const STUDENT_EMAIL = (process.env.DEMO_STUDENT_EMAIL || 'sandhya@gmail.com').toLowerCase();

async function resetPythonDemo() {
  await sequelize.authenticate();
  console.log('Connected to SQLite.');

  const [[adminRow]] = await sequelize.query(
    'SELECT id FROM users WHERE LOWER(email) = :email LIMIT 1',
    { replacements: { email: ADMIN_EMAIL } }
  );
  const [[studentRow]] = await sequelize.query(
    'SELECT id FROM users WHERE LOWER(email) = :email LIMIT 1',
    { replacements: { email: STUDENT_EMAIL } }
  );

  if (!adminRow) {
    throw new Error(`Admin user not found: ${ADMIN_EMAIL}. Create admin first (login admin/admin123 or db:create-admin).`);
  }
  if (!studentRow) {
    throw new Error(`Sample student not found: ${STUDENT_EMAIL}. Register or create this user first.`);
  }

  const [[pythonCourse]] = await sequelize.query(
    'SELECT id, title FROM courses WHERE id = :id LIMIT 1',
    { replacements: { id: PYTHON_COURSE_ID } }
  );
  if (!pythonCourse) {
    throw new Error(`Python course id ${PYTHON_COURSE_ID} not found. Run db:pull or create the course first.`);
  }

  const adminId = adminRow.id;
  const studentId = studentRow.id;
  const keepUserIds = [adminId, studentId];

  await sequelize.transaction(async (t) => {
    const q = (sql, replacements = {}) => sequelize.query(sql, { replacements, transaction: t });

    const courseIdsToDelete = (
      await sequelize.query('SELECT id FROM courses WHERE id != :id', {
        replacements: { id: PYTHON_COURSE_ID },
        transaction: t
      })
    )[0].map((r) => r.id);

    const userIdsToDelete = (
      await sequelize.query(
        `SELECT id FROM users WHERE id NOT IN (${keepUserIds.join(',')})`,
        { transaction: t }
      )
    )[0].map((r) => r.id);

    const deleteByCourseIds = async (table, column = 'course_id') => {
      if (courseIdsToDelete.length === 0) return;
      await q(
        `DELETE FROM ${table} WHERE ${column} IN (${courseIdsToDelete.join(',')})`
      );
    };

    const deleteByUserIds = async (table, column = 'student_id') => {
      if (userIdsToDelete.length === 0) return;
      await q(`DELETE FROM ${table} WHERE ${column} IN (${userIdsToDelete.join(',')})`);
    };

    // Remove data for deleted courses
    if (courseIdsToDelete.length > 0) {
      const testIds = (
        await sequelize.query(
          `SELECT id FROM course_tests WHERE course_id IN (${courseIdsToDelete.join(',')})`,
          { transaction: t }
        )
      )[0].map((r) => r.id);

      if (testIds.length > 0) {
        const attemptIds = (
          await sequelize.query(
            `SELECT id FROM test_attempts WHERE test_id IN (${testIds.join(',')})`,
            { transaction: t }
          )
        )[0].map((r) => r.id);

        if (attemptIds.length > 0) {
          await q(`DELETE FROM test_answers WHERE attempt_id IN (${attemptIds.join(',')})`);
          await q(`DELETE FROM test_attempts WHERE id IN (${attemptIds.join(',')})`);
        }

        const questionIds = (
          await sequelize.query(
            `SELECT id FROM test_questions WHERE test_id IN (${testIds.join(',')})`,
            { transaction: t }
          )
        )[0].map((r) => r.id);

        if (questionIds.length > 0) {
          await q(`DELETE FROM test_question_options WHERE question_id IN (${questionIds.join(',')})`);
          await q(`DELETE FROM test_questions WHERE id IN (${questionIds.join(',')})`);
        }

        await q(`DELETE FROM course_tests WHERE id IN (${testIds.join(',')})`);
      }

      const chapterIds = (
        await sequelize.query(
          `SELECT id FROM course_chapters WHERE course_id IN (${courseIdsToDelete.join(',')})`,
          { transaction: t }
        )
      )[0].map((r) => r.id);

      if (chapterIds.length > 0) {
        await q(`DELETE FROM chapter_progress WHERE chapter_id IN (${chapterIds.join(',')})`);
        await q(`DELETE FROM course_chapters WHERE id IN (${chapterIds.join(',')})`);
      }

      await deleteByCourseIds('enrollments');
      await deleteByCourseIds('file_uploads');
      await deleteByCourseIds('certificates');
      await deleteByCourseIds('achievements');
      await deleteByCourseIds('activity_logs');
      await q(`DELETE FROM courses WHERE id IN (${courseIdsToDelete.join(',')})`);
    }

    // Trim Python course enrollments to Sandhya only
    await q(
      `DELETE FROM chapter_progress WHERE enrollment_id IN (
        SELECT id FROM enrollments WHERE course_id = :courseId AND student_id != :studentId
      )`,
      { courseId: PYTHON_COURSE_ID, studentId }
    );
    await q(
      'DELETE FROM enrollments WHERE course_id = :courseId AND student_id != :studentId',
      { courseId: PYTHON_COURSE_ID, studentId }
    );

    // Remove extra users and their orphaned rows
    if (userIdsToDelete.length > 0) {
      const extraAttemptIds = (
        await sequelize.query(
          `SELECT id FROM test_attempts WHERE student_id IN (${userIdsToDelete.join(',')})`,
          { transaction: t }
        )
      )[0].map((r) => r.id);

      if (extraAttemptIds.length > 0) {
        await q(`DELETE FROM test_answers WHERE attempt_id IN (${extraAttemptIds.join(',')})`);
      }

      await deleteByUserIds('test_attempts', 'student_id');
      await q(
        `DELETE FROM chapter_progress WHERE enrollment_id IN (
          SELECT id FROM enrollments WHERE student_id IN (${userIdsToDelete.join(',')})
        )`
      );
      await deleteByUserIds('enrollments', 'student_id');
      await deleteByUserIds('certificates', 'student_id');
      await deleteByUserIds('achievements', 'student_id');
      await deleteByUserIds('activity_logs', 'student_id');
      await deleteByUserIds('notifications', 'user_id');
      await q(`DELETE FROM users WHERE id IN (${userIdsToDelete.join(',')})`);
    }

    // Ensure Python course is published and free
    await q(
      `UPDATE courses SET is_published = 1, is_free = 1, required_plan = 'free', enrollment_count = (
        SELECT COUNT(*) FROM enrollments WHERE course_id = :courseId
      ) WHERE id = :courseId`,
      { courseId: PYTHON_COURSE_ID }
    );
  });

  const [[counts]] = await sequelize.query(`
    SELECT
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM enrollments) AS enrollments
  `);

  console.log('\nPython demo reset complete.');
  console.log(`Course kept: "${pythonCourse.title}" (id ${PYTHON_COURSE_ID})`);
  console.log(`Admin: ${ADMIN_EMAIL} (id ${adminId})`);
  console.log(`Student: ${STUDENT_EMAIL} (id ${studentId})`);
  console.log(`Counts — courses: ${counts.courses}, users: ${counts.users}, enrollments: ${counts.enrollments}`);
}

if (require.main === module) {
  resetPythonDemo()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Reset failed:', err.message);
      process.exit(1);
    });
}

module.exports = { resetPythonDemo };
