const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// Get student's own score
router.get('/me', auth.authenticate, scoreController.getMyScore);

// Get student achievements
router.get('/me/achievements', auth.authenticate, scoreController.getMyAchievements);

module.exports = router;

