const { StudentPermission, User } = require('./models');

/**
 * Create permission records for all students
 * This ensures every student has a permission record in the database
 */
async function createAllPermissions() {
    try {
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║  Create All Student Permissions                   ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        // Get all students
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'email']
        });

        console.log(`📊 Found ${students.length} students\n`);

        if (students.length === 0) {
            console.log('⚠️  No students found in database!\n');
            process.exit(0);
        }

        let created = 0;
        let updated = 0;

        for (const student of students) {
            // Find or create permission record
            const [permission, isNew] = await StudentPermission.findOrCreate({
                where: { student_id: student.id },
                defaults: {
                    student_id: student.id,
                    courses: true,
                    hackathons: true,
                    realtime_projects: true
                }
            });

            if (isNew) {
                console.log(`✅ Created permissions for: ${student.name}`);
                created++;
            } else {
                // Update existing record to ensure all permissions are true
                await permission.update({
                    courses: true,
                    hackathons: true,
                    realtime_projects: true
                });
                console.log(`🔄 Updated permissions for: ${student.name}`);
                updated++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PERMISSION CREATION COMPLETE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Total students: ${students.length}`);
        console.log(`📊 New records created: ${created}`);
        console.log(`📊 Existing records updated: ${updated}`);
        console.log('\n🎉 All students now have full access to:');
        console.log('   ✅ Courses');
        console.log('   ✅ Realtime Projects');
        console.log('   ✅ Hackathons\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }

    process.exit(0);
}

createAllPermissions();
