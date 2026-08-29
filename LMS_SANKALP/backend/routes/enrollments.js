const express = require('express');
const { authenticate, requireStudent, requireAdmin } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const enrollmentController = require('../controllers/enrollmentController');
const { enrollmentSchemas, commonSchemas } = require('../utils/validation');

const router = express.Router();

// Student routes
router.get('/my-enrollments', 
  authenticate,
  requireStudent,
  validate(commonSchemas.pagination, 'query'),
  enrollmentController.getMyEnrollments
);

router.get('/my-progress', 
  authenticate,
  requireStudent,
  enrollmentController.getMyProgress
);

router.get('/my-completed', 
  authenticate,
  requireStudent,
  validate(commonSchemas.pagination, 'query'),
  enrollmentController.getMyCompletedCourses
);

router.get('/my-active', 
  authenticate,
  requireStudent,
  validate(commonSchemas.pagination, 'query'),
  enrollmentController.getMyActiveCourses
);

router.get('/stats', 
  authenticate,
  requireStudent,
  enrollmentController.getMyStats
);

router.put('/:id/progress', 
  authenticate,
  requireStudent,
  validate(commonSchemas.id, 'params'),
  validate(enrollmentSchemas.update, 'body'),
  enrollmentController.updateMyProgress
);

router.post('/:id/complete', 
  authenticate,
  requireStudent,
  validate(commonSchemas.id, 'params'),
  enrollmentController.completeCourse
);

// New sequential chapter progression routes
router.post('/:enrollmentId/chapters/:chapterId/complete', 
  authenticate,
  requireStudent,
  validate(commonSchemas.enrollmentAndChapter, 'params'),
  enrollmentController.completeChapter
);

router.get('/:enrollmentId/progression', 
  authenticate,
  requireStudent,
  validate(commonSchemas.enrollmentId, 'params'),
  enrollmentController.getChapterProgression
);

router.get('/:enrollmentId/grades',
  authenticate,
  requireStudent,
  validate(commonSchemas.enrollmentId, 'params'),
  enrollmentController.getEnrollmentGrades
);

router.post('/:enrollmentId/feedback',
  authenticate,
  requireStudent,
  validate(commonSchemas.enrollmentId, 'params'),
  validate(enrollmentSchemas.feedback, 'body'),
  enrollmentController.submitCourseFeedback
);

router.post('/:id/drop', 
  authenticate,
  requireStudent,
  validate(commonSchemas.id, 'params'),
  enrollmentController.dropCourse
);

// Admin routes
router.get('/admin/stats', 
  authenticate,
  requireAdmin,
  (req, res, next) => {
    console.log('Admin stats route hit');
    next();
  },
  enrollmentController.getAdminStats
);

module.exports = router;
