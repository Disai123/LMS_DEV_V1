const { sequelize } = require('./models');

async function checkAndFixTable() {
    try {
        console.log('=== Checking hackathon_group_members table ===\n');

        // Check columns
        const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'hackathon_group_members'
      ORDER BY ordinal_position;
    `);

        console.log('Current columns:');
        columns.forEach(col => {
            console.log(`  ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | nullable: ${col.is_nullable} | default: ${col.column_default || 'none'}`);
        });

        // Check constraints
        const [constraints] = await sequelize.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'hackathon_group_members'::regclass;
    `);

        console.log('\nCurrent constraints:');
        constraints.forEach(con => {
            console.log(`  ${con.conname} (${con.contype}): ${con.definition}`);
        });

        const hasIdColumn = columns.some(col => col.column_name === 'id');

        if (hasIdColumn) {
            console.log('\n✓ Table already has id column!');
            process.exit(0);
        }

        console.log('\n⚠ Missing id column. Fixing now...\n');

        // Drop existing primary key if it exists
        const hasPrimaryKey = constraints.some(con => con.contype === 'p');
        if (hasPrimaryKey) {
            const pkConstraint = constraints.find(con => con.contype === 'p');
            console.log(`Dropping existing primary key: ${pkConstraint.conname}`);
            await sequelize.query(`
        ALTER TABLE hackathon_group_members
        DROP CONSTRAINT ${pkConstraint.conname};
      `);
        }

        // Add id column
        console.log('Adding id column...');
        await sequelize.query(`
      ALTER TABLE hackathon_group_members
      ADD COLUMN id SERIAL;
    `);

        // Make id the primary key
        console.log('Setting id as primary key...');
        await sequelize.query(`
      ALTER TABLE hackathon_group_members
      ADD PRIMARY KEY (id);
    `);

        console.log('\n✓ Successfully fixed table structure!');

        // Verify
        const [newColumns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'hackathon_group_members'
      ORDER BY ordinal_position;
    `);

        console.log('\nUpdated columns:');
        newColumns.forEach(col => {
            console.log(`  ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(20)} | nullable: ${col.is_nullable} | default: ${col.column_default || 'none'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

checkAndFixTable();
