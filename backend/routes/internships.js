const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  togglePublish,
  registerForInternship,
  getMyInternships,
  getRegistrations,
  updateRegistration
} = require('../controllers/internshipController');
const {
  submitInternship,
  getMySubmissions,
  getMySubmissionForInternship,
  updateSubmission,
  getAllSubmissions,
  approveSubmission,
  rejectSubmission,
  getSubmissionStats
} = require('../controllers/internshipSubmissionController');

// Public routes
router.get('/', getAllInternships);
router.get('/:id', getInternshipById);

// Student authenticated routes
router.get('/student/my', authenticate, getMyInternships);
router.post('/:id/register', authenticate, registerForInternship);

// Admin routes
router.post('/', authenticate, requireAdmin, createInternship);
router.put('/:id', authenticate, requireAdmin, updateInternship);
router.delete('/:id', authenticate, requireAdmin, deleteInternship);
router.put('/:id/publish', authenticate, requireAdmin, togglePublish);
router.get('/:id/registrations', authenticate, requireAdmin, getRegistrations);
router.put('/:id/registrations/:regId', authenticate, requireAdmin, updateRegistration);

// Internship Submissions
router.post('/submissions', authenticate, submitInternship);
router.get('/student/submissions', authenticate, getMySubmissions);
router.get('/student/submissions/:internship_id', authenticate, getMySubmissionForInternship);
router.put('/submissions/:id', authenticate, updateSubmission);

// Admin: Internship Submissions
router.get('/admin/submissions/all', authenticate, requireAdmin, getAllSubmissions);
router.get('/admin/submissions/stats', authenticate, requireAdmin, getSubmissionStats);
router.post('/admin/submissions/:id/approve', authenticate, requireAdmin, approveSubmission);
router.post('/admin/submissions/:id/reject', authenticate, requireAdmin, rejectSubmission);

module.exports = router;
