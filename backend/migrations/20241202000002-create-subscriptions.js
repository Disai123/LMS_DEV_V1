'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('subscriptions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'plans',
                    key: 'id'
                },
                onDelete: 'RESTRICT'
            },
            status: {
                type: Sequelize.ENUM('active', 'expired', 'cancelled'),
                defaultValue: 'active'
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            payment_id: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add unique constraint for active subscription per user?
        // Not strictly required if we want to store history, but usually we query for the latest active one.
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('subscriptions');
    }
};
