const { CourseChapter, Course } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { analyzeUrl } = require('../utils/urlAnalyzer');

/**
 * Create a new chapter for a course
 */
const createChapter = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const chapterData = { ...req.body, course_id: courseId };

    // Verify course exists and user owns it
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Access denied. You can only add chapters to your own courses.', 403);
    }

    // Get next chapter order
    const nextOrder = await CourseChapter.getNextOrder(courseId);
    chapterData.chapter_order = nextOrder;

    // Validate that at least one URL is provided
    if (!chapterData.video_url && !chapterData.pdf_url) {
      throw new AppError('At least one URL (video or PDF) is required', 400);
    }

    // Validate video URL if provided
    if (chapterData.video_url) {
      try {
        const analysis = analyzeUrl(chapterData.video_url);
        if (!analysis.isValid) {
          throw new AppError('Invalid video URL format', 400);
        }
        chapterData.url_analysis = { ...analysis, video_source_type: analysis.type };
      } catch (analysisError) {
        if (analysisError instanceof AppError) throw analysisError;
        logger.warn('Video URL analysis failed:', analysisError);
        throw new AppError('Invalid video URL format', 400);
      }
    }

    // Validate PDF URL if provided
    if (chapterData.pdf_url) {
      try {
        logger.info('Validating PDF URL:', chapterData.pdf_url);
        const urlObj = new URL(chapterData.pdf_url);
        if (!urlObj.protocol.startsWith('http')) {
          throw new AppError('Invalid PDF URL format', 400);
        }
        const analysis = analyzeUrl(chapterData.pdf_url);
        if (!analysis.isValid) {
          logger.info('PDF URL analysis failed, but accepting as valid URL:', chapterData.pdf_url);
        }
      } catch (urlError) {
        if (urlError instanceof AppError) throw urlError;
        logger.warn('PDF URL validation failed:', urlError);
        throw new AppError('Invalid PDF URL format', 400);
      }
    }

    const chapter = await CourseChapter.create(chapterData);

    // Fetch created chapter
    const createdChapter = await CourseChapter.findByPk(chapter.id);

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: {
        chapter: createdChapter.getPublicInfo()
      }
    });
  } catch (error) {
    logger.error('Create chapter error:', error);
    next(error);
  }
};

/**
 * Get all chapters for a course
 */
const getChapters = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const chapters = await CourseChapter.findByCourse(courseId);

    res.json({
      success: true,
      data: {
        chapters: chapters.map(chapter => chapter.getPublicInfo())
      }
    });
  } catch (error) {
    logger.error('Get chapters error:', error);
    next(error);
  }
};

/**
 * Get a specific chapter
 */
const getChapter = async (req, res, next) => {
  try {
    const { courseId, chapterId } = req.params;

    const chapter = await CourseChapter.findOne({
      where: {
        id: chapterId,
        course_id: courseId
      }
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404);
    }

    res.json({
      success: true,
      data: {
        chapter: chapter.getPublicInfo()
      }
    });
  } catch (error) {
    logger.error('Get chapter error:', error);
    next(error);
  }
};

/**
 * Update a chapter
 */
const updateChapter = async (req, res, next) => {
  try {
    const { courseId, chapterId } = req.params;
    const updateData = { ...req.body };

    const chapter = await CourseChapter.findOne({
      where: {
        id: chapterId,
        course_id: courseId
      }
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404);
    }

    // Verify course ownership or admin role
    const course = await Course.findByPk(courseId);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Access denied. You can only edit chapters in your own courses.', 403);
    }

    // Validate that at least one URL is provided
    if (!updateData.video_url && !updateData.pdf_url) {
      throw new AppError('At least one URL (video or PDF) is required', 400);
    }

    // Validate video URL if provided
    if (updateData.video_url) {
      const analysis = analyzeUrl(updateData.video_url);
      if (!analysis.isValid) {
        throw new AppError('Invalid video URL format', 400);
      }
      updateData.url_analysis = { ...analysis, video_source_type: analysis.type };
    }

    // Validate PDF URL if provided
    if (updateData.pdf_url) {
      const analysis = await analyzeUrl(updateData.pdf_url);
      if (!analysis.isValid) {
        throw new AppError('Invalid PDF URL format', 400);
      }
    }

    await chapter.update(updateData);

    // Fetch updated chapter
    const updatedChapter = await CourseChapter.findByPk(chapterId);

    res.json({
      success: true,
      message: 'Chapter updated successfully',
      data: {
        chapter: updatedChapter.getPublicInfo()
      }
    });
  } catch (error) {
    logger.error('Update chapter error:', error);
    next(error);
  }
};

/**
 * Delete a chapter
 */
const deleteChapter = async (req, res, next) => {
  try {
    const { courseId, chapterId } = req.params;

    const chapter = await CourseChapter.findOne({
      where: {
        id: chapterId,
        course_id: courseId
      }
    });

    if (!chapter) {
      throw new AppError('Chapter not found', 404);
    }

    // Verify course ownership or admin role
    const course = await Course.findByPk(courseId);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Access denied. You can only delete chapters from your own courses.', 403);
    }

    await chapter.destroy();

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    logger.error('Delete chapter error:', error);
    next(error);
  }
};

/**
 * Reorder chapters
 */
const reorderChapters = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { chapterOrders } = req.body;

    // Verify course ownership or admin role
    const course = await Course.findByPk(courseId);
    if (course.instructor_id !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Access denied. You can only reorder chapters in your own courses.', 403);
    }

    await CourseChapter.reorderChapters(courseId, chapterOrders);

    res.json({
      success: true,
      message: 'Chapters reordered successfully'
    });
  } catch (error) {
    logger.error('Reorder chapters error:', error);
    next(error);
  }
};

module.exports = {
  createChapter,
  getChapters,
  getChapter,
  updateChapter,
  deleteChapter,
  reorderChapters
};