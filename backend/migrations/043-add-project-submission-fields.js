'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns already exist
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'project_progress' 
      AND column_name = 'submission_url'
    `);

    if (columns.length > 0) {
      console.log('Project submission fields already exist, skipping migration');
      return;
    }

    // Add submission fields to project_progress table
    await queryInterface.addColumn('project_progress', 'submission_url', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'URL to the submitted project (mandatory for final submission)'
    });

    await queryInterface.addColumn('project_progress', 'submitted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When the project was submitted for review'
    });

    await queryInterface.addColumn('project_progress', 'admin_approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: 'Whether admin has approved the project'
    });

    await queryInterface.addColumn('project_progress', 'approved_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Admin who approved the project'
    });

    await queryInterface.addColumn('project_progress', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'When the project was approved'
    });

    await queryInterface.addColumn('project_progress', 'points_awarded', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: 'Points awarded for this project approval'
    });

    await queryInterface.addColumn('project_progress', 'review_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Admin review notes'
    });

    // Add indexes
    await queryInterface.addIndex('project_progress', ['admin_approved']);
    await queryInterface.addIndex('project_progress', ['submitted_at']);
    await queryInterface.addIndex('project_progress', ['approved_by']);

    console.log('Added project submission fields to project_progress table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('project_progress', 'submission_url');
    await queryInterface.removeColumn('project_progress', 'submitted_at');
    await queryInterface.removeColumn('project_progress', 'admin_approved');
    await queryInterface.removeColumn('project_progress', 'approved_by');
    await queryInterface.removeColumn('project_progress', 'approved_at');
    await queryInterface.removeColumn('project_progress', 'points_awarded');
    await queryInterface.removeColumn('project_progress', 'review_notes');
  }
};

