'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create enum type for order status
    await queryInterface.sequelize.query(`
      CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
    `);

    // Create enum type for payment status
    await queryInterface.sequelize.query(`
      CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
    `);

    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING'
      },
      shipping_address: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
        defaultValue: 'PENDING'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tracking_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes (order_number index is already created by unique: true constraint)
    // Wrapping in try-catch to handle existing indexes gracefully
    const indexes = [
      { columns: ['user_id'], name: 'orders_user_id' },
      { columns: ['status'], name: 'orders_status' },
      { columns: ['payment_status'], name: 'orders_payment_status' },
      { columns: ['created_at'], name: 'orders_created_at' }
    ];

    for (const index of indexes) {
      try {
        await queryInterface.addIndex('orders', index.columns, { name: index.name });
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS order_status;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS payment_status;');
  }
};

