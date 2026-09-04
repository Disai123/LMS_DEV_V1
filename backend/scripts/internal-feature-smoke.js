require('dotenv').config();
const { sequelize, Notification, User, Enrollment, Course, CourseTest } = require('../models');
const notificationService = require('../services/notificationService');

async function main() {
  const report = [];

  const [[{ n }]] = await sequelize.query('SELECT COUNT(*)::int AS n FROM notifications');
  report.push({ check: 'notifications_rows', ok: true, detail: n });

  const types = await sequelize.query(
    'SELECT type, COUNT(*)::int AS c FROM notifications GROUP BY type ORDER BY c DESC',
    { type: sequelize.QueryTypes.SELECT }
  );
  report.push({ check: 'notification_type_breakdown', ok: true, detail: types });

  const student = await User.findOne({ where: { role: 'student' } });
  if (!student) {
    report.push({ check: 'student_exists', ok: false, detail: 'no student user' });
  } else {
    report.push({ check: 'student_exists', ok: true, detail: `id=${student.id}` });

    const bad = await notificationService.notifyCertificate(student, { id: 1, title: 'BugRepro' }, 'CERT-TEST');
    report.push({
      check: 'notifyCertificate_with_user_object',
      ok: bad === null,
      detail: bad === null
        ? 'BROKEN call pattern: User object instead of userId (matches testTakingController.js)'
        : `UNEXPECTED success id=${bad.id}`
    });

    const good = await notificationService.notifyCertificate(student.id, { id: 1, title: 'BugRepro' }, 'CERT-TEST');
    report.push({
      check: 'notifyCertificate_with_userId',
      ok: !!good,
      detail: good ? `works id=${good.id}` : 'failed with correct userId'
    });

    const course = (await Course.findOne({ where: { is_published: true } })) || (await Course.findOne());
    if (course) {
      const enroll = await notificationService.notifyEnrollment(student.id, course, false);
      report.push({ check: 'notifyEnrollment', ok: !!enroll, detail: enroll ? `id=${enroll.id}` : 'failed' });

      const chapter = { id: 999, title: 'Internal Test Chapter' };
      const ch = await notificationService.notifyChapterCompleted(student.id, course, chapter, 25);
      report.push({ check: 'notifyChapterCompleted', ok: !!ch, detail: ch ? `id=${ch.id}` : 'failed' });

      const enrollment = (await Enrollment.findOne({ where: { student_id: student.id } })) || { id: -1 };
      await notificationService.notifyProgressMilestones(student.id, enrollment, course, 10, 30);
      report.push({ check: 'notifyProgressMilestones', ok: true, detail: 'ran' });

      const fail = await notificationService.notifyTestResult(
        student.id,
        { title: 'Internal Test', passing_score: 70 },
        course,
        { passed: false, score: 40 }
      );
      report.push({ check: 'notifyTestFailed', ok: !!fail, detail: fail ? `id=${fail.id}` : 'failed' });

      const pass = await notificationService.notifyTestResult(
        student.id,
        { title: 'Internal Test', passing_score: 70 },
        course,
        { passed: true, score: 85 }
      );
      report.push({ check: 'notifyTestPassed', ok: !!pass, detail: pass ? `id=${pass.id}` : 'failed' });
    } else {
      report.push({ check: 'course_exists', ok: false, detail: 'no course' });
    }

    const fields = ['bio', 'phone', 'student_id', 'college_name', 'notification_preferences'];
    const missing = fields.filter((f) => !(f in student.dataValues));
    report.push({
      check: 'user_profile_fields_on_model',
      ok: missing.length === 0,
      detail: missing.length ? `missing ${missing.join(',')}` : 'all present'
    });
  }

  const activeTests = await CourseTest.count({ where: { is_active: true } });
  report.push({ check: 'active_course_tests', ok: activeTests > 0, detail: `count=${activeTests}` });

  const statusCounts = await sequelize.query(
    'SELECT status, COUNT(*)::int AS c FROM enrollments GROUP BY status ORDER BY c DESC',
    { type: sequelize.QueryTypes.SELECT }
  );
  report.push({ check: 'enrollment_status_distribution', ok: true, detail: statusCounts });

  report.push({
    check: 'email_env_configured',
    ok: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    detail: process.env.EMAIL_USER
      ? `EMAIL_USER set (${process.env.EMAIL_SERVICE || 'gmail'})`
      : 'EMAIL_USER/PASSWORD missing — emails will skip'
  });

  // Validate routes exist by requiring controllers
  try {
    require('../controllers/authController');
    require('../controllers/userController');
    require('../controllers/testTakingController');
    require('../controllers/enrollmentController');
    report.push({ check: 'controllers_load', ok: true, detail: 'auth/user/test/enrollment load' });
  } catch (e) {
    report.push({ check: 'controllers_load', ok: false, detail: e.message });
  }

  console.log(JSON.stringify(report, null, 2));
  const failed = report.filter((r) => r.ok === false);
  console.log('\nSUMMARY:', failed.length ? `${failed.length} FAIL` : 'ALL CHECKS PASSED');
  if (failed.length) failed.forEach((f) => console.log(' -', f.check, ':', f.detail));

  await sequelize.close();
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
