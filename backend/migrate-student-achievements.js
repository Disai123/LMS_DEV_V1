const { sequelize } = require('./models');

async function migrateDatabase() {
    try {
        console.log('═'.repeat(60));
        console.log('  DATABASE MIGRATION: StudentAchievement Model Update');
        console.log('═'.repeat(60));
        console.log('');

        console.log('Step 1: Adding \'realtime_project_completion\' to achievement_type ENUM...');

        try {
            await sequelize.query(`
        ALTER TYPE "enum_student_achievements_achievement_type" 
        ADD VALUE IF NOT EXISTS 'realtime_project_completion'
      `);
            console.log('✓ ENUM value added');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('✓ ENUM value already exists');
            } else {
                throw error;
            }
        }
        console.log('');

        console.log('Step 2: Changing source_id from INTEGER to STRING...');
        await sequelize.query(`
      ALTER TABLE student_achievements 
      ALTER COLUMN source_id TYPE VARCHAR(255) USING source_id::VARCHAR(255)
    `);
        console.log('✓ Column type changed');
        console.log('');

        console.log('═'.repeat(60));
        console.log('  ✅ MIGRATION COMPLETE!');
        console.log('═'.repeat(60));
        console.log('');
        console.log('Now you can run: node award-missing-points.js');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration ERROR:', error.message);
        console.error(error);
        process.exit(1);
    }
}

migrateDatabase();
