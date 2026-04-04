const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');

// Public route for submitting messages
router.post('/', contactController.submitContactMessage);

// Admin route for viewing messages
router.get('/', authenticate, contactController.getContactMessages);

module.exports = router;
