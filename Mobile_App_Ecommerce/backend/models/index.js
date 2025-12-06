const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true
    },
    quoteIdentifiers: false
  }
);

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Product = require('./Product')(sequelize, Sequelize.DataTypes);
const Order = require('./Order')(sequelize, Sequelize.DataTypes);
const OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
const CartItem = require('./CartItem')(sequelize, Sequelize.DataTypes);

// Define associations
const models = { User, Product, Order, OrderItem, CartItem };

Object.keys(models).forEach(modelName => {
  if (typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Order,
  OrderItem,
  CartItem
};

