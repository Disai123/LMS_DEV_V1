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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('student_scores', 'total_internship_points');
    await queryInterface.removeColumn('student_scores', 'internships_completed_count');
    await queryInterface.removeColumn('student_scores', 'pq_score');
  }
};
