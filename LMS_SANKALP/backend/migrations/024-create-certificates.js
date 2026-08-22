'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table already exists
    const [tableExists] = await queryInterface.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'certificates' AND table_schema = 'public'
    `);

    if (tableExists.length > 0) {
      console.log('Certificates table already exists, checking for new columns...');

      // Add realtime_project_submission_id if missing
      const [rtColExists] = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'certificates' AND column_name = 'realtime_project_submission_id' AND table_schema = 'public'
      `);
      if (rtColExists.length === 0) {
        await queryInterface.addColumn('certificates', 'realtime_project_submission_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'realtime_project_submissions', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
        await queryInterface.addIndex('certificates', ['realtime_project_submission_id']);
        console.log('Added realtime_project_submission_id column');
      }

      // Add certificate_type if missing
      const [typeColExists] = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'certificates' AND column_name = 'certificate_type' AND table_schema = 'public'
      `);
      if (typeColExists.length === 0) {
        await queryInterface.addColumn('certificates', 'certificate_type', {
          type: Sequelize.ENUM('course', 'realtime_project'),
          allowNull: false,
          defaultValue: 'course'
        });
        console.log('Added certificate_type column');
      }

      // Make course_id nullable if it is not already
      await queryInterface.sequelize.query(`
        ALTER TABLE certificates ALTER COLUMN course_id DROP NOT NULL;
      `).catch(() => console.log('course_id already nullable or could not alter'));

      return;
    }

    await queryInterface.createTable('certificates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      realtime_project_submission_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'realtime_project_submissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      certificate_type: {
        type: Sequelize.ENUM('course', 'realtime_project'),
        allowNull: false,
        defaultValue: 'course'
      },
      test_attempt_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'test_attempts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      certificate_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      issued_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      certificate_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      verification_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('certificates', ['student_id']);
    await queryInterface.addIndex('certificates', ['course_id']);
    await queryInterface.addIndex('certificates', ['test_attempt_id']);
    await queryInterface.addIndex('certificates', ['realtime_project_submission_id']);
    await queryInterface.addIndex('certificates', ['certificate_number']);
    await queryInterface.addIndex('certificates', ['verification_code']);
    await queryInterface.addIndex('certificates', ['is_valid']);
    await queryInterface.addIndex('certificates', ['certificate_type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('certificates');
  }
};
