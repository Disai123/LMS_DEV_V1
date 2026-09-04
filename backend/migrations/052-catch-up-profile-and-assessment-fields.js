'use strict';

const addColumnSafe = async (queryInterface, Sequelize, table, column, definition) => {
  try {
    await queryInterface.addColumn(table, column, definition);
    console.log(`✅ Added ${column} to ${table}`);
  } catch (error) {
    console.log(`ℹ️ ${column} on ${table} skipped:`, error.message);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // --- users: extended profile fields ---
    const userColumns = [
      ['location', { type: Sequelize.STRING(255), allowNull: true }],
      ['student_id', { type: Sequelize.STRING(50), allowNull: true, unique: true }],
      ['date_of_birth', { type: Sequelize.DATEONLY, allowNull: true }],
      ['gender', { type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not_to_say'), allowNull: true }],
      ['education_level', { type: Sequelize.STRING(100), allowNull: true }],
      ['college_name', { type: Sequelize.STRING(255), allowNull: true }],
      ['graduation_year', { type: Sequelize.INTEGER, allowNull: true }],
      ['specialization', { type: Sequelize.STRING(255), allowNull: true }],
      ['joined_at', { type: Sequelize.DATEONLY, allowNull: true }],
      ['emergency_contact_name', { type: Sequelize.STRING(255), allowNull: true }],
      ['emergency_contact_phone', { type: Sequelize.STRING(20), allowNull: true }],
      ['notification_preferences', {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {
          email_course_updates: true,
          email_certificates: true,
          email_marketing: false
        }
      }]
    ];

    for (const [column, definition] of userColumns) {
      await addColumnSafe(queryInterface, Sequelize, 'users', column, definition);
    }

    // --- enrollments: test_passed ---
    await addColumnSafe(queryInterface, Sequelize, 'enrollments', 'test_passed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // --- course_tests: time limits ---
    await addColumnSafe(queryInterface, Sequelize, 'course_tests', 'time_limit_minutes', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await addColumnSafe(queryInterface, Sequelize, 'course_tests', 'max_attempts', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    console.log('✅ Catch-up migration 052 complete');
  },

  down: async () => {
    console.log('⚠️ Skipping rollback for data safety');
  }
};
