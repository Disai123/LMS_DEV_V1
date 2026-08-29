const { User, Course, Enrollment, CourseChapter } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const chapterProgressionService = require('./chapterProgressionService');

const isContentDone = (status) => ['content_completed', 'completed', 'certified'].includes(status);

const mapChapterRow = (chapter) => ({
  chapterId: chapter.id,
  title: chapter.title,
  order: chapter.chapter_order,
  isCompleted: chapter.is_completed,
  quizRequired: chapter.quiz_required,
  quizBestScore: chapter.quiz_best_score,
  quizAttempts: chapter.quiz_attempts,
  quizPassed: chapter.quiz_passed,
  timeSpent: chapter.time_spent
});

const buildCoursePerformance = async (enrollment, studentId, { includeChapters = true } = {}) => {
  const course = enrollment.course;
  const courseId = enrollment.course_id;

  const [grades, progression] = await Promise.all([
    chapterProgressionService.computeEnrollmentGrades(enrollment.id, studentId, courseId),
    includeChapters
      ? (async () => {
          const chapters = await CourseChapter.findAll({
            where: { course_id: courseId },
            attributes: ['id', 'title', 'chapter_order', 'description', 'test_id', 'duration_minutes'],
            order: [['chapter_order', 'ASC']]
          });
          return chapterProgressionService.buildChapterProgression(
            enrollment,
            chapters,
            isContentDone(enrollment.status)
          );
        })()
      : Promise.resolve(null)
  ]);

  return {
    enrollmentId: enrollment.id,
    courseId,
    courseTitle: course?.title || 'Course',
    courseCategory: course?.category || null,
    status: enrollment.status,
    progress: enrollment.progress,
    timeSpent: enrollment.time_spent || 0,
    enrolledAt: enrollment.enrolled_at,
    completedAt: enrollment.completed_at,
    lastAccessedAt: enrollment.last_accessed_at,
    grades,
    chapters: progression ? progression.chapters.map(mapChapterRow) : [],
    chapterStats: progression?.stats || null
  };
};

const getStudentPerformance = async (studentId) => {
  const user = await User.findByPk(studentId, {
    attributes: ['id', 'name', 'email', 'role']
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== 'student') {
    throw new AppError('Performance is only available for student accounts', 400);
  }

  const enrollments = await Enrollment.findAll({
    where: { student_id: studentId },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'category', 'difficulty']
      }
    ],
    order: [['enrolled_at', 'DESC']]
  });

  const courses = await Promise.all(
    enrollments.map((enrollment) => buildCoursePerformance(enrollment, studentId, { includeChapters: true }))
  );

  const totalMarksValues = courses
    .map((course) => course.grades?.totalMarks)
    .filter((value) => value !== null && value !== undefined && !Number.isNaN(value));

  const testsPassed = courses.reduce((count, course) => {
    const finalPassed = course.grades?.finalExam?.passed ? 1 : 0;
    const quizPassed = (course.grades?.chapterQuizzes || []).filter((quiz) => quiz.passed).length;
    return count + finalPassed + quizPassed;
  }, 0);

  return {
    student: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    summary: {
      totalEnrolled: enrollments.length,
      certified: enrollments.filter((e) => e.status === 'certified').length,
      contentCompleted: enrollments.filter((e) => isContentDone(e.status)).length,
      avgProgress: enrollments.length
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0,
      totalTimeSpentMinutes: enrollments.reduce((sum, e) => sum + (e.time_spent || 0), 0),
      testsPassed,
      avgTotalMarks: totalMarksValues.length
        ? Math.round((totalMarksValues.reduce((sum, value) => sum + value, 0) / totalMarksValues.length) * 100) / 100
        : null
    },
    courses
  };
};

const getCoursePerformance = async (courseId) => {
  const course = await Course.findByPk(courseId, {
    attributes: ['id', 'title', 'category']
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const enrollments = await Enrollment.findAll({
    where: { course_id: courseId },
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'avatar', 'is_active']
      },
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'category']
      }
    ],
    order: [['enrolled_at', 'DESC']]
  });

  const enrollmentsWithPerformance = await Promise.all(
    enrollments.map(async (enrollment) => {
      const grades = await chapterProgressionService.computeEnrollmentGrades(
        enrollment.id,
        enrollment.student_id,
        courseId
      );

      return {
        enrollmentId: enrollment.id,
        student: enrollment.student
          ? {
              id: enrollment.student.id,
              name: enrollment.student.name,
              email: enrollment.student.email,
              avatar: enrollment.student.avatar,
              isActive: enrollment.student.is_active
            }
          : null,
        enrolledAt: enrollment.enrolled_at,
        progress: enrollment.progress,
        status: enrollment.status,
        completedAt: enrollment.completed_at,
        lastAccessedAt: enrollment.last_accessed_at,
        timeSpent: enrollment.time_spent || 0,
        quizAvg: grades.breakdown?.chapterQuizAvg ?? null,
        finalExamScore: grades.finalExam?.bestScore ?? null,
        finalExamPassed: grades.finalExam?.passed ?? false,
        totalMarks: grades.totalMarks,
        testsPassedCount: (grades.chapterQuizzes || []).filter((quiz) => quiz.passed).length
          + (grades.finalExam?.passed ? 1 : 0)
      };
    })
  );

  return {
    course: {
      id: course.id,
      title: course.title,
      category: course.category
    },
    enrollments: enrollmentsWithPerformance
  };
};

module.exports = {
  getStudentPerformance,
  getCoursePerformance
};
