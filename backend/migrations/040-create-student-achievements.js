'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table already exists
    const [tableExists] = await queryInterface.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'student_achievements' AND table_schema = 'public'
    `);

    if (tableExists.length > 0) {
      console.log('Student_achievements table already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('student_achievements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      achievement_type: {
        type: Sequelize.ENUM('course_completion', 'project_approval', 'hackathon_approval', 'master_certificate'),
        allowNull: false
      },
      source_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'course_id, project_id, or hackathon_id'
      },
      source_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'course, project, hackathon, or master_certificate'
      },
      points_awarded: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      awarded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      awarded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Admin who approved (for projects/hackathons)'
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
        comment: 'Stores additional info (course name, project name, etc.)'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Can be revoked if needed'
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
    await queryInterface.addIndex('student_achievements', ['student_id']);
    await queryInterface.addIndex('student_achievements', ['achievement_type']);
    await queryInterface.addIndex('student_achievements', ['source_id']);
    await queryInterface.addIndex('student_achievements', ['is_active']);
    await queryInterface.addIndex('student_achievements', ['awarded_at']);

    // Add unique constraint to prevent duplicates
    await queryInterface.addIndex('student_achievements', {
      fields: ['student_id', 'achievement_type', 'source_id'],
      unique: true,
      name: 'unique_student_achievement'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_achievements');
  }
};

