const { StudentPermission, User } = require('./models');

async function verifyPermissions() {
    try {
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║  Permission Verification Script                   ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        // Get all student permissions
        const permissions = await StudentPermission.findAll({
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'name', 'email']
            }]
        });

        console.log(`📊 Total permission records: ${permissions.length}\n`);

        if (permissions.length === 0) {
            console.log('⚠️  No permission records found in database!\n');
            process.exit(0);
        }

        // Check each permission
        let allCorrect = true;
        permissions.forEach(perm => {
            const student = perm.student;
            const isCorrect = perm.courses && perm.hackathons && perm.realtime_projects;

            const status = isCorrect ? '✅' : '❌';
            console.log(`${status} ${student.name || 'Unknown'}`);
            console.log(`   Email: ${student.email}`);
            console.log(`   Courses: ${perm.courses ? '✅' : '❌'} | Hackathons: ${perm.hackathons ? '✅' : '❌'} | Projects: ${perm.realtime_projects ? '✅' : '❌'}`);
            console.log('');

            if (!isCorrect) allCorrect = false;
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (allCorrect) {
            console.log('✅ ALL PERMISSIONS ARE CORRECT!');
            console.log('✅ All students have access to all features.');
        } else {
            console.log('❌ SOME PERMISSIONS ARE INCORRECT!');
            console.log('⚠️  Please run: node grant-universal-access.js');
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

verifyPermissions();
