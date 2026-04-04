'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 0. Add display_name column if not exists
        const tableInfo = await queryInterface.describeTable('plans');
        if (!tableInfo.display_name) {
            await queryInterface.addColumn('plans', 'display_name', {
                type: Sequelize.STRING,
                allowNull: true
            });
        }

        // 1. Deactivate all existing plans first to avoid conflicts
        await queryInterface.sequelize.query(
            `UPDATE plans SET is_active = false`
        );

        // 2. Insert or Update Plans
        const plans = [
            {
                name: 'starter', // Internal name
                display_name: 'Starter Plan',
                description: 'Perfect for individuals just getting started.',
                price: 0.00,
                currency: 'INR',
                features: JSON.stringify([
                    'Access to two courses',
                    'Access for limited Realtime Projects',
                    'Limited Platform Access',
                    'Community Support'
                ]),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'basic',
                display_name: 'Basic Plan',
                description: 'For learners and early innovators who want training + mentorship.',
                price: 299.00,
                currency: 'INR',
                features: JSON.stringify([
                    'Includes Starter Plan',
                    'Unlock All courses',
                    'Access to four Realtime Projects',
                    'Full Management and Analytics Support'
                ]),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'pro',
                display_name: 'Pro Plan',
                description: 'Built for students, professionals, startups, and industries.',
                price: 799.00,
                currency: 'INR',
                features: JSON.stringify([
                    'Includes Basic Plan & Starter Plan',
                    'Unlock All 10 Realtime Projects & Free Workshops',
                    'Full Idea Management Suite',
                    '1:1 Mentorship and Engagement',

                ]),
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const plan of plans) {
            // Check if plan exists by name (inactive or active)
            const [existing] = await queryInterface.sequelize.query(
                `SELECT id FROM plans WHERE name = '${plan.name}'`
            );

            if (existing.length > 0) {
                // Update
                await queryInterface.bulkUpdate('plans',
                    {
                        description: plan.description,
                        price: plan.price,
                        features: plan.features,
                        is_active: true,
                        updated_at: new Date()
                    },
                    { name: plan.name }
                );
            } else {
                // Insert
                await queryInterface.bulkInsert('plans', [plan]);
            }
        }

        console.log('✅ Updated plans: Starter, Basic, Pro');

        // 3. Create payment_requests table if not exists
        const tables = await queryInterface.showAllTables();
        if (!tables.includes('payment_requests')) {
            await queryInterface.createTable('payment_requests', {
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
                transaction_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    unique: true,
                    comment: 'UPI UTR / Transaction ID submitted by student'
                },
                amount: {
                    type: Sequelize.DECIMAL(10, 2),
                    allowNull: false,
                    comment: 'Amount paid by student'
                },
                status: {
                    type: Sequelize.ENUM('pending', 'approved', 'rejected'),
                    defaultValue: 'pending',
                    allowNull: false
                },
                admin_notes: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Optional note from admin on approval/rejection'
                },
                approved_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onDelete: 'SET NULL'
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

            console.log('✅ Created payment_requests table');
        }
    },

    async down(queryInterface, Sequelize) {
        // Drop payment_requests table
        await queryInterface.dropTable('payment_requests');

        // Deactivate new plans
        await queryInterface.sequelize.query(
            `UPDATE plans SET is_active = false WHERE name IN ('starter', 'basic', 'pro')`
        );

        // Reactivate old basic (optional, just leaving it clean)

        // Remove display_name column
        const tableInfo = await queryInterface.describeTable('plans');
        if (tableInfo.display_name) {
            await queryInterface.removeColumn('plans', 'display_name');
        }
    }
};
