const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

/**
 * Production Sync Script
 * 1. Runs pending migrations
 * 2. Recalculates student scores to populate new PQ/Internship fields
 */
async function syncProduction() {
  try {
    console.log('--- Starting Production Database Sync ---');

    // 1. Run migrations
    console.log('\nStep 1: Running pending migrations...');
    try {
      const migrateOutput = execSync('npx sequelize-cli db:migrate', { encoding: 'utf-8' });
      console.log(migrateOutput);
    } catch (err) {
      console.error('Migration failed:', err.message);
      if (!err.message.includes('No migrations were executed')) {
        process.exit(1);
      }
    }

    // 2. Recalculate scores
    console.log('\nStep 2: Recalculating student scores (PQ & Internship fields)...');
    try {
      // We'll use a direct require here to avoid environment issues in the sub-process
      const { User } = require('./models');
      const scoringService = require('./services/scoringService');

      const students = await User.findAll({ where: { role: 'student' } });
      console.log(`Found ${students.length} students to recalculate.`);

      for (const student of students) {
        process.stdout.write(`Recalculating ${student.email}... `);
        await scoringService.recalculateStudentScores(student.id);
        console.log('Done.');
      }
    } catch (err) {
      console.error('Recalculation failed:', err);
    }

    console.log('\n--- Sync Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Sync Error:', error);
    process.exit(1);
  }
}

syncProduction();
