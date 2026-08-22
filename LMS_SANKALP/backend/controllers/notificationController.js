const { Notification } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get user's notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notifications: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    next(error);
  }
};

// Get unread count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.count({
      where: { 
        user_id: req.user.id,
        is_read: false
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    logger.error('Error fetching unread count:', error);
    next(error);
  }
};

// Mark one as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    notification.is_read = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    next(error);
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { is_read: true },
      { 
        where: { 
          user_id: req.user.id,
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const deleted = await Notification.destroy({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!deleted) {
      return next(new AppError('Notification not found', 404));
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    next(error);
  }
};
