'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      category: {
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

    // Add indexes (name index is already created by unique: true constraint)
    // Wrapping in try-catch to handle existing indexes gracefully
    const indexes = [
      { columns: ['category'], name: 'products_category' },
      { columns: ['is_active'], name: 'products_is_active' },
      { columns: ['created_at'], name: 'products_created_at' }
    ];

    for (const index of indexes) {
      try {
        await queryInterface.addIndex('products', index.columns, { name: index.name });
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};

