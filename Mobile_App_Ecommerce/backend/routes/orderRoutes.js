const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { orderSchemas, commonSchemas, idParam } = require('../utils/validation');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET /api/orders (User's orders)
router.get('/', validate(commonSchemas.pagination, 'query'), orderController.getOrders);

// GET /api/orders/:id (Single order)
router.get('/:id', validate(idParam, 'params'), orderController.getOrder);

// POST /api/orders (Create order)
router.post('/', validate(orderSchemas.create, 'body'), orderController.createOrder);

// PUT /api/orders/:id (Update order status - Admin only)
router.put(
  '/:id',
  requireAdmin,
  validate(idParam, 'params'),
  validate(orderSchemas.updateStatus, 'body'),
  orderController.updateOrderStatus
);

module.exports = router;

