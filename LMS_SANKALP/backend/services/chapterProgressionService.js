const { Op } = require('sequelize');
const {
  CourseChapter,
  CourseTest,
  ChapterProgress,
  TestAttempt
} = require('../models');
const {
  getEffectiveDuration,
  getRequiredMinutes,
  isTimeRequirementMet,
  getCompletionPercent,
  isAssignmentChapter,
  getEffectiveMaxAttempts,
  QUIZ_WEIGHT,
  FINAL_EXAM_WEIGHT
} = require('../utils/chapterConstants');

const isChapterFullyComplete = (progress, quizRequired) => {
  if (!progress) return false;
  return progress.is_completed;
};

const updateChapterQuizAfterAttempt = async ({ studentId, enrollment, test, score }) => {
  const linkedChapter = await CourseChapter.findOne({
    where: { test_id: test.id, course_id: test.course_id }
  });

  if (!linkedChapter || !enrollment) {
    return null;
  }

  const [chapterProgress] = await ChapterProgress.findOrCreate({
    where: {
      enrollment_id: enrollment.id,
      chapter_id: linkedChapter.id
    },
    defaults: {
      enrollment_id: enrollment.id,
      chapter_id: linkedChapter.id,
      content_completed: true
    }
  });

  chapterProgress.content_completed = true;

  const completedAttempts = await TestAttempt.findAll({
    where: {
      student_id: studentId,
      test_id: test.id,
      status: 'completed'
    }
  });

  const attemptScores = completedAttempts.map((attempt) => parseFloat(attempt.score) || 0);
  const attemptsUsed = attemptScores.length;
  const maxAttempts = getEffectiveMaxAttempts(test);
  const numericScore = parseFloat(score) || 0;
  const isPassed = numericScore >= test.passing_score;

  let attemptsExhausted = false;
  let finalAverageScore = null;

  if (isPassed) {
    chapterProgress.quiz_passed = true;
    chapterProgress.quiz_best_score = Math.max(
      parseFloat(chapterProgress.quiz_best_score) || 0,
      numericScore,
      ...attemptScores
    );
    chapterProgress.quiz_passed_at = chapterProgress.quiz_passed_at || new Date();
    chapterProgress.is_completed = true;
    chapterProgress.completed_at = chapterProgress.completed_at || new Date();
  } else if (maxAttempts && attemptsUsed >= maxAttempts) {
    attemptsExhausted = true;
    finalAverageScore = attemptsUsed > 0
      ? Math.round((attemptScores.reduce((sum, value) => sum + value, 0) / attemptsUsed) * 100) / 100
      : numericScore;
    chapterProgress.quiz_best_score = finalAverageScore;
    chapterProgress.quiz_passed = finalAverageScore >= test.passing_score;
    if (chapterProgress.quiz_passed) {
      chapterProgress.quiz_passed_at = chapterProgress.quiz_passed_at || new Date();
    }
    chapterProgress.is_completed = true;
    chapterProgress.completed_at = chapterProgress.completed_at || new Date();
  } else {
    chapterProgress.quiz_best_score = Math.max(
      parseFloat(chapterProgress.quiz_best_score) || 0,
      numericScore,
      ...attemptScores
    );
  }

  chapterProgress.quiz_attempts = attemptsUsed;
  await chapterProgress.save();

  if (chapterProgress.is_completed) {
    const totalChapters = await CourseChapter.count({
      where: { course_id: test.course_id, is_published: true }
    });
    const completedChapters = await ChapterProgress.count({
      where: { enrollment_id: enrollment.id, is_completed: true }
    });
    const newProgress = totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : enrollment.progress;
    await enrollment.updateProgress(newProgress);
  }

  return {
    attempts_used: attemptsUsed,
    attempts_remaining: maxAttempts != null ? Math.max(0, maxAttempts - attemptsUsed) : null,
    max_attempts: maxAttempts,
    can_retry: !isPassed && (maxAttempts == null || attemptsUsed < maxAttempts),
    attempts_exhausted: attemptsExhausted,
    final_average_score: finalAverageScore,
    quiz_best_score: parseFloat(chapterProgress.quiz_best_score),
    quiz_passed: chapterProgress.quiz_passed,
    is_completed: chapterProgress.is_completed
  };
};

const buildChapterProgression = async (enrollment, courseChapters, isCourseCompletedOverride = false) => {
  const chapterProgresses = await ChapterProgress.findAll({
    where: { enrollment_id: enrollment.id }
  });

  const progressMap = {};
  chapterProgresses.forEach((progress) => {
    progressMap[progress.chapter_id] = progress;
  });

  const regularChapters = courseChapters.filter((chapter) => !isAssignmentChapter(chapter.title));
  const assignmentChapters = courseChapters.filter((chapter) => isAssignmentChapter(chapter.title));
  const isCourseCompleted = isCourseCompletedOverride
    || ['content_completed', 'completed', 'certified'].includes(enrollment.status);

  const mapChapter = (chapter, index, { isAssignment = false } = {}) => {
    const progress = progressMap[chapter.id];
    const quizRequired = !!chapter.test_id;
    const durationMinutes = getEffectiveDuration(chapter.duration_minutes);
    const timeSpent = progress?.time_spent || 0;
    const contentCompleted = progress?.content_completed || progress?.is_completed || isCourseCompleted;
    const quizPassed = progress?.quiz_passed || isCourseCompleted;
    const timeMet = isTimeRequirementMet(timeSpent, chapter.duration_minutes)
      || progress?.video_watched
      || progress?.pdf_viewed
      || contentCompleted
      || isCourseCompleted;
    const quizUnlocked = contentCompleted && timeMet;
    const fullyComplete = isCourseCompleted || isChapterFullyComplete(progress, quizRequired)
      || (!quizRequired && progress?.is_completed);

    let isAccessible = isCourseCompleted;
    if (!isAccessible && !isAssignment) {
      if (index === 0) {
        isAccessible = true;
      } else {
        const prevChapter = regularChapters[index - 1];
        const prevProgress = progressMap[prevChapter.id];
        const prevQuizRequired = !!prevChapter.test_id;
        isAccessible = isChapterFullyComplete(prevProgress, prevQuizRequired)
          || (prevProgress?.is_completed && !prevQuizRequired);
      }
    }

    if (!isAccessible && isAssignment) {
      const allRegularDone = regularChapters.every((ch) => {
        const p = progressMap[ch.id];
        return isChapterFullyComplete(p, !!ch.test_id) || (p?.is_completed && !ch.test_id);
      });
      isAccessible = allRegularDone || isCourseCompleted;
    }

    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      chapter_order: chapter.chapter_order,
      test_id: chapter.test_id || null,
      duration_minutes: durationMinutes,
      is_completed: fullyComplete || isCourseCompleted,
      content_completed: contentCompleted || isCourseCompleted,
      is_accessible: isAccessible,
      completed_at: progress?.completed_at || (isCourseCompleted ? enrollment.completed_at : null),
      time_spent: timeSpent,
      time_required: getRequiredMinutes(chapter.duration_minutes),
      completion_percent: getCompletionPercent(timeSpent, chapter.duration_minutes),
      can_proceed: timeMet || fullyComplete || isCourseCompleted,
      video_watched: progress?.video_watched || false,
      pdf_viewed: progress?.pdf_viewed || false,
      quiz_required: quizRequired,
      quiz_passed: quizPassed,
      quiz_attempts: progress?.quiz_attempts || 0,
      quiz_best_score: progress?.quiz_best_score ? parseFloat(progress.quiz_best_score) : null,
      quiz_unlocked: quizUnlocked || isCourseCompleted,
      is_assignment: isAssignment
    };
  };

  const regularChaptersWithProgress = regularChapters.map((chapter, index) =>
    mapChapter(chapter, index, { isAssignment: false })
  );

  const allRegularComplete = regularChaptersWithProgress.every((ch) => ch.is_completed);
  const assignmentChaptersWithProgress = assignmentChapters.map((chapter, index) =>
    mapChapter(chapter, index, { isAssignment: true })
  );

  const visibleChapters = [...regularChaptersWithProgress];
  if (allRegularComplete || isCourseCompleted) {
    visibleChapters.push(...assignmentChaptersWithProgress);
  }

  const chaptersWithProgress = visibleChapters.sort((a, b) => a.chapter_order - b.chapter_order);

  let resumeChapterId = null;
  const resumeCandidate = chaptersWithProgress.find(
    (ch) => ch.is_accessible && !ch.is_completed
  );
  if (resumeCandidate) {
    resumeChapterId = resumeCandidate.id;
  } else if (chaptersWithProgress.length > 0) {
    resumeChapterId = chaptersWithProgress[chaptersWithProgress.length - 1].id;
  }

  const completedChapters = chaptersWithProgress.filter((ch) => ch.is_completed).length;
  const totalChapters = chaptersWithProgress.length;

  return {
    chapters: chaptersWithProgress,
    stats: {
      completedChapters,
      totalChapters,
      isCourseCompleted: isCourseCompleted || (completedChapters === totalChapters && totalChapters > 0),
      progressPercentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      allRegularChaptersComplete: allRegularComplete
    },
    resumeChapterId
  };
};

const computeEnrollmentGrades = async (enrollmentId, studentId, courseId) => {
  const chapterQuizzes = await CourseTest.findAll({
    where: { course_id: courseId, test_type: 'chapter_quiz', is_active: true }
  });

  const finalExams = await CourseTest.findAll({
    where: { course_id: courseId, test_type: 'final_exam', is_active: true }
  });

  const chapterQuizResults = [];
  for (const test of chapterQuizzes) {
    const attempts = await TestAttempt.findAll({
      where: { test_id: test.id, student_id: studentId, status: 'completed' },
      order: [['score', 'DESC']]
    });
    const bestAttempt = attempts[0];
    chapterQuizResults.push({
      testId: test.id,
      chapterId: test.chapter_id,
      title: test.title,
      bestScore: bestAttempt ? parseFloat(bestAttempt.score) : null,
      passed: bestAttempt ? parseFloat(bestAttempt.score) >= test.passing_score : false,
      attempts: attempts.length
    });
  }

  let finalExamResult = null;
  if (finalExams.length > 0) {
    const finalTest = finalExams[0];
    const attempts = await TestAttempt.findAll({
      where: { test_id: finalTest.id, student_id: studentId, status: 'completed' },
      order: [['score', 'DESC']]
    });
    const bestAttempt = attempts[0];
    finalExamResult = {
      testId: finalTest.id,
      title: finalTest.title,
      bestScore: bestAttempt ? parseFloat(bestAttempt.score) : null,
      passed: bestAttempt ? parseFloat(bestAttempt.score) >= finalTest.passing_score : false,
      attempts: attempts.length
    };
  }

  const quizScores = chapterQuizResults
    .map((q) => q.bestScore)
    .filter((score) => score !== null && !Number.isNaN(score));
  const chapterQuizAvg = quizScores.length
    ? quizScores.reduce((sum, s) => sum + s, 0) / quizScores.length
    : null;

  let totalMarks = null;
  if (chapterQuizAvg !== null && finalExamResult?.bestScore !== null) {
    totalMarks = Math.round((chapterQuizAvg * QUIZ_WEIGHT + finalExamResult.bestScore * FINAL_EXAM_WEIGHT) * 100) / 100;
  } else if (finalExamResult?.bestScore !== null) {
    totalMarks = finalExamResult.bestScore;
  } else if (chapterQuizAvg !== null) {
    totalMarks = Math.round(chapterQuizAvg * 100) / 100;
  }

  return {
    chapterQuizzes: chapterQuizResults,
    finalExam: finalExamResult,
    totalMarks,
    breakdown: {
      quizWeight: QUIZ_WEIGHT * 100,
      finalWeight: FINAL_EXAM_WEIGHT * 100,
      chapterQuizAvg: chapterQuizAvg !== null ? Math.round(chapterQuizAvg * 100) / 100 : null
    }
  };
};

const allChapterQuizzesPassed = async (enrollmentId, courseId) => {
  const quizChapters = await CourseChapter.findAll({
    where: { course_id: courseId, test_id: { [Op.ne]: null } },
    attributes: ['id', 'test_id']
  });

  if (quizChapters.length === 0) return true;

  for (const chapter of quizChapters) {
    const progress = await ChapterProgress.findOne({
      where: { enrollment_id: enrollmentId, chapter_id: chapter.id }
    });
    if (!progress?.is_completed) return false;
  }
  return true;
};

module.exports = {
  buildChapterProgression,
  computeEnrollmentGrades,
  allChapterQuizzesPassed,
  isChapterFullyComplete,
  updateChapterQuizAfterAttempt,
  isTimeRequirementMet,
  getRequiredMinutes,
  getEffectiveDuration
};
