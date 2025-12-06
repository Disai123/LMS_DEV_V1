const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { productSchemas, commonSchemas } = require('../utils/validation');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// GET /api/products (Public, with optional auth for personalized results)
router.get('/', optionalAuth, validate(commonSchemas.pagination, 'query'), productController.getProducts);

// GET /api/products/:id (Public)
router.get('/:id', optionalAuth, productController.getProduct);

// POST /api/products (Protected, Admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadSingle,
  validate(productSchemas.create, 'body'),
  productController.createProduct
);

// PUT /api/products/:id (Protected, Admin only)
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  uploadSingle,
  validate(productSchemas.update, 'body'),
  productController.updateProduct
);

// DELETE /api/products/:id (Protected, Admin only)
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

module.exports = router;

