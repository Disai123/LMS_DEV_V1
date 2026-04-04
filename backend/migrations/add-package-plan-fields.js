'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add tier_order to plans
    await queryInterface.addColumn('plans', 'tier_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0=free, 1=basic, 2=pro'
    }).catch(() => console.log('tier_order already exists on plans'));

    // 2. Add required_plan to courses
    try {
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE enum_courses_required_plan AS ENUM ('free', 'basic', 'pro');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      await queryInterface.addColumn('courses', 'required_plan', {
        type: Sequelize.ENUM('free', 'basic', 'pro'),
        allowNull: false,
        defaultValue: 'free'
      });
    } catch (err) {
      if (!err.message.includes('already exists')) throw err;
      console.log('required_plan already exists on courses');
    }

    // 3. Add required_plan to projects
    try {
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE enum_projects_required_plan AS ENUM ('free', 'basic', 'pro');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      await queryInterface.addColumn('projects', 'required_plan', {
        type: Sequelize.ENUM('free', 'basic', 'pro'),
        allowNull: false,
        defaultValue: 'free'
      });
    } catch (err) {
      if (!err.message.includes('already exists')) throw err;
      console.log('required_plan already exists on projects');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('plans', 'tier_order').catch(() => {});
    await queryInterface.removeColumn('courses', 'required_plan').catch(() => {});
    await queryInterface.removeColumn('projects', 'required_plan').catch(() => {});
  }
};
