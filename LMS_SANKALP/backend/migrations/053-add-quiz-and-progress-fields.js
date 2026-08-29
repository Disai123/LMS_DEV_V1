'use strict';

const addColumnSafe = async (queryInterface, Sequelize, table, column, definition) => {
  try {
    await queryInterface.addColumn(table, column, definition);
    console.log(`Added ${column} to ${table}`);
  } catch (error) {
    console.log(`${column} on ${table} skipped:`, error.message);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await addColumnSafe(queryInterface, Sequelize, 'course_tests', 'test_type', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'final_exam'
    });

    await addColumnSafe(queryInterface, Sequelize, 'course_tests', 'chapter_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'course_chapters', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await addColumnSafe(queryInterface, Sequelize, 'chapter_progress', 'content_completed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await addColumnSafe(queryInterface, Sequelize, 'chapter_progress', 'quiz_passed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await addColumnSafe(queryInterface, Sequelize, 'chapter_progress', 'quiz_best_score', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'chapter_progress', 'quiz_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await addColumnSafe(queryInterface, Sequelize, 'chapter_progress', 'quiz_passed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    console.log('Migration 053 complete');
  },

  down: async () => {
    console.log('Skipping rollback for migration 053');
  }
};
