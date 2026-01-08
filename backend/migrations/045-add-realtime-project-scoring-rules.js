const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add scoring rules for realtime project completion
        await queryInterface.bulkInsert('scoring_rules', [
            {
                rule_type: 'realtime_project_completion',
                rule_key: 'beginner',
                points: 200,
                is_active: true,
                metadata: JSON.stringify({ description: 'Points for completing a beginner realtime project' }),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                rule_type: 'realtime_project_completion',
                rule_key: 'intermediate',
                points: 350,
                is_active: true,
                metadata: JSON.stringify({ description: 'Points for completing an intermediate realtime project' }),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                rule_type: 'realtime_project_completion',
                rule_key: 'advanced',
                points: 500,
                is_active: true,
                metadata: JSON.stringify({ description: 'Points for completing an advanced realtime project' }),
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {
            ignoreDuplicates: true
        });

        console.log('Added scoring rules for realtime project completion');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('scoring_rules', {
            rule_type: 'realtime_project_completion'
        });
    }
};
