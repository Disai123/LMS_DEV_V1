'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      google_id: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: {
          len: [6, 255]
        }
      },
      role: {
        type: Sequelize.ENUM('admin', 'student'),
        defaultValue: 'student',
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      last_login: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      plan_type: {
        type: Sequelize.ENUM('free', 'premium'),
        defaultValue: 'free',
        allowNull: false,
        comment: 'Student subscription plan type'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      student_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        allowNull: true
      },
      education_level: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      college_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      graduation_year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      specialization: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      joined_at: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      emergency_contact_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      emergency_contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      notification_preferences: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {
          email_course_updates: true,
          email_certificates: true,
          email_marketing: false
        }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create indexes (with error handling for existing indexes)
    try {
      await queryInterface.addIndex('users', ['email'], { name: 'users_email' });
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    try {
      await queryInterface.addIndex('users', ['google_id'], { name: 'users_google_id' });
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    try {
      await queryInterface.addIndex('users', ['role'], { name: 'users_role' });
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }

    try {
      await queryInterface.addIndex('users', ['is_active'], { name: 'users_is_active' });
    } catch (error) {
      if (!error.message.includes('already exists')) {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback disabled to preserve data
  }
};
