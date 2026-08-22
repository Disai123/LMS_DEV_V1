const { User } = require('../models');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Request password reset - sends email with reset link
 */
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400);
        }

        // Always return success to prevent email enumeration
        // But only send email if user exists and is a student with password
        const user = await User.findByEmail(email.toLowerCase().trim());

        if (user && user.role === 'student' && user.password && user.is_active) {
            // Generate reset token
            const resetToken = await user.generatePasswordResetToken();

            // Send reset email
            try {
                await emailService.sendPasswordResetEmail(email, resetToken, user.name);
                logger.info(`Password reset email sent to ${email}`);
            } catch (emailError) {
                logger.error('Failed to send password reset email:', emailError);
                // Clear the token if email fails
                await user.clearResetToken();
                throw new AppError('Failed to send reset email. Please try again later.', 500);
            }
        } else {
            // Log the reason for not sending email (for debugging)
            if (user) {
                if (user.role !== 'student') {
                    logger.info(`Password reset requested for non-student account: ${email}`);
                } else if (!user.password) {
                    logger.info(`Password reset requested for Google-only account: ${email}`);
                } else if (!user.is_active) {
                    logger.info(`Password reset requested for inactive account: ${email}`);
                }
            } else {
                logger.info(`Password reset requested for non-existent email: ${email}`);
            }
        }

        // Always return success message (security best practice)
        res.json({
            success: true,
            message: 'If your email is registered, you will receive a password reset link shortly.'
        });
    } catch (error) {
        logger.error('Password reset request error:', error);
        next(error);
    }
};

/**
 * Validate reset token
 */
const validateResetToken = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            throw new AppError('Reset token is required', 400);
        }

        const user = await User.findByResetToken(token);

        if (!user || !user.isResetTokenValid()) {
            return res.json({
                success: false,
                valid: false,
                message: 'Invalid or expired reset token'
            });
        }

        res.json({
            success: true,
            valid: true,
            message: 'Token is valid'
        });
    } catch (error) {
        logger.error('Token validation error:', error);
        next(error);
    }
};

/**
 * Get user info for reset token (for UI display)
 */
const getResetTokenInfo = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            throw new AppError('Reset token is required', 400);
        }

        const user = await User.findByResetToken(token);

        if (!user || !user.isResetTokenValid()) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        // Return masked email for display
        const email = user.email;
        const [localPart, domain] = email.split('@');
        const maskedEmail = localPart.length > 3
            ? `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`
            : `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`;

        res.json({
            success: true,
            data: {
                email: maskedEmail,
                name: user.name
            }
        });
    } catch (error) {
        logger.error('Get reset token info error:', error);
        next(error);
    }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new AppError('Token and new password are required', 400);
        }

        // Validate password strength
        if (newPassword.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }

        // Find user by token
        const user = await User.findByResetToken(token);

        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        // Check if token is still valid
        if (!user.isResetTokenValid()) {
            throw new AppError('Reset token has expired', 400);
        }

        // Check if new password is same as old password
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            throw new AppError('New password must be different from your current password', 400);
        }

        // Update password (will be hashed by model hook)
        await user.update({ password: newPassword });

        // Clear reset token
        await user.clearResetToken();

        // Send confirmation email
        try {
            await emailService.sendPasswordResetConfirmation(user.email, user.name);
        } catch (emailError) {
            logger.error('Failed to send password reset confirmation email:', emailError);
            // Don't fail the request if confirmation email fails
        }

        logger.info(`Password reset successful for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Password has been reset successfully. You can now log in with your new password.'
        });
    } catch (error) {
        logger.error('Password reset error:', error);
        next(error);
    }
};

module.exports = {
    requestPasswordReset,
    validateResetToken,
    getResetTokenInfo,
    resetPassword
};
