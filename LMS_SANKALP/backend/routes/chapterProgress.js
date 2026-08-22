const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getChapterProgress,
  updateChapterProgress,
  markChapterCompleted,
  markVideoWatched,
  markPDFViewed,
  addTimeSpent,
  getCourseProgressStats
} = require('../controllers/chapterProgressController');

// All routes require authentication
router.use(authenticate);

// Get chapter progress for an enrollment
router.get('/enrollment/:enrollmentId', getChapterProgress);

// Update chapter progress
router.put('/enrollment/:enrollmentId/chapter/:chapterId', updateChapterProgress);

// Mark chapter as completed
router.post('/enrollment/:enrollmentId/chapter/:chapterId/complete', markChapterCompleted);

// Mark video as watched
router.post('/enrollment/:enrollmentId/chapter/:chapterId/video-watched', markVideoWatched);

// Mark PDF as viewed
router.post('/enrollment/:enrollmentId/chapter/:chapterId/pdf-viewed', markPDFViewed);

// Add time spent on chapter
router.post('/enrollment/:enrollmentId/chapter/:chapterId/time-spent', addTimeSpent);

// Get course progress statistics (for instructors)
router.get('/course/:courseId/stats', getCourseProgressStats);

module.exports = router;
