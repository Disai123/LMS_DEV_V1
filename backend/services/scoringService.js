const { StudentAchievement, StudentScore, ScoringRule, Course, Certificate, sequelize } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class ScoringService {
  /**
   * Get points for a scoring rule
   */
  async getPointsForRule(ruleType, ruleKey) {
    try {
      const rule = await ScoringRule.findByTypeAndKey(ruleType, ruleKey);
      if (!rule) {
        logger.warn(`Scoring rule not found: ${ruleType} - ${ruleKey}, using default`);
        // Try to get default rule
        const defaultRule = await ScoringRule.findByTypeAndKey(ruleType, 'default');
        return defaultRule ? defaultRule.points : 0;
      }
      return rule.points;
    } catch (error) {
      logger.error('Error getting points for rule:', error);
      return 0;
    }
  }

  /**
   * Award points for course completion
   */
  async awardCourseCompletionPoints({ studentId, courseId, certificateId, courseDifficulty = 'beginner' }) {
    const transaction = await sequelize.transaction();

    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        studentId,
        'course_completion',
        courseId
      );

      if (existing) {
        logger.info(`Course completion achievement already exists for student ${studentId}, course ${courseId}`);
        await transaction.rollback();
        return existing;
      }

      // Get course details
      const course = await Course.findByPk(courseId, { transaction });
      if (!course) {
        throw new Error(`Course ${courseId} not found`);
      }

      // Get points from scoring rules based on difficulty
      const points = await this.getPointsForRule('course_completion', courseDifficulty);

      // Create achievement record
      const achievement = await StudentAchievement.create({
        student_id: studentId,
        achievement_type: 'course_completion',
        source_id: String(courseId), // Convert to string to match VARCHAR column
        source_type: 'course',
        points_awarded: points,
        metadata: {
          course_title: course.title,
          course_difficulty: courseDifficulty,
          certificate_id: certificateId
        }
      }, { transaction });

      // Recalculate student scores
      await this.recalculateStudentScores(studentId, transaction);

      // Check master certificate eligibility
      await this.checkMasterCertificateEligibility(studentId, transaction);

      await transaction.commit();
      logger.info(`Awarded ${points} points for course completion: student ${studentId}, course ${courseId}`);

      return achievement;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error awarding course completion points:', error);
      throw error;
    }
  }

  /**
   * Award points for project approval
   */
  async awardProjectPoints({ studentId, projectId, approvedBy, projectDifficulty = 'intermediate' }) {
    const transaction = await sequelize.transaction();

    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        studentId,
        'project_approval',
        projectId
      );

      if (existing) {
        logger.info(`Project approval achievement already exists for student ${studentId}, project ${projectId}`);
        await transaction.rollback();
        return existing;
      }

      // Get project details (if Project model is available)
      let projectTitle = 'Project';
      try {
        const { Project } = require('../models');
        const project = await Project.findByPk(projectId, { transaction });
        if (project) {
          projectTitle = project.title;
        }
      } catch (err) {
        logger.warn('Could not fetch project details:', err.message);
      }

      // Get points from scoring rules based on difficulty
      const points = await this.getPointsForRule('project_approval', projectDifficulty);

      // Create achievement record
      const achievement = await StudentAchievement.create({
        student_id: studentId,
        achievement_type: 'project_approval',
        source_id: String(projectId), // Convert to string to match VARCHAR column
        source_type: 'project',
        points_awarded: points,
        awarded_by: approvedBy,
        metadata: {
          project_title: projectTitle,
          project_difficulty: projectDifficulty
        }
      }, { transaction });

      // Recalculate student scores
      await this.recalculateStudentScores(studentId, transaction);

      await transaction.commit();
      logger.info(`Awarded ${points} points for project approval: student ${studentId}, project ${projectId}`);

      return achievement;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error awarding project points:', error);
      throw error;
    }
  }

  /**
   * Award points for hackathon approval
   */
  async awardHackathonPoints({ studentId, hackathonId, ranking = null, approvedBy }) {
    const transaction = await sequelize.transaction();

    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        studentId,
        'hackathon_approval',
        hackathonId
      );

      if (existing) {
        logger.info(`Hackathon approval achievement already exists for student ${studentId}, hackathon ${hackathonId}`);
        await transaction.rollback();
        return existing;
      }

      // Get hackathon details
      let hackathonName = 'Hackathon';
      try {
        const { Hackathon } = require('../models');
        const hackathon = await Hackathon.findByPk(hackathonId, { transaction });
        if (hackathon) {
          hackathonName = hackathon.name;
        }
      } catch (err) {
        logger.warn('Could not fetch hackathon details:', err.message);
      }

      // Determine rule key based on ranking
      let ruleKey = 'participation';
      if (ranking === 1) {
        ruleKey = 'ranking_1';
      } else if (ranking === 2) {
        ruleKey = 'ranking_2';
      } else if (ranking === 3) {
        ruleKey = 'ranking_3';
      } else if (ranking && ranking <= 10) {
        ruleKey = 'top_10';
      } else if (ranking && ranking <= 20) {
        ruleKey = 'top_20';
      }

      // Get points from scoring rules
      const points = await this.getPointsForRule('hackathon_approval', ruleKey);

      // Create achievement record
      const achievement = await StudentAchievement.create({
        student_id: studentId,
        achievement_type: 'hackathon_approval',
        source_id: String(hackathonId), // Convert to string to match VARCHAR column
        source_type: 'hackathon',
        points_awarded: points,
        awarded_by: approvedBy,
        metadata: {
          hackathon_name: hackathonName,
          ranking: ranking,
          rule_key: ruleKey
        }
      }, { transaction });

      // Recalculate student scores
      await this.recalculateStudentScores(studentId, transaction);

      await transaction.commit();
      logger.info(`Awarded ${points} points for hackathon approval: student ${studentId}, hackathon ${hackathonId}, ranking ${ranking}`);

      return achievement;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error awarding hackathon points:', error);
      throw error;
    }
  }

  /**
   * Award points for realtime project completion
   */
  async awardRealtimeProjectPoints({ studentId, projectId, projectName, difficulty = 'intermediate' }) {
    const transaction = await sequelize.transaction();

    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.checkExists(
        studentId,
        'realtime_project_completion',
        projectId
      );

      if (existing) {
        logger.info(`Realtime project completion achievement already exists for student ${studentId}, project ${projectId}`);
        await transaction.rollback();
        return existing;
      }

      // Get points from scoring rules based on difficulty
      const points = await this.getPointsForRule('realtime_project_completion', difficulty);

      // Create achievement record
      const achievement = await StudentAchievement.create({
        student_id: studentId,
        achievement_type: 'realtime_project_completion',
        source_id: String(projectId), // Convert to string to match VARCHAR column
        source_type: 'realtime_project',
        points_awarded: points,
        metadata: {
          project_name: projectName,
          project_difficulty: difficulty
        }
      }, { transaction });

      // Recalculate student scores
      await this.recalculateStudentScores(studentId, transaction);

      await transaction.commit();
      logger.info(`Awarded ${points} points for realtime project completion: student ${studentId}, project ${projectId}`);

      return achievement;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error awarding realtime project points:', error);
      throw error;
    }
  }

  /**
   * Award master certificate points
   */
  async awardMasterCertificatePoints({ studentId, points, transaction }) {
    try {
      // Check if achievement already exists
      const existing = await StudentAchievement.findOne({
        where: {
          student_id: studentId,
          achievement_type: 'master_certificate',
          is_active: true
        },
        transaction
      });

      if (existing) {
        logger.info(`Master certificate achievement already exists for student ${studentId}`);
        return existing;
      }

      // Create achievement record
      const achievement = await StudentAchievement.create({
        student_id: studentId,
        achievement_type: 'master_certificate',
        source_id: 0, // No specific source
        source_type: 'master_certificate',
        points_awarded: points,
        metadata: {
          description: 'Master Certificate - Completed all courses'
        }
      }, { transaction });

      // Update student score
      const studentScore = await StudentScore.getOrCreate(studentId);
      await studentScore.update({
        master_certificate_issued: true,
        master_certificate_issued_at: new Date()
      }, { transaction });

      logger.info(`Awarded ${points} points for master certificate: student ${studentId}`);

      return achievement;
    } catch (error) {
      logger.error('Error awarding master certificate points:', error);
      throw error;
    }
  }

  /**
   * Recalculate student scores from achievements
   */
  async recalculateStudentScores(studentId, transaction = null) {
    try {
      // Get all active achievements for student
      const achievements = await StudentAchievement.findAll({
        where: {
          student_id: studentId,
          is_active: true
        },
        transaction
      });

      // Sum by type
      const totals = achievements.reduce((acc, ach) => {
        if (ach.achievement_type === 'course_completion' || ach.achievement_type === 'master_certificate') {
          acc.course_points += ach.points_awarded;
          if (ach.achievement_type === 'course_completion') {
            acc.courses_count++;
          }
        } else if (ach.achievement_type === 'project_approval' || ach.achievement_type === 'realtime_project_completion') {
          acc.project_points += ach.points_awarded;
          acc.projects_count++;
        } else if (ach.achievement_type === 'hackathon_approval') {
          acc.hackathon_points += ach.points_awarded;
          acc.hackathons_count++;
        }
        return acc;
      }, {
        course_points: 0,
        project_points: 0,
        hackathon_points: 0,
        courses_count: 0,
        projects_count: 0,
        hackathons_count: 0
      });

      // Get or create student score
      const studentScore = await StudentScore.getOrCreate(studentId);

      // Update student_scores
      await studentScore.update({
        total_course_points: totals.course_points,
        total_project_points: totals.project_points,
        total_hackathon_points: totals.hackathon_points,
        total_points: totals.course_points + totals.project_points + totals.hackathon_points,
        courses_completed_count: totals.courses_count,
        projects_approved_count: totals.projects_count,
        hackathons_approved_count: totals.hackathons_count,
        last_calculated_at: new Date()
      }, { transaction });

      logger.info(`Recalculated scores for student ${studentId}: Total = ${totals.course_points + totals.project_points + totals.hackathon_points}`);

      return studentScore;
    } catch (error) {
      logger.error('Error recalculating student scores:', error);
      throw error;
    }
  }

  /**
   * Check master certificate eligibility
   */
  async checkMasterCertificateEligibility(studentId, transaction = null) {
    try {
      // Get ALL currently published courses
      const publishedCourses = await Course.findAll({
        where: { is_published: true },
        attributes: ['id'],
        transaction
      });

      const publishedCourseIds = publishedCourses.map(c => c.id);

      if (publishedCourseIds.length === 0) {
        logger.info(`No published courses available for master certificate check: student ${studentId}`);
        return { eligible: false, reason: 'No published courses available' };
      }

      // Get student's completed courses (from certificates)
      const studentCertificates = await Certificate.findAll({
        where: {
          student_id: studentId,
          is_valid: true
        },
        attributes: ['course_id'],
        transaction
      });

      const completedCourseIds = studentCertificates.map(c => c.course_id);

      // Check if student has completed ALL published courses
      const allCompleted = publishedCourseIds.every(id => completedCourseIds.includes(id));

      // Get student score
      const studentScore = await StudentScore.getOrCreate(studentId);

      // Check if master certificate already issued
      if (studentScore.master_certificate_issued) {
        return {
          eligible: true,
          issued: true,
          completed: completedCourseIds.length,
          total: publishedCourseIds.length
        };
      }

      if (allCompleted) {
        // Issue master certificate
        const masterCertPoints = await this.getPointsForRule('master_certificate', 'default');

        await this.awardMasterCertificatePoints({
          studentId,
          points: masterCertPoints,
          transaction
        });

        // Recalculate scores to include master certificate points
        await this.recalculateStudentScores(studentId, transaction);

        logger.info(`Master certificate issued to student ${studentId}`);

        return {
          eligible: true,
          issued: true,
          completed: completedCourseIds.length,
          total: publishedCourseIds.length
        };
      }

      return {
        eligible: false,
        issued: false,
        completed: completedCourseIds.length,
        total: publishedCourseIds.length
      };
    } catch (error) {
      logger.error('Error checking master certificate eligibility:', error);
      throw error;
    }
  }

  /**
   * Get student scores
   */
  async getStudentScores(studentId) {
    try {
      const studentScore = await StudentScore.getOrCreate(studentId);
      return studentScore.getPublicInfo();
    } catch (error) {
      logger.error('Error getting student scores:', error);
      throw error;
    }
  }

  /**
   * Get student achievements
   */
  async getStudentAchievements(studentId, achievementType = null) {
    try {
      const where = {
        student_id: studentId,
        is_active: true
      };

      if (achievementType) {
        where.achievement_type = achievementType;
      }

      const achievements = await StudentAchievement.findAll({
        where,
        order: [['awarded_at', 'DESC']]
      });

      return achievements;
    } catch (error) {
      logger.error('Error getting student achievements:', error);
      throw error;
    }
  }
}

module.exports = new ScoringService();

