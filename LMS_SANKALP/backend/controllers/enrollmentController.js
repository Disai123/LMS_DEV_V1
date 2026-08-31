const { Enrollment, Course, User, CourseChapter, ChapterProgress, ActivityLog, Achievement, Certificate } = require('../models');
const logger = require('../utils/logger');
const notificationService = require('../services/notificationService');
const chapterProgressionService = require('../services/chapterProgressionService');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const { isTimeRequirementMet, isChapterFullyComplete } = require('../services/chapterProgressionService');

const isContentDone = (status) => ['content_completed', 'completed', 'certified'].includes(status);
const isCertified = (status) => status === 'certified';

/**
 * Get my enrollments
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'thumbnail', 'logo', 'category', 'difficulty', 'estimated_duration']
        }
      ],
      order: [['enrolled_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Enrollments retrieved successfully',
      data: {
        enrollments: enrollments
          .filter((enrollment) => enrollment.course)
          .map(enrollment => ({
            id: enrollment.id,
            status: enrollment.status,
            progress: enrollment.progress,
            enrolled_at: enrollment.enrolled_at,
            completed_at: enrollment.completed_at,
            last_accessed_at: enrollment.last_accessed_at,
            time_spent: enrollment.time_spent,
            course: enrollment.course.getPublicInfo()
          })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get my enrollments error:', error);
    next(error);
  }
};

/**
 * Get my progress overview
 */
const getMyProgress = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        }
      ]
    });

    const stats = {
      totalEnrolled: enrollments.length,
      completed: enrollments.filter(e => isCertified(e.status)).length,
      contentCompleted: enrollments.filter(e => isContentDone(e.status)).length,
      inProgress: enrollments.filter(e => e.status === 'in-progress').length,
      enrolled: enrollments.filter(e => e.status === 'enrolled').length,
      averageProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
        : 0,
      totalTimeSpent: enrollments.reduce((sum, e) => sum + (e.time_spent || 0), 0)
    };

    const categoryStats = {};
    enrollments.forEach(enrollment => {
      const category = enrollment.course.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          completed: 0,
          averageProgress: 0
        };
      }
      categoryStats[category].total++;
      if (isContentDone(enrollment.status)) {
        categoryStats[category].completed++;
      }
    });

    // Calculate average progress per category
    Object.keys(categoryStats).forEach(category => {
      const categoryEnrollments = enrollments.filter(e => e.course.category === category);
      categoryStats[category].averageProgress = categoryEnrollments.length > 0
        ? Math.round(categoryEnrollments.reduce((sum, e) => sum + e.progress, 0) / categoryEnrollments.length)
        : 0;
    });

    res.json({
      success: true,
      message: 'Progress retrieved successfully',
      data: {
        stats,
        categoryStats,
        recentEnrollments: enrollments
          .sort((a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at))
          .slice(0, 5)
          .map(enrollment => ({
            id: enrollment.id,
            course: enrollment.course.title,
            progress: enrollment.progress,
            status: enrollment.status,
            enrolled_at: enrollment.enrolled_at
          }))
      }
    });
  } catch (error) {
    logger.error('Get my progress error:', error);
    next(error);
  }
};

/**
 * Get my completed courses
 */
const getMyCompletedCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: {
        student_id: req.user.id,
        status: ['content_completed', 'completed', 'certified']
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'thumbnail', 'logo', 'category', 'difficulty']
        }
      ],
      order: [['completed_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Completed courses retrieved successfully',
      data: {
        enrollments: enrollments.map(enrollment => ({
          id: enrollment.id,
          progress: enrollment.progress,
          completed_at: enrollment.completed_at,
          time_spent: enrollment.time_spent,
          rating: enrollment.rating,
          review: enrollment.review,
          course: enrollment.course.getPublicInfo()
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get my completed courses error:', error);
    next(error);
  }
};

/**
 * Get my active courses
 */
const getMyActiveCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: {
        student_id: req.user.id,
        status: ['enrolled', 'in-progress']
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'thumbnail', 'logo', 'category', 'difficulty', 'estimated_duration']
        }
      ],
      order: [['last_accessed_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Active courses retrieved successfully',
      data: {
        enrollments: enrollments.map(enrollment => ({
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress,
          enrolled_at: enrollment.enrolled_at,
          last_accessed_at: enrollment.last_accessed_at,
          time_spent: enrollment.time_spent,
          course: enrollment.course.getPublicInfo()
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get my active courses error:', error);
    next(error);
  }
};

/**
 * Get my learning statistics
 */
const getMyStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category', 'difficulty'],
          include: [
            {
              model: CourseChapter,
              as: 'chapters',
              attributes: ['id']
            }
          ]
        }
      ]
    });

    // Calculate total time spent, estimating for completed courses with 0 time
    let totalTimeSpent = 0;
    for (const enrollment of enrollments) {
      let enrollmentTime = enrollment.time_spent || 0;

      // If completed course has no time_spent, estimate based on progress and chapters
      if (isContentDone(enrollment.status) && enrollmentTime === 0) {
        const totalChapters = enrollment.course?.chapters?.length || 0;
        if (totalChapters > 0) {
          // Estimate 12 minutes per chapter for completed courses
          enrollmentTime = totalChapters * 12;
        } else if (enrollment.progress > 0) {
          // Fallback: estimate based on progress (assuming average 10 chapters = 120 minutes)
          enrollmentTime = Math.round((enrollment.progress / 100) * 120);
        }
      } else if (enrollment.status === 'enrolled' && enrollment.progress > 0 && enrollmentTime === 0) {
        // Estimate time for in-progress courses based on progress
        const totalChapters = enrollment.course?.chapters?.length || 10; // Default to 10 if unknown
        const estimatedTotalTime = totalChapters * 12; // 12 minutes per chapter
        enrollmentTime = Math.round((enrollment.progress / 100) * estimatedTotalTime);
      }

      totalTimeSpent += enrollmentTime;
    }

    const stats = {
      totalCourses: enrollments.length,
      completedCourses: enrollments.filter(e => isCertified(e.status)).length,
      // In progress = enrolled courses with progress > 0 but not completed
      inProgressCourses: enrollments.filter(e => e.status === 'enrolled' && e.progress > 0 && e.progress < 100).length,
      enrolledCourses: enrollments.filter(e => e.status === 'enrolled' && e.progress === 0).length,
      totalTimeSpent: totalTimeSpent,
      averageProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
        : 0,
      completionRate: enrollments.length > 0
        ? Math.round((enrollments.filter(e => isCertified(e.status)).length / enrollments.length) * 100)
        : 0
    };

    // Category breakdown
    const categoryBreakdown = {};
    enrollments.forEach(enrollment => {
      const category = enrollment.course.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          averageProgress: 0
        };
      }
      categoryBreakdown[category].total++;
      if (isContentDone(enrollment.status)) {
        categoryBreakdown[category].completed++;
      } else if (enrollment.status === 'enrolled' && enrollment.progress > 0 && enrollment.progress < 100) {
        categoryBreakdown[category].inProgress++;
      }
    });

    // Calculate average progress per category
    Object.keys(categoryBreakdown).forEach(category => {
      const categoryEnrollments = enrollments.filter(e => e.course.category === category);
      categoryBreakdown[category].averageProgress = categoryEnrollments.length > 0
        ? Math.round(categoryEnrollments.reduce((sum, e) => sum + e.progress, 0) / categoryEnrollments.length)
        : 0;
    });

    // Difficulty breakdown
    const difficultyBreakdown = {};
    enrollments.forEach(enrollment => {
      const difficulty = enrollment.course.difficulty;
      if (!difficultyBreakdown[difficulty]) {
        difficultyBreakdown[difficulty] = {
          total: 0,
          completed: 0,
          averageProgress: 0
        };
      }
      difficultyBreakdown[difficulty].total++;
      if (isContentDone(enrollment.status)) {
        difficultyBreakdown[difficulty].completed++;
      }
    });

    // Calculate average progress per difficulty
    Object.keys(difficultyBreakdown).forEach(difficulty => {
      const difficultyEnrollments = enrollments.filter(e => e.course.difficulty === difficulty);
      difficultyBreakdown[difficulty].averageProgress = difficultyEnrollments.length > 0
        ? Math.round(difficultyEnrollments.reduce((sum, e) => sum + e.progress, 0) / difficultyEnrollments.length)
        : 0;
    });

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        stats,
        categoryBreakdown,
        difficultyBreakdown
      }
    });
  } catch (error) {
    logger.error('Get my stats error:', error);
    next(error);
  }
};

/**
 * Update my progress
 */
const updateMyProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, time_spent } = req.body;

    const enrollment = await Enrollment.findOne({
      where: {
        id: id,
        student_id: req.user.id
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const previousProgress = enrollment.progress;

    if (progress !== undefined) {
      await enrollment.updateProgress(progress);
      await enrollment.reload();

      if (enrollment.course) {
        try {
          await notificationService.notifyProgressMilestones(
            req.user.id,
            enrollment,
            enrollment.course,
            previousProgress,
            enrollment.progress
          );
          if (previousProgress < 100 && enrollment.progress >= 100) {
            await notificationService.notifyCourseContentCompleted(req.user.id, enrollment.course, enrollment);
          }
        } catch (notifError) {
          console.error('Failed to send progress notifications:', notifError);
        }
      }
    }

    if (time_spent !== undefined) {
      await enrollment.addTimeSpent(time_spent);
    }

    logger.info(`User ${req.user.email} updated progress for enrollment ${id}`);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status,
          time_spent: enrollment.time_spent
        }
      }
    });
  } catch (error) {
    logger.error('Update my progress error:', error);
    next(error);
  }
};

/**
 * Complete course
 */
const completeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id: id,
        student_id: req.user.id
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    await enrollment.complete();

    // Update course enrollment count
    const course = await Course.findByPk(enrollment.course_id);
    if (course) {
      await course.updateEnrollmentCount();

      // Log course completion activity
      await ActivityLog.createActivity(
        req.user.id,
        'course_completed',
        `Completed ${course.title}`,
        `Successfully completed ${course.title} course`,
        {
          courseId: course.id,
          metadata: {
            courseTitle: course.title,
            courseCategory: course.category,
            courseDifficulty: course.difficulty,
            completionTime: enrollment.completed_at
          },
          pointsEarned: 50
        }
      );

      // Notification
      await notificationService.notifyCourseContentCompleted(req.user.id, course, enrollment);

      // Note: Certificates are ONLY created when tests are passed (handled in testTakingController.js)
      // Do NOT create certificates here for course completion alone
    }

    logger.info(`User ${req.user.email} completed course`);

    res.json({
      success: true,
      message: 'Course completed successfully',
      data: {
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress,
          completed_at: enrollment.completed_at
        }
      }
    });
  } catch (error) {
    logger.error('Complete course error:', error);
    next(error);
  }
};

/**
 * Complete chapter and move to next (sequential progression)
 */
const completeChapter = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollmentId,
        student_id: req.user.id
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: CourseChapter,
              as: 'chapters',
              attributes: ['id', 'title', 'chapter_order', 'test_id', 'duration_minutes']
            }
          ]
        }
      ],
      order: [
        [{ model: Course, as: 'course' }, { model: CourseChapter, as: 'chapters' }, 'chapter_order', 'ASC']
      ]
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const chapters = enrollment.course.chapters;
    const currentChapter = chapters.find((ch) => ch.id == chapterId);
    const currentChapterIndex = chapters.findIndex((ch) => ch.id == chapterId);

    if (currentChapterIndex === -1 || !currentChapter) {
      throw new AppError('Chapter not found in this course', 404);
    }

    for (let i = 0; i < currentChapterIndex; i++) {
      const prevChapter = chapters[i];
      const prevProgress = await ChapterProgress.findOne({
        where: {
          enrollment_id: enrollmentId,
          chapter_id: prevChapter.id
        }
      });

      if (!isChapterFullyComplete(prevProgress, !!prevChapter.test_id)) {
        throw new AppError(`You must complete "${prevChapter.title}" before proceeding to this chapter`, 400);
      }
    }

    const [chapterProgress] = await ChapterProgress.findOrCreate({
      where: {
        enrollment_id: enrollmentId,
        chapter_id: chapterId
      },
      defaults: {
        enrollment_id: enrollmentId,
        chapter_id: chapterId,
        is_completed: false,
        content_completed: false
      }
    });

    const quizRequired = !!currentChapter.test_id;
    const alreadyFullyComplete = isChapterFullyComplete(chapterProgress, quizRequired);

    if (
      !alreadyFullyComplete
      && !isTimeRequirementMet(chapterProgress.time_spent, currentChapter.duration_minutes)
    ) {
      throw new AppError('Complete at least 90% of this chapter before proceeding', 400);
    }

    chapterProgress.content_completed = true;

    if (quizRequired && !chapterProgress.quiz_passed) {
      await chapterProgress.save();

      const progression = await chapterProgressionService.buildChapterProgression(
        enrollment,
        chapters
      );
      await enrollment.updateProgress(progression.stats.progressPercentage);
      await enrollment.update({ last_accessed_at: new Date() });

      return res.json({
        success: true,
        message: 'Chapter content completed. Please pass the chapter quiz to continue.',
        data: {
          chapterProgress: {
            id: chapterProgress.id,
            chapter_id: chapterId,
            content_completed: true,
            is_completed: false,
            quiz_required: true,
            quiz_passed: false
          },
          requiresQuiz: true,
          enrollment: {
            id: enrollment.id,
            progress: enrollment.progress,
            status: enrollment.status
          },
          nextChapter: null
        }
      });
    }

    if (!chapterProgress.is_completed) {
      await chapterProgress.markAsCompleted();
    } else {
      await chapterProgress.save();
    }

    const progression = await chapterProgressionService.buildChapterProgression(
      enrollment,
      chapters
    );
    const previousProgress = enrollment.progress;
    const newProgress = progression.stats.progressPercentage;
    const completedChapters = progression.stats.completedChapters;
    const totalChapters = progression.stats.totalChapters;

    // Update enrollment progress
    await enrollment.updateProgress(newProgress);
    await enrollment.update({ last_accessed_at: new Date() });

    // Log chapter completion activity
    try {
      await ActivityLog.createActivity(
        req.user.id,
        'chapter_completed',
        `Completed chapter: ${chapters[currentChapterIndex].title}`,
        `Successfully completed chapter "${chapters[currentChapterIndex].title}" in ${enrollment.course.title}`,
        {
          courseId: enrollment.course_id,
          chapterId: chapterId,
          metadata: {
            courseTitle: enrollment.course.title,
            chapterTitle: chapters[currentChapterIndex].title,
            chapterOrder: chapters[currentChapterIndex].chapter_order,
            totalChapters: totalChapters,
            completedChapters: completedChapters,
            progress: newProgress
          },
          pointsEarned: 5
        }
      );
      
      console.log('=== CHAPTER ACTIVITY LOGGED ===');
      console.log('User ID:', req.user.id);
      console.log('Chapter:', chapters[currentChapterIndex].title);
      console.log('Course:', enrollment.course.title);
      console.log('Activity type: chapter_completed');
      console.log('===============================');
    } catch (activityError) {
      console.error('Failed to log chapter completion activity:', activityError);
    }

    // Notifications (independent of activity logging)
    const isCourseCompleted = completedChapters === totalChapters;
    try {
      await notificationService.handleProgressChange(
        req.user.id,
        enrollment,
        enrollment.course,
        previousProgress,
        newProgress,
        {
          chapter: chapters[currentChapterIndex],
          isCourseCompleted
        }
      );
    } catch (notifError) {
      console.error('Failed to send chapter completion notifications:', notifError);
    }

    let nextChapter = null;

    if (!isCourseCompleted && currentChapterIndex < chapters.length - 1) {
      nextChapter = chapters[currentChapterIndex + 1];
    }

    logger.info(`User ${req.user.email} completed chapter ${chapterId} in course ${enrollment.course_id}`);

    res.json({
      success: true,
      message: 'Chapter completed successfully',
      data: {
        chapterProgress: {
          id: chapterProgress.id,
          chapter_id: chapterId,
          is_completed: chapterProgress.is_completed,
          completed_at: chapterProgress.completed_at
        },
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status
        },
        nextChapter: nextChapter ? {
          id: nextChapter.id,
          title: nextChapter.title,
          chapter_order: nextChapter.chapter_order
        } : null,
        isCourseCompleted,
        completedChapters,
        totalChapters
      }
    });
  } catch (error) {
    logger.error('Complete chapter error:', error);
    next(error);
  }
};

/**
 * Get chapter progression status
 */
const getChapterProgression = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollmentId,
        student_id: req.user.id
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: CourseChapter,
              as: 'chapters',
              attributes: ['id', 'title', 'chapter_order', 'description', 'test_id', 'duration_minutes']
            }
          ]
        }
      ],
      order: [
        [{ model: Course, as: 'course' }, { model: CourseChapter, as: 'chapters' }, 'chapter_order', 'ASC']
      ]
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const progression = await chapterProgressionService.buildChapterProgression(
      enrollment,
      enrollment.course.chapters,
      isContentDone(enrollment.status)
    );

    // Keep enrollment.progress aligned with step-based progression (heals older 0% rows)
    if (
      typeof progression.stats.progressPercentage === 'number'
      && enrollment.progress !== progression.stats.progressPercentage
    ) {
      await enrollment.updateProgress(progression.stats.progressPercentage);
    }

    res.json({
      success: true,
      message: 'Chapter progression retrieved successfully',
      data: {
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status
        },
        chapters: progression.chapters,
        stats: progression.stats,
        resumeChapterId: progression.resumeChapterId,
        resumeStepKey: progression.resumeStepKey,
        resumeViewMode: progression.resumeViewMode
      }
    });
  } catch (error) {
    logger.error('Get chapter progression error:', error);
    next(error);
  }
};

/**
 * Get enrollment grades (chapter quizzes + final exam)
 */
const getEnrollmentGrades = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollmentId,
        student_id: req.user.id
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const grades = await chapterProgressionService.computeEnrollmentGrades(
      enrollment.id,
      req.user.id,
      enrollment.course_id
    );

    res.json({
      success: true,
      message: 'Grades retrieved successfully',
      data: grades
    });
  } catch (error) {
    logger.error('Get enrollment grades error:', error);
    next(error);
  }
};

/**
 * Submit course feedback and rating
 */
const submitCourseFeedback = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const enrollment = await Enrollment.findOne({
      where: {
        id: enrollmentId,
        student_id: req.user.id
      },
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    if (!isContentDone(enrollment.status)) {
      throw new AppError('Course must be completed before submitting feedback', 400);
    }

    // Keep progress in sync so Take Test unlocks immediately on the client
    if (enrollment.progress < 100) {
      enrollment.progress = 100;
    }

    // Update enrollment with rating and review
    await enrollment.rate(rating, review);

    // Update course average rating
    const course = enrollment.course;
    const allRatings = await Enrollment.findAll({
      where: {
        course_id: course.id,
        rating: { [Op.not]: null }
      },
      attributes: ['rating']
    });

    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, e) => sum + e.rating, 0) / allRatings.length
      : 0;

    await course.update({
      average_rating: Math.round(averageRating * 10) / 10,
      total_ratings: allRatings.length
    });

    logger.info(`User ${req.user.email} submitted feedback for course ${course.id}`);

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        enrollment: {
          id: enrollment.id,
          rating: enrollment.rating,
          review: enrollment.review
        },
        course: {
          id: course.id,
          average_rating: course.average_rating,
          total_ratings: course.total_ratings
        }
      }
    });
  } catch (error) {
    logger.error('Submit course feedback error:', error);
    next(error);
  }
};

/**
 * Drop course
 */
const dropCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: {
        id: id,
        student_id: req.user.id
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    await enrollment.drop();

    // Update course enrollment count
    const course = await Course.findByPk(enrollment.course_id);
    if (course) {
      await course.updateEnrollmentCount();
    }

    logger.info(`User ${req.user.email} dropped course`);

    res.json({
      success: true,
      message: 'Course dropped successfully'
    });
  } catch (error) {
    logger.error('Drop course error:', error);
    next(error);
  }
};

/**
 * Get admin statistics
 */
const getAdminStats = async (req, res, next) => {
  try {
    // Get total enrollments
    const totalEnrollments = await Enrollment.count();

    // Get completed enrollments
    const completedEnrollments = await Enrollment.count({
      where: { status: 'completed' }
    });

    // Get active enrollments
    const activeEnrollments = await Enrollment.count({
      where: { status: 'enrolled' }
    });

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    // Get total students
    const totalStudents = await User.count({
      where: { role: 'student' }
    });

    // Get total courses
    const totalCourses = await Course.count();

    // Get published courses
    const publishedCourses = await Course.count({
      where: { is_published: true }
    });

    const certifiedEnrollments = await Enrollment.count({
      where: { status: 'certified' }
    });

    const totalCertificates = await Certificate.count({
      where: { is_valid: true }
    });

    const avgProgressRow = await Enrollment.findOne({
      attributes: [[Enrollment.sequelize.fn('AVG', Enrollment.sequelize.col('progress')), 'avgProgress']],
      raw: true
    });
    const averageProgress = Math.round(parseFloat(avgProgressRow?.avgProgress || 0) * 100) / 100;

    res.json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        stats: {
          totalEnrolled: totalEnrollments,
          totalCompleted: completedEnrollments,
          totalActive: activeEnrollments,
          completionRate: Math.round(completionRate * 100) / 100,
          totalStudents,
          totalCourses,
          publishedCourses,
          certifiedEnrollments,
          totalCertificates,
          averageProgress
        }
      }
    });
  } catch (error) {
    logger.error('Get admin stats error:', error);
    next(error);
  }
};

module.exports = {
  getMyEnrollments,
  getMyProgress,
  getMyCompletedCourses,
  getMyActiveCourses,
  getMyStats,
  updateMyProgress,
  completeCourse,
  completeChapter,
  getChapterProgression,
  getEnrollmentGrades,
  submitCourseFeedback,
  dropCourse,
  getAdminStats
};
