/**
 * Pull course-flow data from GNANAMAI PostgreSQL into LMS_SANKALP SQLite.
 *
 * Usage (from backend/):
 *   npm run db:init
 *   npm run db:pull
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const { Sequelize } = require('sequelize');

const sourceEnvPath = process.env.SOURCE_ENV_PATH
  || path.join(__dirname, '..', '..', '..', 'LMS_Project', 'backend', '.env');
require('dotenv').config({ path: sourceEnvPath, override: false });

const { sequelize: targetSequelize } = require('../models');

const sourceSequelize = new Sequelize(
  process.env.SOURCE_DB_DATABASE || process.env.DB_DATABASE || process.env.DB_NAME || 'lms_db',
  process.env.SOURCE_DB_USER || process.env.DB_USER || 'postgres',
  process.env.SOURCE_DB_PASSWORD || process.env.DB_PASSWORD || 'password',
  {
    host: process.env.SOURCE_DB_HOST || process.env.DB_HOST || 'localhost',
    port: process.env.SOURCE_DB_PORT || process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.SOURCE_DB_SSL === 'true'
        ? { require: true, rejectUnauthorized: false }
        : false
    }
  }
);

const COURSE_NOTIFICATION_TYPES = [
  'welcome',
  'enrollment',
  'chapter_completed',
  'course_completed',
  'test_passed',
  'test_failed',
  'certificate',
  'progress_milestone'
];

const TABLE_ORDER = [
  'users',
  'courses',
  'course_chapters',
  'course_tests',
  'test_questions',
  'test_question_options',
  'file_uploads',
  'enrollments',
  'chapter_progress',
  'test_attempts',
  'test_answers',
  'certificates',
  'notifications',
  'activity_logs',
  'achievements'
];

async function fetchAll(table, whereSql = '', replacements = {}) {
  const [rows] = await sourceSequelize.query(
    `SELECT * FROM ${table} ${whereSql}`,
    { replacements }
  );
  return rows;
}

async function fetchWhereIn(table, column, ids) {
  if (!ids.length) return [];
  const placeholders = ids.map((_, i) => `:id${i}`).join(', ');
  const replacements = Object.fromEntries(ids.map((id, i) => [`id${i}`, id]));
  return fetchAll(table, `WHERE ${column} IN (${placeholders})`, replacements);
}

async function getRelevantUserIds() {
  const [rows] = await sourceSequelize.query(`
    SELECT DISTINCT u.id
    FROM users u
    WHERE u.role = 'admin'
       OR u.id IN (SELECT student_id FROM enrollments)
       OR u.id IN (SELECT student_id FROM test_attempts)
       OR u.id IN (SELECT student_id FROM certificates WHERE certificate_type = 'course')
       OR u.id IN (
         SELECT user_id FROM notifications
         WHERE type IN (:types)
       )
  `, {
    replacements: { types: COURSE_NOTIFICATION_TYPES }
  });
  return rows.map((r) => r.id);
}

function normalizeRow(row) {
  const copy = { ...row };
  // Sequelize JSON columns accept arrays/objects from PostgreSQL as-is
  return copy;
}

async function bulkInsert(model, rows) {
  if (!rows.length) {
    console.log(`  - ${model.tableName}: 0 rows`);
    return;
  }

  const normalized = rows.map(normalizeRow);
  await model.bulkCreate(normalized, {
    ignoreDuplicates: true,
    validate: false
  });
  console.log(`  ✓ ${model.tableName}: ${rows.length} rows`);
}

async function pullData() {
  console.log('=== LMS_SANKALP data pull from GNANAMAI PostgreSQL ===\n');

  await sourceSequelize.authenticate();
  console.log('Source PostgreSQL connected.');

  await targetSequelize.authenticate();
  console.log('Target SQLite connected.\n');

  await targetSequelize.sync({ force: true });
  console.log('Target schema recreated.\n');

  const userIds = await getRelevantUserIds();
  console.log(`Relevant users: ${userIds.length}`);

  const users = userIds.length
    ? await fetchWhereIn('users', 'id', userIds)
    : await fetchAll('users', "WHERE role IN ('admin', 'student')");

  const userIdSet = new Set(users.map((u) => u.id));
  const instructorIds = new Set(users.filter((u) => u.role === 'admin').map((u) => u.id));

  const courses = await fetchAll('courses');
  const filteredCourses = courses.filter(
    (c) => instructorIds.has(c.instructor_id) || userIdSet.has(c.instructor_id)
  );
  const courseIds = new Set(filteredCourses.map((c) => c.id));

  const chapters = (await fetchAll('course_chapters')).filter((c) => courseIds.has(c.course_id));
  const chapterIds = new Set(chapters.map((c) => c.id));

  const tests = (await fetchAll('course_tests')).filter((t) => courseIds.has(t.course_id));
  const testIds = new Set(tests.map((t) => t.id));

  const questions = (await fetchAll('test_questions')).filter((q) => testIds.has(q.test_id));
  const questionIds = new Set(questions.map((q) => q.id));

  const options = (await fetchAll('test_question_options')).filter((o) => questionIds.has(o.question_id));

  const files = (await fetchAll('file_uploads')).filter((f) => courseIds.has(f.course_id));

  const enrollments = (await fetchAll('enrollments')).filter(
    (e) => courseIds.has(e.course_id) && userIdSet.has(e.student_id)
  );
  const enrollmentIds = new Set(enrollments.map((e) => e.id));

  const chapterProgress = (await fetchAll('chapter_progress')).filter(
    (p) => enrollmentIds.has(p.enrollment_id) && chapterIds.has(p.chapter_id)
  );

  const testAttempts = (await fetchAll('test_attempts')).filter(
    (a) => testIds.has(a.test_id) && userIdSet.has(a.student_id)
  );
  const attemptIds = new Set(testAttempts.map((a) => a.id));

  const testAnswers = (await fetchAll('test_answers')).filter((a) => attemptIds.has(a.attempt_id));

  const certificates = (await fetchAll('certificates')).filter(
    (c) => c.certificate_type === 'course' && userIdSet.has(c.student_id)
  );

  const notifications = (await fetchWhereIn(
    'notifications',
    'type',
    COURSE_NOTIFICATION_TYPES
  )).filter((n) => userIdSet.has(n.user_id));

  const activityLogs = (await fetchAll('activity_logs')).filter(
    (a) => userIdSet.has(a.student_id) && (!a.course_id || courseIds.has(a.course_id))
  );

  const achievements = (await fetchAll('achievements')).filter(
    (a) => userIdSet.has(a.student_id) && (!a.course_id || courseIds.has(a.course_id))
  );

  const {
    User, Course, CourseChapter, CourseTest, TestQuestion, TestQuestionOption,
    FileUpload, Enrollment, ChapterProgress, TestAttempt, TestAnswer,
    Certificate, Notification, ActivityLog, Achievement
  } = require('../models');

  const payload = {
    users: User,
    courses: Course,
    course_chapters: CourseChapter,
    course_tests: CourseTest,
    test_questions: TestQuestion,
    test_question_options: TestQuestionOption,
    file_uploads: FileUpload,
    enrollments: Enrollment,
    chapter_progress: ChapterProgress,
    test_attempts: TestAttempt,
    test_answers: TestAnswer,
    certificates: Certificate,
    notifications: Notification,
    activity_logs: ActivityLog,
    achievements: Achievement
  };

  const data = {
    users,
    courses: filteredCourses,
    course_chapters: chapters,
    course_tests: tests,
    test_questions: questions,
    test_question_options: options,
    file_uploads: files,
    enrollments,
    chapter_progress: chapterProgress,
    test_attempts: testAttempts,
    test_answers: testAnswers,
    certificates,
    notifications,
    activity_logs: activityLogs,
    achievements
  };

  console.log('\nInserting data...\n');
  for (const table of TABLE_ORDER) {
    await bulkInsert(payload[table], data[table]);
  }

  console.log('\n=== Pull complete ===');
  await sourceSequelize.close();
  await targetSequelize.close();
}

pullData().catch(async (err) => {
  console.error('Pull failed:', err);
  try {
    await sourceSequelize.close();
    await targetSequelize.close();
  } catch (_) {}
  process.exit(1);
});
