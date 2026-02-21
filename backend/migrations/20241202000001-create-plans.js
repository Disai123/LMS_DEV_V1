'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('plans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00
            },
            currency: {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: 'INR'
            },
            features: {
                type: Sequelize.JSON,
                allowNull: true,
                comment: 'List of features included in the plan'
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

        // Seed initial plans
        await queryInterface.bulkInsert('plans', [
            {
                name: 'free',
                description: 'Free Plan - Basic Course Access',
                price: 0.00,
                currency: 'INR',
                features: JSON.stringify(['Access to Courses', 'Ecommerce Web Project', 'Ecommerce Mobile Project']),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'basic',
                description: 'Basic Plan - Full Project Access',
                price: 599.00,
                currency: 'INR',
                features: JSON.stringify(['Access to Courses', 'All Realtime Projects', 'AI Learning Assistant', 'Data Analytics Dashboard']),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('plans');
    }
};
