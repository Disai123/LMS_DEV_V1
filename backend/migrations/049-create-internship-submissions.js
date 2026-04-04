'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('internship_submissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      internship_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'internships', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      internship_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      github_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      drive_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      documentation_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'revision_requested'),
        defaultValue: 'pending',
        allowNull: false
      },
      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      admin_feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      points_awarded: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
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

    await queryInterface.addIndex('internship_submissions', ['student_id']);
    await queryInterface.addIndex('internship_submissions', ['internship_id']);
    await queryInterface.addIndex('internship_submissions', ['status']);
    await queryInterface.addIndex('internship_submissions', ['student_id', 'internship_id'], {
      unique: true,
      name: 'unique_student_internship_submission'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('internship_submissions');
  }
};
