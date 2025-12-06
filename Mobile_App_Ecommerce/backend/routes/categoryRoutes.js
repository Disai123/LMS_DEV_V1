const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories (Public)
router.get('/', categoryController.getCategories);

module.exports = router;

