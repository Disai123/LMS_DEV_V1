'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add total_internship_points
    await queryInterface.addColumn('student_scores', 'total_internship_points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    // Add internships_completed_count
    await queryInterface.addColumn('student_scores', 'internships_completed_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    // Add pq_score
    await queryInterface.addColumn('student_scores', 'pq_score', {
      type: Sequelize.DECIMAL(4, 2),
      defaultValue: 0.00,
      allowNull: false
    });

    // Update the PostgreSQL ENUM for student achievements to include new project types
    try {
      await queryInterface.sequelize.query('ALTER TYPE "enum_student_achievements_achievement_type" ADD VALUE IF NOT EXISTS \'realtime_project_completion\';');
      await queryInterface.sequelize.query('ALTER TYPE "enum_student_achievements_achievement_type" ADD VALUE IF NOT EXISTS \'internship_completion\';');
    } catch (error) {
      console.warn("Could not add missing enum values to achievements (might already exist)");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('student_scores', 'total_internship_points');
    await queryInterface.removeColumn('student_scores', 'internships_completed_count');
    await queryInterface.removeColumn('student_scores', 'pq_score');
  }
};
