const { Notification, User } = require('../models');
const logger = require('../utils/logger');
const emailService = require('./emailService');
const { Op } = require('sequelize');

const NOTIFICATION_EMAIL_MAP = {
  welcome: 'welcome',
  enrollment: 'course_enrolled',
  course_completed: 'course_completed',
  test_passed: 'test_passed',
  certificate: 'certificate_issued',
  plan_upgraded: 'plan_upgraded'
};

const PROGRESS_MILESTONES = [25, 50, 75, 100];

class NotificationService {
  async create(userId, type, title, message, actionUrl = null, metadata = null) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        logger.error(`Cannot create notification: User ${userId} not found`);
        return null;
      }

      const notification = await Notification.create({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        action_url: actionUrl,
        metadata: metadata || {}
      });

      try {
        if (global.socketServer) {
          global.socketServer.sendNotificationToUser(userId, notification.toJSON());
        }
      } catch (socketError) {
        logger.error('Failed to emit real-time notification via socket:', socketError);
      }

      const emailEvent = NOTIFICATION_EMAIL_MAP[type];
      if (emailEvent) {
        emailService.sendEventEmail(emailEvent, user, metadata || {}).catch((err) => {
          logger.error(`Failed to send ${emailEvent} email:`, err);
        });
      }

      return notification;
    } catch (error) {
      logger.error(`Failed to create notification (type=${type}, userId=${userId}):`, error);
      return null;
    }
  }

  async hasMilestoneNotification(userId, enrollmentId, milestone) {
    const existing = await Notification.findAll({
      where: {
        user_id: userId,
        type: { [Op.in]: ['progress_milestone', 'course_completed'] }
      },
      attributes: ['type', 'metadata']
    });
    return existing.some((n) => {
      if (n.metadata?.enrollmentId === enrollmentId && n.metadata?.milestone === milestone) {
        return true;
      }
      // Legacy course_completed rows without milestone field
      if (milestone === 100 && n.type === 'course_completed' && n.metadata?.enrollmentId === enrollmentId) {
        return true;
      }
      return false;
    });
  }

  async hasCourseCompletedNotification(userId, courseId) {
    const existing = await Notification.findAll({
      where: { user_id: userId, type: 'course_completed' },
      attributes: ['metadata']
    });
    return existing.some((n) => n.metadata?.courseId === courseId);
  }

  async notifyEnrollment(userId, course, isReEnroll = false) {
    const title = isReEnroll ? `Re-enrolled in ${course.title}` : `Enrolled in ${course.title}`;
    const message = isReEnroll
      ? `You have successfully re-enrolled in ${course.title}. Welcome back!`
      : `You have successfully enrolled in ${course.title}. Happy learning!`;

    return this.create(userId, 'enrollment', title, message, `/courses/${course.id}`, {
      courseTitle: course.title,
      courseId: course.id
    });
  }

  async notifyProgressMilestones(userId, enrollment, course, previousProgress, newProgress) {
    const milestonesToNotify = PROGRESS_MILESTONES.filter(
      (m) => previousProgress < m && newProgress >= m
    );

    for (const milestone of milestonesToNotify) {
      const alreadySent = await this.hasMilestoneNotification(userId, enrollment.id, milestone);
      if (alreadySent) continue;

      const isComplete = milestone === 100;
      await this.create(
        userId,
        isComplete ? 'course_completed' : 'progress_milestone',
        isComplete ? 'Course Content Completed' : `${milestone}% Course Progress`,
        isComplete
          ? `Congratulations! You completed all chapters in "${course.title}". Take the final assessment to earn your certificate.`
          : `You reached ${milestone}% progress in "${course.title}". Keep going!`,
        `/courses/${course.id}`,
        {
          courseTitle: course.title,
          courseId: course.id,
          enrollmentId: enrollment.id,
          milestone,
          progress: newProgress
        }
      );
    }
  }

  async notifyCourseContentCompleted(userId, course, enrollment = null) {
    if (enrollment) {
      return this.notifyProgressMilestones(userId, enrollment, course, 99, 100);
    }

    const alreadySent = await this.hasCourseCompletedNotification(userId, course.id);
    if (alreadySent) return null;

    return this.create(
      userId,
      'course_completed',
      'Course Content Completed',
      `Congratulations! You completed all chapters in "${course.title}". Take the final assessment to earn your certificate.`,
      `/courses/${course.id}`,
      { courseTitle: course.title, courseId: course.id, milestone: 100 }
    );
  }

  async notifyTestResult(userId, test, course, { passed, score }) {
    if (passed) {
      return this.create(
        userId,
        'test_passed',
        'Test Passed',
        `You passed the test "${test.title}" with ${score}%!`,
        `/certificates`,
        {
          testTitle: test.title,
          courseTitle: course.title,
          courseId: course.id,
          score
        }
      );
    }

    return this.create(
      userId,
      'test_failed',
      'Test Not Passed',
      `You scored ${score}% on "${test.title}". Passing score is ${test.passing_score}%. Review the material and try again.`,
      `/courses/${course.id}`,
      {
        testTitle: test.title,
        courseTitle: course.title,
        courseId: course.id,
        score,
        passingScore: test.passing_score
      }
    );
  }

  async notifyCertificate(userId, course, certificateNumber) {
    return this.create(
      userId,
      'certificate',
      'Certificate Earned',
      `You earned a certificate for "${course.title}"!`,
      '/certificates',
      {
        courseTitle: course.title,
        courseId: course.id,
        certificateNumber
      }
    );
  }

  /**
   * Progress notifications only at 25 / 50 / 75 / 100% — no per-chapter alerts.
   */
  async handleProgressChange(userId, enrollment, course, previousProgress, newProgress, options = {}) {
    const { isCourseCompleted = false } = options;
    const effectiveProgress = isCourseCompleted ? Math.max(newProgress, 100) : newProgress;
    await this.notifyProgressMilestones(userId, enrollment, course, previousProgress, effectiveProgress);
  }
}

module.exports = new NotificationService();
