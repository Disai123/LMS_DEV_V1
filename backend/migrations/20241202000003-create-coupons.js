'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('coupons', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'plans',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            discount_percentage: {
                type: Sequelize.INTEGER,
                defaultValue: 100, // Default to 100% off (free)
                allowNull: false
            },
            max_uses: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            uses_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('coupons');
    }
};
