const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const documentController = require('../controllers/documentController');
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.get('/:projectId/documents', documentController.getProjectDocuments);
router.get('/documents/:id', documentController.getDocumentById);
router.get('/documents/:id/download', documentController.downloadDocument);
router.get('/:projectId/videos', videoController.getProjectVideos);
router.get('/videos/:id', videoController.getVideoById);
router.post('/videos/:id/view', videoController.incrementViewCount);

// Student routes - require authentication
router.use(auth.authenticate);

// Project submission (Student only)
router.post('/:projectId/submit', projectController.submitProject);

// Admin routes - require admin role
router.use(auth.requireAdmin);

// Project CRUD operations
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.patch('/:id/status', projectController.toggleProjectStatus);
router.get('/admin/stats', projectController.getProjectStats);
router.post('/admin/seed', projectController.seedProjects);

// Document management
router.post('/:projectId/documents', documentController.upload.single('file'), documentController.uploadDocument);
router.put('/documents/:id', documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);
router.get('/admin/documents/stats', documentController.getDocumentStats);

// Video management
router.post('/:projectId/videos', videoController.createVideo);
router.put('/videos/:id', videoController.updateVideo);
router.delete('/videos/:id', videoController.deleteVideo);
router.get('/admin/videos/stats', videoController.getVideoStats);

// Project submission management (Admin only)
router.get('/admin/submissions', projectController.getProjectSubmissions);
router.post('/:projectId/submissions/:studentId/approve', projectController.approveProjectSubmission);
router.post('/:projectId/submissions/:studentId/reject', projectController.rejectProjectSubmission);

module.exports = router;