'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      product_name: {
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

    // Add indexes with error handling for existing indexes
    const indexes = [
      { columns: ['order_id'], name: 'order_items_order_id' },
      { columns: ['product_id'], name: 'order_items_product_id' }
    ];

    for (const index of indexes) {
      try {
        await queryInterface.addIndex('order_items', index.columns, { name: index.name });
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  }
};

