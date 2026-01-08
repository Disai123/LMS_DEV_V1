const { StudentPermission, User } = require('./models');

/**
 * Grant universal access to Realtime Projects and Hackathons
 * This script updates all existing student permission records
 */
async function grantUniversalAccess() {
    try {
        console.log('🔄 Starting universal access grant process...\n');

        // Get count of all students
        const studentCount = await User.count({
            where: { role: 'student' }
        });
        console.log(`📊 Total students in system: ${studentCount}`);

        // Get count of existing permission records
        const permissionCount = await StudentPermission.count();
        console.log(`📊 Existing permission records: ${permissionCount}\n`);

        // Update all existing permission records
        console.log('🔄 Updating all existing student permissions...');
        const [updatedCount] = await StudentPermission.update(
            {
                hackathons: true,
                realtime_projects: true
            },
            {
                where: {} // Update all records
            }
        );

        console.log(`✅ Updated ${updatedCount} permission records\n`);

        // Verify the updates
        console.log('🔍 Verifying updates...');
        const verifyCount = await StudentPermission.count({
            where: {
                hackathons: true,
                realtime_projects: true
            }
        });

        console.log(`✅ Verified: ${verifyCount} students now have access to both features\n`);

        // Summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ UNIVERSAL ACCESS GRANTED SUCCESSFULLY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Total students: ${studentCount}`);
        console.log(`📊 Permission records updated: ${updatedCount}`);
        console.log(`📊 Students with full access: ${verifyCount}`);
        console.log('\n🎉 All students now have access to:');
        console.log('   ✅ Courses');
        console.log('   ✅ Realtime Projects');
        console.log('   ✅ Hackathons');
        console.log('\n💡 New students will automatically get access via model defaults.');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error granting universal access:', error);
        console.error('\nError details:', error.message);
        process.exit(1);
    }

    process.exit(0);
}

// Run the script
console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  Universal Access Grant Script                    ║');
console.log('║  Realtime Projects & Hackathons                   ║');
console.log('╚════════════════════════════════════════════════════╝\n');

grantUniversalAccess();
