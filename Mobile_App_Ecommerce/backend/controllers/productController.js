const { Product, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Get all products with pagination and filters
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      featured,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      isActive: true
    };

    if (category && category !== 'All' && category !== '') {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (featured === 'true') {
      where.stock = { [Op.gt]: 0 };
    }

    // Get products and total count
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sort, order.toUpperCase()]],
      attributes: { exclude: [] }
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    next(error);
  }
};

/**
 * Get single product by ID
 */
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (!product.isActive && req.user?.role !== 'admin') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error('Get product error:', error);
    next(error);
  }
};

/**
 * Create new product (Admin only)
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      image: req.file ? `/uploads/products/${req.file.filename}` : req.body.image
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    logger.error('Create product error:', error);
    next(error);
  }
};

/**
 * Update product (Admin only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    await product.update(updateData);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    logger.error('Update product error:', error);
    next(error);
  }
};

/**
 * Delete product (Admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Soft delete - set isActive to false
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

