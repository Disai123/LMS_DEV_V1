// Simple script to manually award missing course points
const scoringService = require('./services/scoringService');

(async () => {
    try {
        console.log('Awarding missing points for Course 13...\n');

        const result = await scoringService.awardCourseCompletionPoints({
            studentId: 80,
            courseId: 13,
            certificateId: 52,
            courseDifficulty: 'beginner'
        });

        console.log('✅ SUCCESS! Points awarded.');
        console.log('Achievement ID:', result.id);
        console.log('Points:', result.points_awarded);

        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
    }
})();
