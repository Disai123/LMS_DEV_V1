'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table already exists
    const [tableExists] = await queryInterface.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'student_scores' AND table_schema = 'public'
    `);

    if (tableExists.length > 0) {
      console.log('Student_scores table already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('student_scores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      total_course_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Aggregated from student_achievements'
      },
      total_project_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Aggregated from student_achievements'
      },
      total_hackathon_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Aggregated from student_achievements'
      },
      total_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Sum of course + project + hackathon points'
      },
      courses_completed_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      projects_approved_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      hackathons_approved_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      master_certificate_issued: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      master_certificate_issued_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      master_certificate_eligibility_checked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_calculated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      version: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: 'For optimistic locking'
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

    // Add indexes
    await queryInterface.addIndex('student_scores', ['student_id'], { unique: true });
    await queryInterface.addIndex('student_scores', ['total_points']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_scores');
  }
};

