const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const controller = require('../controllers/realtimeProjectSubmissionController');

// Student routes (require authentication)
router.post('/', authenticate, controller.submitProject);
router.get('/my-submissions', authenticate, controller.getMySubmissions);
router.get('/:id', authenticate, controller.getSubmissionById);
router.put('/:id', authenticate, controller.updateSubmission);
router.delete('/:id', authenticate, controller.deleteSubmission);

// Admin routes (require admin role)
router.get('/admin/all', authenticate, requireAdmin, controller.getAllSubmissions);
router.get('/admin/stats', authenticate, requireAdmin, controller.getSubmissionStats);
router.post('/:id/approve', authenticate, requireAdmin, controller.approveSubmission);
router.post('/:id/reject', authenticate, requireAdmin, controller.rejectSubmission);
router.post('/:id/request-revision', authenticate, requireAdmin, controller.requestRevision);

module.exports = router;
