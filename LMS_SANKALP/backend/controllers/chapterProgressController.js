const ProgressService = require('../services/progressService');
const { ChapterProgress, Enrollment, CourseChapter, Course } = require('../models');
const AppError = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get chapter progress for an enrollment
 */
const getChapterProgress = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const progress = await ProgressService.getEnrollmentProgress(enrollmentId);

    res.json({
      success: true,
      message: 'Chapter progress retrieved successfully',
      data: progress
    });
  } catch (error) {
    logger.error('Get chapter progress error:', error);
    next(error);
  }
};

/**
 * Update chapter progress
 */
const updateChapterProgress = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;
    const { is_completed, video_watched, pdf_viewed, time_spent } = req.body;

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // Verify chapter belongs to the course
    const chapter = await CourseChapter.findOne({
      where: { 
        id: chapterId, 
        course_id: enrollment.course_id 
      }
    });

    if (!chapter) {
      throw new AppError('Chapter not found in this course', 404);
    }

    const result = await ProgressService.updateChapterProgress(enrollmentId, chapterId, {
      is_completed,
      video_watched,
      pdf_viewed,
      time_spent
    });

    logger.info(`User ${req.user.email} updated progress for chapter ${chapterId}`);

    res.json({
      success: true,
      message: 'Chapter progress updated successfully',
      data: result
    });
  } catch (error) {
    logger.error('Update chapter progress error:', error);
    next(error);
  }
};

/**
 * Mark chapter as completed
 */
const markChapterCompleted = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    // Verify chapter belongs to the course
    const chapter = await CourseChapter.findOne({
      where: { 
        id: chapterId, 
        course_id: enrollment.course_id 
      }
    });

    if (!chapter) {
      throw new AppError('Chapter not found in this course', 404);
    }

    const result = await ProgressService.markChapterCompleted(enrollmentId, chapterId);

    logger.info(`User ${req.user.email} marked chapter ${chapterId} as completed`);

    res.json({
      success: true,
      message: 'Chapter marked as completed',
      data: result
    });
  } catch (error) {
    logger.error('Mark chapter completed error:', error);
    next(error);
  }
};

/**
 * Mark video as watched
 */
const markVideoWatched = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const result = await ProgressService.markVideoWatched(enrollmentId, chapterId);

    logger.info(`User ${req.user.email} marked video for chapter ${chapterId} as watched`);

    res.json({
      success: true,
      message: 'Video marked as watched',
      data: result
    });
  } catch (error) {
    logger.error('Mark video watched error:', error);
    next(error);
  }
};

/**
 * Mark PDF as viewed
 */
const markPDFViewed = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const result = await ProgressService.markPDFViewed(enrollmentId, chapterId);

    logger.info(`User ${req.user.email} marked PDF for chapter ${chapterId} as viewed`);

    res.json({
      success: true,
      message: 'PDF marked as viewed',
      data: result
    });
  } catch (error) {
    logger.error('Mark PDF viewed error:', error);
    next(error);
  }
};

/**
 * Add time spent on chapter
 */
const addTimeSpent = async (req, res, next) => {
  try {
    const { enrollmentId, chapterId } = req.params;
    const { minutes } = req.body;

    if (!minutes || minutes < 0) {
      throw new AppError('Invalid time spent value', 400);
    }

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({
      where: { 
        id: enrollmentId, 
        student_id: req.user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const result = await ProgressService.addTimeSpent(enrollmentId, chapterId, minutes);

    logger.info(`User ${req.user.email} added ${minutes} minutes to chapter ${chapterId}`);

    res.json({
      success: true,
      message: 'Time spent updated successfully',
      data: result
    });
  } catch (error) {
    logger.error('Add time spent error:', error);
    next(error);
  }
};

/**
 * Get course progress statistics (for instructors)
 */
const getCourseProgressStats = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Verify user is instructor of the course
    const course = await Course.findOne({
      where: { 
        id: courseId, 
        instructor_id: req.user.id 
      }
    });

    if (!course) {
      throw new AppError('Course not found or access denied', 404);
    }

    const stats = await ProgressService.getCourseProgressStats(courseId);

    res.json({
      success: true,
      message: 'Course progress statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    logger.error('Get course progress stats error:', error);
    next(error);
  }
};

module.exports = {
  getChapterProgress,
  updateChapterProgress,
  markChapterCompleted,
  markVideoWatched,
  markPDFViewed,
  addTimeSpent,
  getCourseProgressStats
};
