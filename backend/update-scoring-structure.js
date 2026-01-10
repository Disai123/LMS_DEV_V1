const { ScoringRule, StudentScore, sequelize } = require('./models');
const scoringService = require('./services/scoringService');

async function updateScoringRulesAndRecalculate() {
    const transaction = await sequelize.transaction();

    try {
        console.log('Starting scoring rules update and recalculation...\n');

        // Update course completion points
        console.log('Updating course completion points...');
        await ScoringRule.update({ points: 10 }, {
            where: { rule_type: 'course_completion', rule_key: 'beginner' },
            transaction
        });
        await ScoringRule.update({ points: 20 }, {
            where: { rule_type: 'course_completion', rule_key: 'intermediate' },
            transaction
        });
        await ScoringRule.update({ points: 30 }, {
            where: { rule_type: 'course_completion', rule_key: 'advanced' },
            transaction
        });
        await ScoringRule.update({ points: 20 }, {
            where: { rule_type: 'course_completion', rule_key: 'default' },
            transaction
        });
        console.log('✓ Course completion points updated');

        // Update project approval points
        console.log('Updating project approval points...');
        await ScoringRule.update({ points: 40 }, {
            where: { rule_type: 'project_approval', rule_key: 'beginner' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'project_approval', rule_key: 'intermediate' },
            transaction
        });
        await ScoringRule.update({ points: 60 }, {
            where: { rule_type: 'project_approval', rule_key: 'advanced' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'project_approval', rule_key: 'default' },
            transaction
        });
        console.log('✓ Project approval points updated');

        // Update realtime project completion points
        console.log('Updating realtime project completion points...');
        await ScoringRule.update({ points: 40 }, {
            where: { rule_type: 'realtime_project_completion', rule_key: 'beginner' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'realtime_project_completion', rule_key: 'intermediate' },
            transaction
        });
        await ScoringRule.update({ points: 60 }, {
            where: { rule_type: 'realtime_project_completion', rule_key: 'advanced' },
            transaction
        });
        console.log('✓ Realtime project completion points updated');

        // Update hackathon points - all to 50
        console.log('Updating hackathon points (all to 50)...');
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'participation' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'ranking_1' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'ranking_2' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'ranking_3' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'top_10' },
            transaction
        });
        await ScoringRule.update({ points: 50 }, {
            where: { rule_type: 'hackathon_approval', rule_key: 'top_20' },
            transaction
        });
        console.log('✓ Hackathon points updated');

        // Update master certificate bonus
        console.log('Updating master certificate bonus...');
        await ScoringRule.update({ points: 100 }, {
            where: { rule_type: 'master_certificate', rule_key: 'default' },
            transaction
        });
        console.log('✓ Master certificate bonus updated');

        await transaction.commit();
        console.log('\n✓ All scoring rules updated successfully!\n');

        // Now recalculate all student scores
        console.log('Recalculating all student scores...');
        const students = await StudentScore.findAll();
        console.log(`Found ${students.length} students to recalculate\n`);

        let successCount = 0;
        let errorCount = 0;

        for (const student of students) {
            try {
                await scoringService.recalculateStudentScores(student.student_id);
                successCount++;
                console.log(`✓ Recalculated scores for student ${student.student_id} (${successCount}/${students.length})`);
            } catch (error) {
                errorCount++;
                console.error(`✗ Error recalculating scores for student ${student.student_id}:`, error.message);
            }
        }

        console.log('\n=== Summary ===');
        console.log(`Total students: ${students.length}`);
        console.log(`Successfully recalculated: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log('\n✓ Scoring structure simplification complete!');

        process.exit(0);
    } catch (error) {
        await transaction.rollback();
        console.error('\n✗ Error updating scoring rules:', error);
        process.exit(1);
    }
}

// Run the update
updateScoringRulesAndRecalculate();
