const scoringService = require('../services/scoringService');
const { StudentAchievement, Course, Project, Hackathon } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Calculate maximum possible points
 */
const calculateMaxPossiblePoints = async () => {
  try {
    // Fetch all data in parallel for better performance
    const [courses, projects, hackathons] = await Promise.all([
      Course.findAll({
        where: { is_active: true },
        attributes: ['id', 'difficulty']
      }),
      Project.findAll({
        where: { 
          status: 'active',
          is_published: true
        },
        attributes: ['id', 'difficulty']
      }),
      Hackathon.findAll({
        where: { 
          status: { [Op.in]: ['active', 'upcoming'] }
        },
        attributes: ['id']
      })
    ]);

    // Pre-fetch scoring rules in parallel to avoid repeated queries
    const [
      courseBeginnerPoints,
      courseIntermediatePoints,
      courseAdvancedPoints,
      projectBeginnerPoints,
      projectIntermediatePoints,
      projectAdvancedPoints,
      participationPoints,
      masterCertPoints
    ] = await Promise.all([
      scoringService.getPointsForRule('course_completion', 'beginner').catch(() => 40),
      scoringService.getPointsForRule('course_completion', 'intermediate').catch(() => 60),
      scoringService.getPointsForRule('course_completion', 'advanced').catch(() => 80),
      scoringService.getPointsForRule('project_approval', 'beginner').catch(() => 150),
      scoringService.getPointsForRule('project_approval', 'intermediate').catch(() => 250),
      scoringService.getPointsForRule('project_approval', 'advanced').catch(() => 350),
      scoringService.getPointsForRule('hackathon_approval', 'participation').catch(() => 200),
      scoringService.getPointsForRule('master_certificate', 'default').catch(() => 500)
    ]);

    // Use a map for quick lookup of points by difficulty
    const coursePointsMap = {
      'beginner': courseBeginnerPoints,
      'intermediate': courseIntermediatePoints,
      'advanced': courseAdvancedPoints
    };
    
    const projectPointsMap = {
      'beginner': projectBeginnerPoints,
      'intermediate': projectIntermediatePoints,
      'advanced': projectAdvancedPoints
    };

    // Calculate course points
    let maxCoursePoints = 0;
    for (const course of courses) {
      const difficulty = course.difficulty || 'beginner';
      const points = coursePointsMap[difficulty] || coursePointsMap['beginner'];
      maxCoursePoints += points;
    }

    // Calculate project points
    let maxProjectPoints = 0;
    for (const project of projects) {
      const difficulty = project.difficulty || 'intermediate';
      const points = projectPointsMap[difficulty] || projectPointsMap['intermediate'];
      maxProjectPoints += points;
    }

    // Calculate hackathon points
    const maxHackathonPoints = hackathons.length * participationPoints;

    // Add master certificate points
    const maxTotalPoints = maxCoursePoints + maxProjectPoints + maxHackathonPoints + masterCertPoints;

    logger.info(`Calculated max points: Courses=${maxCoursePoints} (${courses.length} courses), Projects=${maxProjectPoints} (${projects.length} projects), Hackathons=${maxHackathonPoints} (${hackathons.length} hackathons), Total=${maxTotalPoints}`);

    return {
      max_course_points: maxCoursePoints,
      max_project_points: maxProjectPoints,
      max_hackathon_points: maxHackathonPoints,
      max_total_points: maxTotalPoints
    };
  } catch (error) {
    logger.error('Error calculating max possible points:', error);
    logger.warn('Max points calculation failed, returning zeros. This may affect score display.');
    // Return defaults if calculation fails
    return {
      max_course_points: 0,
      max_project_points: 0,
      max_hackathon_points: 0,
      max_total_points: 0
    };
  }
};

/**
 * Get student's own score
 */
const getMyScore = async (req, res, next) => {
  try {
    const score = await scoringService.getStudentScores(req.user.id);
    const maxPoints = await calculateMaxPossiblePoints();
    
    res.json({
      success: true,
      data: {
        ...score,
        ...maxPoints
      }
    });
  } catch (error) {
    logger.error('Error getting student score:', error);
    next(error);
  }
};

/**
 * Get student's achievements
 */
const getMyAchievements = async (req, res, next) => {
  try {
    const achievements = await StudentAchievement.findAll({
      where: {
        student_id: req.user.id,
        is_active: true
      },
      order: [['awarded_at', 'DESC']]
    });

    // Group by type
    const grouped = achievements.reduce((acc, achievement) => {
      const type = achievement.achievement_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(achievement);
      return acc;
    }, {});

    const totalPoints = achievements.reduce((sum, a) => sum + (parseInt(a.points_awarded) || 0), 0);

    res.json({
      success: true,
      data: {
        achievements: achievements,
        grouped: grouped,
        total_count: achievements.length,
        total_points: totalPoints
      }
    });
  } catch (error) {
    logger.error('Error getting student achievements:', error);
    next(error);
  }
};

module.exports = {
  getMyScore,
  getMyAchievements
};

