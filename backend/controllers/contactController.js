const { ContactMessage } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      throw new AppError('Please provide all required fields', 400);
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ip_address: req.ip
    });

    logger.info(`New contact message from ${email}`);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: {
        id: contactMessage.id
      }
    });
  } catch (error) {
    logger.error('Contact form submission error:', error);
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const messages = await ContactMessage.findAll({
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    logger.error('Error fetching contact messages:', error);
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages
};
