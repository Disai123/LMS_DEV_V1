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
    await addColumnSafe(queryInterface, Sequelize, 'users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'location', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'student_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'date_of_birth', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'education_level', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'college_name', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'graduation_year', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'specialization', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'joined_at', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'emergency_contact_name', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'emergency_contact_phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    await addColumnSafe(queryInterface, Sequelize, 'users', 'notification_preferences', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        email_course_updates: true,
        email_certificates: true,
        email_marketing: false
      }
    });

    console.log('✅ Profile fields migration complete');
  },

  down: async () => {
    console.log('⚠️ Skipping column removal for data safety');
  }
};
