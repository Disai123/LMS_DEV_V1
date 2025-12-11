require('dotenv').config();
const { sequelize } = require('./models');
const { Certificate, Course, ProjectProgress, Project, HackathonSubmission, Hackathon, StudentAchievement, StudentScore } = require('./models');
const scoringService = require('./services/scoringService');
const logger = require('./utils/logger');
const { Op } = require('sequelize');

/**
 * BACKFILL STUDENT SCORES
 * 
 * This script processes existing data and creates achievement records:
 * 1. Processes all existing certificates → creates course_completion achievements
 * 2. Processes all approved projects → creates project_approval achievements
 * 3. Processes all hackathon submissions → creates hackathon_approval achievements
 * 4. Recalculates all student scores
 * 
 * Usage: node backfill-student-scores.js
 */

async function backfillCourseCompletions() {
  console.log('\n📚 Processing existing certificates...\n');
  
  const certificates = await Certificate.findAll({
    where: { is_valid: true },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'difficulty']
      }
    ],
    order: [['issued_date', 'ASC']]
  });

  console.log(`Found ${certificates.length} valid certificates to process\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const cert of certificates) {
    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        cert.student_id,
        'course_completion',
        cert.course_id
      );

      if (existing) {
        skipped++;
        continue;
      }

      // Get course difficulty (default to 'beginner' if not set)
      const courseDifficulty = cert.course?.difficulty || 'beginner';

      // Award points using scoring service
      await scoringService.awardCourseCompletionPoints({
        studentId: cert.student_id,
        courseId: cert.course_id,
        certificateId: cert.id,
        courseDifficulty: courseDifficulty
      });

      processed++;
      if (processed % 10 === 0) {
        console.log(`  ✓ Processed ${processed} certificates...`);
      }
    } catch (error) {
      errors++;
      logger.error(`Error processing certificate ${cert.id}:`, error.message);
    }
  }

  console.log(`\n✅ Course completions: ${processed} processed, ${skipped} skipped, ${errors} errors\n`);
  return { processed, skipped, errors };
}

async function backfillProjectApprovals() {
  console.log('🔨 Processing approved projects...\n');
  
  const approvedProjects = await ProjectProgress.findAll({
    where: {
      admin_approved: true,
      submission_url: { [Op.ne]: null }
    },
    include: [
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'title', 'difficulty']
      }
    ],
    order: [['approved_at', 'ASC']]
  });

  console.log(`Found ${approvedProjects.length} approved projects to process\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const progress of approvedProjects) {
    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        progress.userId,
        'project_approval',
        progress.projectId
      );

      if (existing) {
        skipped++;
        continue;
      }

      // Get project difficulty (default to 'intermediate' if not set)
      const projectDifficulty = progress.project?.difficulty || 'intermediate';

      // Award points using scoring service
      await scoringService.awardProjectPoints({
        studentId: progress.userId,
        projectId: progress.projectId,
        approvedBy: progress.approved_by,
        projectDifficulty: projectDifficulty
      });

      processed++;
      if (processed % 10 === 0) {
        console.log(`  ✓ Processed ${processed} projects...`);
      }
    } catch (error) {
      errors++;
      logger.error(`Error processing project progress ${progress.id}:`, error.message);
    }
  }

  console.log(`\n✅ Project approvals: ${processed} processed, ${skipped} skipped, ${errors} errors\n`);
  return { processed, skipped, errors };
}

async function backfillHackathonAchievements() {
  console.log('🏆 Processing hackathon submissions...\n');
  
  // Get all hackathon submissions that are accepted or have rankings
  const submissions = await HackathonSubmission.findAll({
    where: {
      [Op.or]: [
        { status: 'accepted' },
        { is_winner: true },
        { ranking: { [Op.ne]: null } }
      ]
    },
    include: [
      {
        model: Hackathon,
        as: 'hackathon',
        attributes: ['id', 'name']
      }
    ],
    order: [['submitted_at', 'ASC']]
  });

  console.log(`Found ${submissions.length} hackathon submissions to process\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const submission of submissions) {
    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        submission.student_id,
        'hackathon_approval',
        submission.hackathon_id
      );

      if (existing) {
        skipped++;
        continue;
      }

      // Award points using scoring service
      // The scoringService will determine the rule key based on ranking internally
      await scoringService.awardHackathonPoints({
        studentId: submission.student_id,
        hackathonId: submission.hackathon_id,
        approvedBy: submission.reviewed_by,
        ranking: submission.ranking
      });

      processed++;
      if (processed % 10 === 0) {
        console.log(`  ✓ Processed ${processed} hackathon submissions...`);
      }
    } catch (error) {
      errors++;
      logger.error(`Error processing hackathon submission ${submission.id}:`, error.message);
    }
  }

  console.log(`\n✅ Hackathon achievements: ${processed} processed, ${skipped} skipped, ${errors} errors\n`);
  return { processed, skipped, errors };
}

async function recalculateAllScores() {
  console.log('🔄 Recalculating all student scores...\n');
  
  // Get all unique student IDs from achievements
  const [students] = await sequelize.query(`
    SELECT DISTINCT student_id 
    FROM student_achievements 
    WHERE is_active = true
  `);

  const studentIds = students.map(s => s.student_id);
  console.log(`Found ${studentIds.length} students with achievements\n`);

  let processed = 0;
  let errors = 0;

  for (const studentId of studentIds) {
    try {
      await scoringService.recalculateStudentScores(studentId);
      processed++;
      
      if (processed % 50 === 0) {
        console.log(`  ✓ Recalculated ${processed} student scores...`);
      }
    } catch (error) {
      errors++;
      logger.error(`Error recalculating scores for student ${studentId}:`, error.message);
    }
  }

  // Also check master certificate eligibility for all students
  console.log('\n🎓 Checking master certificate eligibility...\n');
  for (const studentId of studentIds) {
    try {
      await scoringService.checkMasterCertificateEligibility(studentId);
    } catch (error) {
      logger.error(`Error checking master certificate for student ${studentId}:`, error.message);
    }
  }

  console.log(`\n✅ Score recalculation: ${processed} processed, ${errors} errors\n`);
  return { processed, errors };
}

async function generateReport() {
  console.log('\n📊 Generating final report...\n');
  
  const [stats] = await sequelize.query(`
    SELECT 
      COUNT(DISTINCT student_id) as total_students,
      COUNT(*) FILTER (WHERE achievement_type = 'course_completion') as course_achievements,
      COUNT(*) FILTER (WHERE achievement_type = 'project_approval') as project_achievements,
      COUNT(*) FILTER (WHERE achievement_type = 'hackathon_approval') as hackathon_achievements,
      COUNT(*) FILTER (WHERE achievement_type = 'master_certificate') as master_certificates,
      SUM(points_awarded) as total_points_awarded
    FROM student_achievements
    WHERE is_active = true
  `);

  const [scoreStats] = await sequelize.query(`
    SELECT 
      COUNT(*) as students_with_scores,
      SUM(total_points) as total_points_sum,
      AVG(total_points) as avg_points,
      MAX(total_points) as max_points
    FROM student_scores
  `);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   📊 BACKFILL REPORT');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('Achievements:');
  console.log(`  • Total students with achievements: ${stats[0].total_students}`);
  console.log(`  • Course completions: ${stats[0].course_achievements}`);
  console.log(`  • Project approvals: ${stats[0].project_achievements}`);
  console.log(`  • Hackathon achievements: ${stats[0].hackathon_achievements}`);
  console.log(`  • Master certificates: ${stats[0].master_certificates}`);
  console.log(`  • Total points awarded: ${stats[0].total_points_awarded || 0}\n`);
  console.log('Student Scores:');
  console.log(`  • Students with scores: ${scoreStats[0].students_with_scores}`);
  console.log(`  • Total points sum: ${scoreStats[0].total_points_sum || 0}`);
  console.log(`  • Average points: ${Math.round(scoreStats[0].avg_points || 0)}`);
  console.log(`  • Maximum points: ${scoreStats[0].max_points || 0}\n`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

async function main() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🚀 STUDENT SCORES BACKFILL SCRIPT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');
  console.log('This script will:');
  console.log('  1. Process existing certificates → create course_completion achievements');
  console.log('  2. Process approved projects → create project_approval achievements');
  console.log('  3. Process hackathon submissions → create hackathon_approval achievements');
  console.log('  4. Recalculate all student scores');
  console.log('  5. Check master certificate eligibility\n');
  console.log('⚠️  This will process ALL existing data. Make sure you have a database backup!\n');
  console.log('Starting in 5 seconds... (Press Ctrl+C to cancel)\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Step 1: Process certificates
    const certResults = await backfillCourseCompletions();

    // Step 2: Process projects
    const projectResults = await backfillProjectApprovals();

    // Step 3: Process hackathons
    const hackathonResults = await backfillHackathonAchievements();

    // Step 4: Recalculate all scores
    const recalculationResults = await recalculateAllScores();

    // Step 5: Generate report
    await generateReport();

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   ✅ BACKFILL COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n');
    console.log('Summary:');
    console.log(`  • Certificates processed: ${certResults.processed}`);
    console.log(`  • Projects processed: ${projectResults.processed}`);
    console.log(`  • Hackathons processed: ${hackathonResults.processed}`);
    console.log(`  • Scores recalculated: ${recalculationResults.processed}\n`);

  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    logger.error('Backfill error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the backfill
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

