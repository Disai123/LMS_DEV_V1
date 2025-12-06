const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Authenticate JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Authentication required.'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      
      // Get user from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. User not found or inactive.'
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired. Please login again.'
        });
      }
      
      logger.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error.'
    });
  }
};

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required.'
    });
  }

  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
        });

        if (user && user.isActive) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      } catch (error) {
        // Token invalid or expired, continue without user
        req.user = null;
      }
    }
  } catch (error) {
    // Error occurred, continue without user
    req.user = null;
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};

