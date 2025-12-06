const { Order, OrderItem, Product, CartItem } = require('../models');
const { generateOrderNumber, calculateTotal } = require('../utils/helpers');
const logger = require('../utils/logger');
const { sequelize } = require('../models');

/**
 * Get user's orders
 */
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    next(error);
  }
};

/**
 * Get single order by ID
 */
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        userId: req.user.id // Ensure user can only view their own orders
      },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image', 'description']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Get order error:', error);
    next(error);
  }
};

/**
 * Create new order from cart items
 */
const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, shippingInfo, total } = req.body;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Order must have at least one item'
      });
    }

    // Verify all products exist and have stock
    const productIds = items.map(item => item.id);
    const products = await Product.findAll({
      where: { id: productIds, isActive: true },
      transaction
    });

    if (products.length !== items.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'One or more products not found'
      });
    }

    // Check stock and create order items
    const orderItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = products.find(p => p.id === item.id);

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: item.price,
        productName: product.name
      });

      // Update product stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction }
      );
    }

    // Create order
    const order = await Order.create(
      {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        total: parseFloat(total),
        status: 'PENDING',
        shippingAddress: shippingInfo,
        paymentStatus: 'PENDING'
      },
      { transaction }
    );

    // Create order items
    const createdOrderItems = await Promise.all(
      orderItems.map(item =>
        OrderItem.create(
          {
            orderId: order.id,
            ...item
          },
          { transaction }
        )
      )
    );

    // Clear cart
    await CartItem.destroy({
      where: { userId: req.user.id },
      transaction
    });

    await transaction.commit();

    // Fetch order with items
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Create order error:', error);
    next(error);
  }
};

/**
 * Update order status (Admin only)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const updateData = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    await order.update(updateData);

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus
};

