'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('internship_registrations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      internship_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'internships', key: 'id' },
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('registered', 'in_progress', 'completed', 'dropped'),
        allowNull: false,
        defaultValue: 'registered'
      },
      registered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      certificate_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('internship_registrations', ['internship_id']);
    await queryInterface.addIndex('internship_registrations', ['student_id']);
    await queryInterface.addIndex('internship_registrations', ['internship_id', 'student_id'], {
      unique: true,
      name: 'unique_internship_student'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('internship_registrations');
  }
};
