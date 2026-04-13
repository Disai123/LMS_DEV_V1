const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// Get student's own score
router.get('/me', auth.authenticate, scoreController.getMyScore);

// Get student achievements
router.get('/me/achievements', auth.authenticate, scoreController.getMyAchievements);

// Force recalculate score from all approved submissions (fixes orphaned approvals)
router.post('/me/recalculate', auth.authenticate, scoreController.recalculateMyScore);

// Admin: recalculate a specific student's score
router.post('/student/:studentId/recalculate', auth.authenticate, auth.requireAdmin, scoreController.recalculateStudentScore);

module.exports = router;

