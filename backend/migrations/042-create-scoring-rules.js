'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table already exists
    const [tableExists] = await queryInterface.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'scoring_rules' AND table_schema = 'public'
    `);

    if (tableExists.length > 0) {
      console.log('Scoring_rules table already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('scoring_rules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rule_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'course_completion, project_approval, hackathon_approval, master_certificate'
      },
      rule_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'default, beginner, intermediate, advanced, ranking_1, etc.'
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
        comment: 'Additional conditions or notes'
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

    // Add unique constraint
    await queryInterface.addIndex('scoring_rules', {
      fields: ['rule_type', 'rule_key'],
      unique: true,
      name: 'unique_scoring_rule'
    });

    // Add indexes
    await queryInterface.addIndex('scoring_rules', ['rule_type']);
    await queryInterface.addIndex('scoring_rules', ['is_active']);

    // Seed default scoring rules
    const defaultRules = [
      // Course completion points
      { rule_type: 'course_completion', rule_key: 'default', points: 50, is_active: true },
      { rule_type: 'course_completion', rule_key: 'beginner', points: 40, is_active: true },
      { rule_type: 'course_completion', rule_key: 'intermediate', points: 60, is_active: true },
      { rule_type: 'course_completion', rule_key: 'advanced', points: 80, is_active: true },
      
      // Project approval points
      { rule_type: 'project_approval', rule_key: 'default', points: 200, is_active: true },
      { rule_type: 'project_approval', rule_key: 'beginner', points: 150, is_active: true },
      { rule_type: 'project_approval', rule_key: 'intermediate', points: 250, is_active: true },
      { rule_type: 'project_approval', rule_key: 'advanced', points: 350, is_active: true },
      
      // Hackathon approval points
      { rule_type: 'hackathon_approval', rule_key: 'participation', points: 200, is_active: true },
      { rule_type: 'hackathon_approval', rule_key: 'ranking_1', points: 1000, is_active: true },
      { rule_type: 'hackathon_approval', rule_key: 'ranking_2', points: 750, is_active: true },
      { rule_type: 'hackathon_approval', rule_key: 'ranking_3', points: 500, is_active: true },
      { rule_type: 'hackathon_approval', rule_key: 'top_10', points: 400, is_active: true },
      { rule_type: 'hackathon_approval', rule_key: 'top_20', points: 300, is_active: true },
      
      // Master certificate bonus
      { rule_type: 'master_certificate', rule_key: 'default', points: 500, is_active: true }
    ];

    await queryInterface.bulkInsert('scoring_rules', defaultRules.map(rule => ({
      ...rule,
      created_at: new Date(),
      updated_at: new Date()
    })));

    console.log(`Inserted ${defaultRules.length} default scoring rules`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('scoring_rules');
  }
};

