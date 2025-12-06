'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop table if it exists to ensure clean schema
    // This handles cases where the table exists from another project or previous migration
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (tableExists && tableExists[0] && tableExists[0].exists) {
      // Drop existing table with cascade to remove dependencies
      await queryInterface.dropTable('users', { cascade: true });
    }
    
    // Now create the table with correct UUID schema
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('customer', 'admin'),
        defaultValue: 'customer'
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Add indexes (email index is already created by unique: true constraint)
    // Wrapping in try-catch to handle existing indexes gracefully
    const indexes = [
      { columns: ['role'], name: 'users_role' },
      { columns: ['is_active'], name: 'users_is_active' }
    ];

    for (const index of indexes) {
      try {
        await queryInterface.addIndex('users', index.columns, { name: index.name });
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};

