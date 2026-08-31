const express = require('express');
const rateLimit = require('express-rate-limit');
const passport = require('../config/passport');
const { googleOAuthEnabled } = require('../config/passport');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const authController = require('../controllers/authController');
const { userSchemas } = require('../utils/validation');

const router = express.Router();

const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes and try again.'
  }
});

// Student registration
router.post('/register', authLoginLimiter, authController.register);

// Traditional login
router.post('/login', authLoginLimiter, authController.login);

// Google OAuth routes (only when credentials are configured)
const googleNotConfigured = (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Google sign-in is not configured on this server. Use email and password instead.'
  });
};

if (googleOAuthEnabled) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed',
      session: false
    }),
    authController.googleCallback
  );
} else {
  router.get('/google', googleNotConfigured);
  router.get('/google/callback', googleNotConfigured);
}

// Google credential verification (for frontend Google Sign-In)
router.post('/google/verify', authController.verifyGoogleCredential);

// Token refresh
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Update profile
router.put('/profile', 
  authenticate, 
  validate(userSchemas.profileUpdate, 'body'),
  authController.updateProfile
);

router.get('/my-student-profile',
  authenticate,
  authController.getMyStudentProfile
);

// Change password
router.put('/change-password', 
  authenticate,
  authController.changePassword
);

// Check authentication status
router.get('/status', optionalAuth, authController.getAuthStatus);

module.exports = router;
