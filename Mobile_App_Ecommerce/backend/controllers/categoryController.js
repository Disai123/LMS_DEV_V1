const { Product, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Get all active categories
 */
const getCategories = async (req, res, next) => {
  try {
    // Get distinct categories from active products
    const categories = await Product.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      where: {
        category: { [Op.ne]: null },
        isActive: true
      },
      order: [['category', 'ASC']]
    });

    const categoryList = categories
      .map(cat => cat.category)
      .filter(cat => cat && cat.trim() !== '');

    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    next(error);
  }
};

module.exports = {
  getCategories
};

