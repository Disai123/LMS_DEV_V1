'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('internships', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: '4-12 Weeks'
      },
      mode: {
        type: Sequelize.ENUM('Online', 'Offline', 'Hybrid'),
        allowNull: false,
        defaultValue: 'Online'
      },
      certificate_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Completion'
      },
      domains_offered: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      key_features: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      outcomes: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      highlights: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'active'
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      max_registrations: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      current_registrations: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }
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

    await queryInterface.addIndex('internships', ['status']);
    await queryInterface.addIndex('internships', ['is_published']);
    await queryInterface.addIndex('internships', ['created_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('internships');
  }
};
