const fs = require('fs');
const path = require('path');
const { sequelize } = require('./models');

/**
 * Mark existing tables as migrated (since tables already exist from sync)
 * This fixes the issue where tables exist but Sequelize thinks migrations haven't run
 */

async function markMigrationsUp() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🔧 MARKING ALL MIGRATIONS AS UP');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Dynamically read migrations from the directory
    const migrationsDir = path.join(__dirname, 'migrations');
    let migrationsToMark = [];

    if (fs.existsSync(migrationsDir)) {
      migrationsToMark = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.js'))
        .sort();
      console.log(`📂 Found ${migrationsToMark.length} migration files in folder\n`);
    } else {
      console.log('❌ Migrations directory not found!\n');
      process.exit(1);
    }

    // Check which ones already exist - use proper array syntax for IN clause
    const placeholders = migrationsToMark.map((_, i) => `:name${i}`).join(', ');
    const replacements = {};
    migrationsToMark.forEach((name, i) => {
      replacements[`name${i}`] = name;
    });

    const existingMigrations = await sequelize.query(`
      SELECT name FROM "SequelizeMeta" WHERE name IN (${placeholders})
    `, {
      replacements
    });

    // Extract names from the result array
    const existingNames = existingMigrations[0] ? existingMigrations[0].map(m => m.name) : [];
    const toInsert = migrationsToMark.filter(name => !existingNames.includes(name));

    if (toInsert.length === 0) {
      console.log('✅ All migrations are already marked as up!\n');
      process.exit(0);
    }

    console.log(`📋 Migrations to mark as up: ${toInsert.length}\n`);

    // Insert each migration name
    for (const migrationName of toInsert) {
      try {
        await sequelize.query(`
          INSERT INTO "SequelizeMeta" (name) 
          VALUES (:name)
        `, {
          replacements: { name: migrationName }
        });
        console.log(`   ✅ Marked: ${migrationName}`);
      } catch (error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          console.log(`   ⚠️  Already exists: ${migrationName}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ All migrations marked as up!\n');

    // Add missing group_id column to hackathon_groups table
    console.log('🔧 Checking for missing group_id column...\n');
    try {
      const [checkColumn] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'hackathon_groups' 
        AND column_name = 'group_id'
      `);

      if (checkColumn && checkColumn.length > 0) {
        console.log('✅ Column "group_id" already exists\n');
      } else {
        console.log('📝 Adding group_id column to hackathon_groups table...\n');

        // Add the column
        await sequelize.query(`
          ALTER TABLE hackathon_groups 
          ADD COLUMN group_id INTEGER;
        `);

        console.log('✅ Column group_id added successfully!\n');

        // Add foreign key constraint if it doesn't exist
        try {
          await sequelize.query(`
            ALTER TABLE hackathon_groups 
            ADD CONSTRAINT fk_hackathon_groups_group_id 
            FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL;
          `);
          console.log('✅ Foreign key constraint added!\n');
        } catch (fkError) {
          if (fkError.message.includes('already exists')) {
            console.log('⚠️  Foreign key constraint already exists\n');
          } else {
            console.log('⚠️  Could not add foreign key constraint:', fkError.message, '\n');
          }
        }
      }
    } catch (colError) {
      console.log('⚠️  Error adding column:', colError.message, '\n');
    }

    // Verify
    const allMigrations = await sequelize.query(`
      SELECT name FROM "SequelizeMeta" ORDER BY name
    `);

    const migrationsList = allMigrations[0] || [];
    console.log(`📊 Total migrations in database: ${migrationsList.length}\n`);

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   ✅ COMPLETE!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n');
    console.log('Now run: npm run db:migrate:status');
    console.log('All migrations should show as "up"\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the script
markMigrationsUp();

