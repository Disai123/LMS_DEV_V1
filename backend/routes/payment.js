const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/plans', paymentController.getPlans);

// Protected routes (student + admin)
router.use(authenticate);

// Student routes
router.get('/subscription', paymentController.getMySubscription);
router.post('/submit-transaction', paymentController.submitPaymentRequest);

// Admin routes
router.get('/admin/stats', paymentController.getSubscriptionStats);
router.get('/admin/subscriptions/all', paymentController.getAllSubscriptions);
router.get('/admin/payment-requests', paymentController.getPaymentRequests);
router.post('/admin/payment-requests/:id/approve', paymentController.approvePaymentRequest);
router.post('/admin/payment-requests/:id/reject', paymentController.rejectPaymentRequest);

module.exports = router;
