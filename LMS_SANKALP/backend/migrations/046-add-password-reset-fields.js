'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'reset_password_token', {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: null
        });

        await queryInterface.addColumn('users', 'reset_password_expires', {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        });

        // Add index for faster token lookups
        await queryInterface.addIndex('users', ['reset_password_token'], {
            name: 'idx_users_reset_password_token'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('users', 'idx_users_reset_password_token');
        await queryInterface.removeColumn('users', 'reset_password_expires');
        await queryInterface.removeColumn('users', 'reset_password_token');
    }
};
