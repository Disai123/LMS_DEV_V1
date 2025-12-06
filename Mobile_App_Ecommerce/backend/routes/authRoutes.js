const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { userSchemas } = require('../utils/validation');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(userSchemas.register, 'body'), authController.register);

// POST /api/auth/login
router.post('/login', validate(userSchemas.login, 'body'), authController.login);

// GET /api/auth/me (Protected)
router.get('/me', authenticate, authController.getCurrentUser);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout (Protected)
router.post('/logout', authenticate, authController.logout);

module.exports = router;

