const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 100 characters'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(200).required().messages({
      'any.required': 'Product name is required',
      'string.min': 'Product name must be at least 1 character',
      'string.max': 'Product name must be less than 200 characters'
    }),
    description: Joi.string().max(1000).optional().allow(null, '').messages({
      'string.max': 'Description must be less than 1000 characters'
    }),
    price: Joi.number().positive().required().messages({
      'any.required': 'Price is required',
      'number.positive': 'Price must be a positive number'
    }),
    image: Joi.string().uri().optional().allow(null, '').messages({
      'string.uri': 'Image must be a valid URL'
    }),
    stock: Joi.number().integer().min(0).optional().default(0).messages({
      'number.min': 'Stock must be 0 or greater',
      'number.integer': 'Stock must be an integer'
    }),
    category: Joi.string().max(100).optional().allow(null, '').messages({
      'string.max': 'Category must be less than 100 characters'
    }),
    isActive: Joi.boolean().optional().default(true)
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional().allow(null, ''),
    price: Joi.number().positive().optional(),
    image: Joi.string().uri().optional().allow(null, ''),
    stock: Joi.number().integer().min(0).optional(),
    category: Joi.string().max(100).optional().allow(null, ''),
    isActive: Joi.boolean().optional()
  })
};

// Cart validation schemas
const cartSchemas = {
  addToCart: Joi.object({
    productId: Joi.string().uuid().required().messages({
      'any.required': 'Product ID is required',
      'string.guid': 'Product ID must be a valid UUID'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'any.required': 'Quantity is required',
      'number.min': 'Quantity must be at least 1',
      'number.integer': 'Quantity must be an integer'
    })
  }),

  updateQuantity: Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
      'any.required': 'Quantity is required',
      'number.min': 'Quantity must be at least 1',
      'number.integer': 'Quantity must be an integer'
    })
  })
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).min(1).required().messages({
      'any.required': 'Order items are required',
      'array.min': 'Order must have at least one item'
    }),
    shippingInfo: Joi.object({
      name: Joi.string().min(2).required(),
      address: Joi.string().min(5).required(),
      city: Joi.string().min(2).required(),
      state: Joi.string().min(2).required(),
      zip: Joi.string().min(5).required(),
      country: Joi.string().min(2).required(),
      phone: Joi.string().optional()
    }).required(),
    total: Joi.number().positive().required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED').required(),
    trackingNumber: Joi.string().optional()
  })
};

// Common validation schemas
const commonSchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    search: Joi.string().optional().allow(''),
    category: Joi.string().optional().allow(''),
    featured: Joi.boolean().optional(),
    sort: Joi.string().optional().default('created_at'),
    order: Joi.string().valid('ASC', 'DESC').optional().default('DESC')
  }),

  idParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  productIdParam: Joi.object({
    productId: Joi.string().uuid().required()
  })
};

module.exports = {
  userSchemas,
  productSchemas,
  cartSchemas,
  orderSchemas,
  commonSchemas
};

