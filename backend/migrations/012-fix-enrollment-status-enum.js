'use strict';

const addColumnSafe = async (queryInterface, Sequelize, table, column, definition) => {
  try {
    await queryInterface.addColumn(table, column, definition);
    console.log(`✅ Added ${column} to ${table}`);
  } catch (error) {
    console.log(`ℹ️ ${column} on ${table} skipped:`, error.message);
  }
};

const addEnumValueSafe = async (queryInterface, enumName, value) => {
  try {
    await queryInterface.sequelize.query(
      `ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '${value}'`
    );
    console.log(`✅ Added enum value ${value} to ${enumName}`);
  } catch (error) {
    console.log(`ℹ️ Enum value ${value} skipped:`, error.message);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [results] = await queryInterface.sequelize.query(`
      SELECT column_name, udt_name
      FROM information_schema.columns
      WHERE table_name = 'enrollments'
      AND column_name = 'status'
    `);

    if (results.length === 0) {
      console.log('Status column does not exist in enrollments table, skipping migration');
      return;
    }

    const enumName = results[0]?.udt_name;
    if (enumName) {
      await addEnumValueSafe(queryInterface, enumName, 'content_completed');
      await addEnumValueSafe(queryInterface, enumName, 'certified');
    }

    await addColumnSafe(queryInterface, Sequelize, 'enrollments', 'test_passed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Migrate legacy completed rows: certified if certificate exists, else content_completed
    try {
      await queryInterface.sequelize.query(`
        UPDATE enrollments e
        SET status = 'certified', test_passed = true
        WHERE e.status = 'completed'
        AND EXISTS (
          SELECT 1 FROM certificates c
          WHERE c.student_id = e.student_id
          AND c.course_id = e.course_id
          AND c.certificate_type = 'course'
        )
      `);

      await queryInterface.sequelize.query(`
        UPDATE enrollments
        SET status = 'content_completed'
        WHERE status = 'completed'
      `);

      console.log('✅ Migrated legacy enrollment statuses');
    } catch (error) {
      console.log('ℹ️ Legacy status migration skipped:', error.message);
    }
  },

  down: async () => {
    console.log('⚠️ Skipping enrollment enum rollback for data safety');
  }
};
