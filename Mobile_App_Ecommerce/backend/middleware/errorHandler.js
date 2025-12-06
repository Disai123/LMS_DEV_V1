const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry. This record already exists.'
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid reference. Related record does not exist.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired. Please login again.'
    });
  }

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Custom error with status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || 'An error occurred'
    });
  }

  // Default 500 error
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

/**
 * 404 handler
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`
  });
};

module.exports = {
  errorHandler,
  notFound
};

