const { StudentScore } = require('./models');

(async () => {
    try {
        const score = await StudentScore.findOne({ where: { student_id: 80 } });

        if (score) {
            console.log('=== UPDATED STUDENT SCORE ===');
            console.log(`Total Points: ${score.total_points}`);
            console.log(`Course Points: ${score.total_course_points}`);
            console.log(`Project Points: ${score.total_project_points}`);
            console.log(`Courses Completed: ${score.courses_completed_count}`);
            console.log(`Projects Approved: ${score.projects_approved_count}`);
            console.log(`Last Updated: ${score.last_calculated_at}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();
