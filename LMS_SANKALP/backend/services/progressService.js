const { ChapterProgress, Enrollment, CourseChapter, Course } = require('../models');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');

class ProgressService {
  /**
   * Calculate overall course progress based on completed chapters
   */
  static async calculateCourseProgress(enrollmentId) {
    try {
      const enrollment = await Enrollment.findByPk(enrollmentId, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id'],
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

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const totalChapters = enrollment.course.chapters.length;
      if (totalChapters === 0) {
        return 0;
      }

      const completedChapters = await ChapterProgress.count({
        where: { 
          enrollment_id: enrollmentId, 
          is_completed: true 
        }
      });

      const progress = Math.round((completedChapters / totalChapters) * 100);
      return Math.min(progress, 100);
    } catch (error) {
      logger.error('Error calculating course progress:', error);
      throw error;
    }
  }

  /**
   * Update chapter progress and recalculate overall progress
   */
  static async updateChapterProgress(enrollmentId, chapterId, progressData) {
    try {
      const { is_completed, video_watched, pdf_viewed, time_spent } = progressData;

      // Find or create chapter progress record
      let chapterProgress = await ChapterProgress.findOne({
        where: { 
          enrollment_id: enrollmentId, 
          chapter_id: chapterId 
        }
      });

      if (!chapterProgress) {
        chapterProgress = await ChapterProgress.create({
          enrollment_id: enrollmentId,
          chapter_id: chapterId,
          is_completed: false,
          video_watched: false,
          pdf_viewed: false,
          time_spent: 0
        });
      }

      // Update progress data
      if (is_completed !== undefined) {
        chapterProgress.is_completed = is_completed;
        if (is_completed) {
          chapterProgress.completed_at = new Date();
        }
      }

      if (video_watched !== undefined) {
        chapterProgress.video_watched = video_watched;
      }

      if (pdf_viewed !== undefined) {
        chapterProgress.pdf_viewed = pdf_viewed;
      }

      if (time_spent !== undefined) {
        chapterProgress.time_spent += time_spent;
      }

      await chapterProgress.save();

      let enrollment = await Enrollment.findByPk(enrollmentId);
      const previousProgress = enrollment ? enrollment.progress : 0;

      // Recalculate overall course progress
      const overallProgress = await this.calculateCourseProgress(enrollmentId);
      
      // Update enrollment progress
      enrollment = await Enrollment.findByPk(enrollmentId, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title'],
            include: [
              {
                model: CourseChapter,
                as: 'chapters',
                attributes: ['id', 'title', 'chapter_order']
              }
            ]
          }
        ]
      });
      await enrollment.updateProgress(overallProgress);
      await enrollment.reload();

      if (is_completed && enrollment.course) {
        const chapter = await CourseChapter.findByPk(chapterId, {
          attributes: ['id', 'title', 'chapter_order']
        });
        const totalChapters = enrollment.course?.chapters?.length || 0;
        const completedCount = await ChapterProgress.count({
          where: { enrollment_id: enrollmentId, is_completed: true }
        });
        const isCourseCompleted = totalChapters > 0 && completedCount >= totalChapters;

        try {
          await notificationService.handleProgressChange(
            enrollment.student_id,
            enrollment,
            enrollment.course,
            previousProgress,
            overallProgress,
            { chapter, isCourseCompleted }
          );
        } catch (notifError) {
          logger.error('Failed to send progress notifications from ProgressService:', notifError);
        }
      }

      return {
        chapterProgress,
        overallProgress,
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status
        }
      };
    } catch (error) {
      logger.error('Error updating chapter progress:', error);
      throw error;
    }
  }

  /**
   * Get detailed progress for an enrollment
   */
  static async getEnrollmentProgress(enrollmentId) {
    try {
      const enrollment = await Enrollment.findByPk(enrollmentId, {
        include: [
          {
            model: CourseChapter,
            as: 'course.chapters',
            attributes: ['id', 'title', 'chapter_order', 'video_url', 'pdf_url']
          }
        ]
      });

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const chapterProgress = await ChapterProgress.findAll({
        where: { enrollment_id: enrollmentId },
        include: [
          {
            model: CourseChapter,
            as: 'chapter',
            attributes: ['id', 'title', 'chapter_order']
          }
        ],
        order: [['chapter', 'chapter_order', 'ASC']]
      });

      const totalChapters = enrollment.course.chapters.length;
      const completedChapters = chapterProgress.filter(cp => cp.is_completed).length;
      const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

      return {
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status,
          time_spent: enrollment.time_spent
        },
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          totalChapters
        },
        progress: {
          completedChapters,
          totalChapters,
          percentage: progressPercentage
        },
        chapters: chapterProgress.map(cp => ({
          id: cp.chapter.id,
          title: cp.chapter.title,
          chapter_order: cp.chapter.chapter_order,
          is_completed: cp.is_completed,
          video_watched: cp.video_watched,
          pdf_viewed: cp.pdf_viewed,
          time_spent: cp.time_spent,
          completed_at: cp.completed_at
        }))
      };
    } catch (error) {
      logger.error('Error getting enrollment progress:', error);
      throw error;
    }
  }

  /**
   * Mark a chapter as completed
   */
  static async markChapterCompleted(enrollmentId, chapterId) {
    return this.updateChapterProgress(enrollmentId, chapterId, { is_completed: true });
  }

  /**
   * Mark video as watched
   */
  static async markVideoWatched(enrollmentId, chapterId) {
    return this.updateChapterProgress(enrollmentId, chapterId, { video_watched: true });
  }

  /**
   * Mark PDF as viewed
   */
  static async markPDFViewed(enrollmentId, chapterId) {
    return this.updateChapterProgress(enrollmentId, chapterId, { pdf_viewed: true });
  }

  /**
   * Add time spent on a chapter
   */
  static async addTimeSpent(enrollmentId, chapterId, minutes) {
    return this.updateChapterProgress(enrollmentId, chapterId, { time_spent: minutes });
  }

  /**
   * Get progress statistics for a course
   */
  static async getCourseProgressStats(courseId) {
    try {
      const enrollments = await Enrollment.findAll({
        where: { course_id: courseId },
        include: [
          {
            model: ChapterProgress,
            as: 'chapterProgress',
            include: [
              {
                model: CourseChapter,
                as: 'chapter',
                attributes: ['id', 'title']
              }
            ]
          }
        ]
      });

      const stats = {
        totalEnrollments: enrollments.length,
        completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
        averageProgress: 0,
        chapterStats: {}
      };

      if (enrollments.length > 0) {
        const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0);
        stats.averageProgress = Math.round(totalProgress / enrollments.length);

        // Calculate chapter completion rates
        const allChapterProgress = enrollments.flatMap(e => e.chapterProgress);
        const chapterGroups = allChapterProgress.reduce((groups, cp) => {
          const chapterId = cp.chapter.id;
          if (!groups[chapterId]) {
            groups[chapterId] = {
              title: cp.chapter.title,
              total: 0,
              completed: 0
            };
          }
          groups[chapterId].total++;
          if (cp.is_completed) {
            groups[chapterId].completed++;
          }
          return groups;
        }, {});

        stats.chapterStats = Object.values(chapterGroups).map(chapter => ({
          ...chapter,
          completionRate: Math.round((chapter.completed / chapter.total) * 100)
        }));
      }

      return stats;
    } catch (error) {
      logger.error('Error getting course progress stats:', error);
      throw error;
    }
  }
}

module.exports = ProgressService;
