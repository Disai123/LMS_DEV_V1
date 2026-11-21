const { StudentPermission, User } = require('./models');

/**
 * Lock courses and realtime projects for all students.
 * Admin must grant access via RBAC Management afterward.
 */
async function lockFeatureAccess() {
  try {
    console.log('Starting feature lock process...\n');

    const studentCount = await User.count({ where: { role: 'student' } });
    console.log(`Total students: ${studentCount}`);

    const permissionCount = await StudentPermission.count();
    console.log(`Existing permission records: ${permissionCount}\n`);

    // Ensure every student has a permissions row
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'email']
    });

    let created = 0;
    for (const student of students) {
      const [record, wasCreated] = await StudentPermission.findOrCreate({
        where: { student_id: student.id },
        defaults: {
          student_id: student.id,
          courses: false,
          hackathons: true,
          realtime_projects: false
        }
      });
      if (wasCreated) created += 1;
    }
    console.log(`Created ${created} missing permission records`);

    const [updatedCount] = await StudentPermission.update(
      {
        courses: false,
        realtime_projects: false
      },
      { where: {} }
    );

    console.log(`Updated ${updatedCount} permission records to locked\n`);

    const lockedCount = await StudentPermission.count({
      where: {
        courses: false,
        realtime_projects: false
      }
    });

    console.log('FEATURE ACCESS LOCKED');
    console.log(`Students: ${studentCount}`);
    console.log(`Permission rows locked (courses + realtime_projects false): ${lockedCount}`);
    console.log('Admin can release all courses / all realtime projects via /admin/rbac\n');
  } catch (error) {
    console.error('Error locking feature access:', error);
    process.exit(1);
  }

  process.exit(0);
}

console.log('\nFeature Lock Script — Courses & Realtime Projects\n');
lockFeatureAccess();
