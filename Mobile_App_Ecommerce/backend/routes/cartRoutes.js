const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { cartSchemas, productIdParam } = require('../utils/validation');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart
router.get('/', cartController.getCart);

// POST /api/cart
router.post('/', validate(cartSchemas.addToCart, 'body'), cartController.addToCart);

// PUT /api/cart/:productId
router.put(
  '/:productId',
  validate(productIdParam, 'params'),
  validate(cartSchemas.updateQuantity, 'body'),
  cartController.updateCartItem
);

// DELETE /api/cart/:productId
router.delete('/:productId', validate(productIdParam, 'params'), cartController.removeFromCart);

// DELETE /api/cart (Clear entire cart)
router.delete('/', cartController.clearCart);

module.exports = router;

