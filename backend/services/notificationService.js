const { Notification, User } = require('../models');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create a notification in the database and emit it via Socket.io
   * 
   * @param {string} userId - ID of the user receiving the notification
   * @param {string} type - Type of notification (e.g., 'enrollment', 'course_completed')
   * @param {string} title - Short title for the notification
   * @param {string} message - Detailed message body
   * @param {string} actionUrl - URL to navigate to when clicked (optional)
   * @param {object} metadata - Additional JSON data (optional)
   * @returns {Promise<Object>} The created notification object
   */
  async create(userId, type, title, message, actionUrl = null, metadata = null) {
    try {
      // 1. Validate user exists
      const user = await User.findByPk(userId);
      if (!user) {
        logger.error(`Cannot create notification: User ${userId} not found`);
        return null;
      }

      // 2. Create in database
      const notification = await Notification.create({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        action_url: actionUrl,
        metadata: metadata || {}
      });

      // 3. Try to emit via Socket.io via global.socketServer set in server.js
      try {
        if (global.socketServer) {
          global.socketServer.sendNotificationToUser(userId, notification.toJSON());
        } else {
          logger.warn('Socket server not found on global. Cannot emit real-time notification but it is saved to DB.');
        }
      } catch (socketError) {
        logger.error('Failed to emit real-time notification via socket:', socketError);
        // We don't fail the creation process if socket emission fails
      }

      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      // We generally don't want notification failure to break the main flow (like enrollment or course completion)
      // So we catch and log here, returning null instead of throwing.
      return null;
    }
  }
}

module.exports = new NotificationService();
