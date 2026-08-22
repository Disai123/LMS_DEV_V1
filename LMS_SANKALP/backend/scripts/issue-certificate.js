/**
 * Issue a missing certificate for a student who passed a test but has no cert record.
 * Usage: node scripts/issue-certificate.js [studentId] [attemptId]
 */
require('dotenv').config();
const { fixCertificatesTable } = require('./fix-certificates-table');
const { User, Course, CourseTest, TestAttempt, Certificate, Achievement, Enrollment } = require('../models');

async function issueCertificate(studentId, attemptId) {
  await fixCertificatesTable();

  const user = await User.findByPk(studentId);
  if (!user) throw new Error(`User ${studentId} not found`);

  const attempt = await TestAttempt.findByPk(attemptId);
  if (!attempt || attempt.student_id !== studentId) {
    throw new Error(`Attempt ${attemptId} not found for student ${studentId}`);
  }
  if (attempt.status !== 'completed') {
    throw new Error(`Attempt ${attemptId} is not completed (status: ${attempt.status})`);
  }

  const test = await CourseTest.findByPk(attempt.test_id);
  const course = await Course.findByPk(test.course_id);
  const score = Math.round(Number(attempt.score));
  const passed = score >= test.passing_score;

  if (!passed) {
    throw new Error(`Attempt score ${score}% is below passing score ${test.passing_score}%`);
  }

  const existing = await Certificate.findOne({
    where: { student_id: studentId, course_id: course.id }
  });
  if (existing) {
    return { certificate: existing, created: false, user, course, test, score };
  }

  const certificateNumber = await Certificate.generateCertificateNumber(studentId, course.id);
  const verificationCode = Certificate.generateVerificationCode();

  const certificate = await Certificate.create({
    student_id: studentId,
    course_id: course.id,
    test_attempt_id: attemptId,
    certificate_number: certificateNumber,
    verification_code: verificationCode,
    issued_date: attempt.completed_at || new Date(),
    is_valid: true,
    certificate_type: 'course',
    metadata: {
      courseName: course.title,
      studentName: user.name,
      score,
      passingScore: test.passing_score,
      testTitle: test.title
    }
  });

  const enrollment = await Enrollment.findOne({
    where: { student_id: studentId, course_id: course.id }
  });
  if (enrollment) {
    await enrollment.certify();
    if (enrollment.progress < 100) {
      await enrollment.update({ progress: 100 });
    }
  }

  const existingAchievement = await Achievement.findOne({
    where: {
      student_id: studentId,
      course_id: course.id,
      achievement_type: 'course_completion'
    }
  });

  if (!existingAchievement) {
    await Achievement.create({
      student_id: studentId,
      course_id: course.id,
      achievement_type: 'course_completion',
      title: `${course.title} Certificate`,
      description: `Certificate of completion for ${course.title}`,
      icon: '🎓',
      certificate_data: {
        studentName: user.name,
        courseTitle: course.title,
        completionDate: (attempt.completed_at || new Date()).toISOString(),
        certificateId: certificateNumber,
        issuedBy: 'SANKALP Learning Platform',
        score,
        passingScore: test.passing_score,
        testTitle: test.title
      },
      points_earned: 100,
      is_unlocked: true,
      unlocked_at: attempt.completed_at || new Date(),
      metadata: {
        courseTitle: course.title,
        certificateNumber,
        score
      }
    });
  }

  return { certificate, created: true, user, course, test, score };
}

if (require.main === module) {
  const studentId = parseInt(process.argv[2] || '101', 10);
  const attemptId = parseInt(process.argv[3] || '85', 10);

  issueCertificate(studentId, attemptId)
    .then(({ certificate, created, user, course, score }) => {
      console.log(created ? 'Certificate created.' : 'Certificate already existed.');
      console.log('Student:', user.name, `(${user.email})`);
      console.log('Course:', course.title);
      console.log('Score:', `${score}%`);
      console.log('Certificate #:', certificate.certificate_number);
      console.log('Verification:', certificate.verification_code);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed:', err.message);
      process.exit(1);
    });
}

module.exports = { issueCertificate };
