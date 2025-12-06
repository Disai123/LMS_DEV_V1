'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
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
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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
      { 
        columns: ['user_id', 'product_id'], 
        name: 'cart_items_user_product_unique',
        unique: true 
      },
      { columns: ['user_id'], name: 'cart_items_user_id' },
      { columns: ['product_id'], name: 'cart_items_product_id' }
    ];

    for (const index of indexes) {
      try {
        const options = { name: index.name };
        if (index.unique) {
          options.unique = true;
        }
        await queryInterface.addIndex('cart_items', index.columns, options);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_items');
  }
};

