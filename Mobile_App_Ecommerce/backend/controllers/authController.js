const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || null,
      role: 'customer'
    });

    // Generate tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );

    // Return user without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token,
        refreshToken
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive'
      });
    }

    // Check password
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );

    // Return user without password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      success: true,
      data: { token },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }
    logger.error('Refresh token error:', error);
    next(error);
  }
};

/**
 * Logout user (client-side token removal, server can blacklist token if needed)
 */
const logout = async (req, res, next) => {
  try {
    // In a stateless JWT setup, logout is handled client-side
    // You can implement token blacklisting here if needed
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout
};

