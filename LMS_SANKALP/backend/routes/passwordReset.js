const express = require('express');
const passwordResetController = require('../controllers/passwordResetController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for password reset requests (max 3 requests per 15 minutes per IP)
const resetRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: 'Too many password reset requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Request password reset (send email)
router.post('/request', resetRequestLimiter, passwordResetController.requestPasswordReset);

// Validate reset token
router.get('/validate/:token', passwordResetController.validateResetToken);

// Get user info for reset token (for UI display)
router.get('/token-info/:token', passwordResetController.getResetTokenInfo);

// Reset password with token
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;
