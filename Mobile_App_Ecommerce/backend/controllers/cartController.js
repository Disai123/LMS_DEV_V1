const { CartItem, Product } = require('../models');
const logger = require('../utils/logger');

/**
 * Get user's cart
 */
const getCart = async (req, res, next) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock', 'isActive'],
          where: { isActive: true }
        }
      ]
    });

    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    logger.error('Get cart error:', error);
    next(error);
  }
};

/**
 * Add item to cart
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const product = await Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock available'
      });
    }

    // Find or create cart item
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        userId: req.user.id,
        productId: productId
      },
      defaults: {
        userId: req.user.id,
        productId: productId,
        quantity: parseInt(quantity)
      }
    });

    // If cart item exists, update quantity
    if (!created) {
      const newQuantity = cartItem.quantity + parseInt(quantity);
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock available'
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    }

    // Fetch cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedCartItem,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    logger.error('Add to cart error:', error);
    next(error);
  }
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId: productId
      },
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock available'
      });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    // Fetch updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedCartItem,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    logger.error('Update cart item error:', error);
    next(error);
  }
};

/**
 * Remove item from cart
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId: productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    logger.error('Remove from cart error:', error);
    next(error);
  }
};

/**
 * Clear entire cart
 */
const clearCart = async (req, res, next) => {
  try {
    await CartItem.destroy({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    logger.error('Clear cart error:', error);
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

