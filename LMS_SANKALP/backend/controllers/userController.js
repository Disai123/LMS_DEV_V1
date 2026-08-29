const { User, Course, Enrollment, Certificate, TestAttempt, CourseTest, sequelize } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const { ilikeOp } = require('../utils/dialect');
const studentPerformanceService = require('../services/studentPerformanceService');

/**
 * Get all users with pagination
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (role) {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['google_id'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: users.map(user => user.getPublicProfile()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    next(error);
  }
};

/**
 * Get all students
 */
const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: students } = await User.findAndCountAll({
      where: { role: 'student' },
      attributes: { exclude: ['google_id'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        students: students.map(student => student.getPublicProfile()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get students error:', error);
    next(error);
  }
};

/**
 * Search users
 */
const searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.json({
        success: true,
        message: 'Search query required',
        data: { users: [], pagination: {} }
      });
    }

    const offset = (page - 1) * limit;
    const whereClause = {
      [Op.or]: [
        ilikeOp(sequelize, 'name', q),
        ilikeOp(sequelize, 'email', q)
      ]
    };

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['google_id'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      message: 'Search results retrieved successfully',
      data: {
        users: users.map(user => user.getPublicProfile()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    logger.error('Search users error:', error);
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['google_id'] }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    next(error);
  }
};

/**
 * Create new user
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, role = 'student', avatar, password } = req.body;

    // Debug: Log the creation data
    logger.info(`Creating user with data:`, { name, email, role, hasPassword: !!password });

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      role,
      avatar,
      password, // Will be hashed by the model hook
      is_active: true
    });

    logger.info(`User ${email} created by admin ${req.user.email}. Password set: ${!!user.password}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Create user error:', error);
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Debug: Log the update data
    logger.info(`Updating user ${user.email} with data:`, req.body);

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new AppError('Email already in use', 400);
      }
    }

    await user.update(req.body);

    // Refresh user data to get updated values
    await user.reload();

    logger.info(`User ${user.email} updated by admin ${req.user.email}. New status: ${user.is_active}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      throw new AppError('Cannot delete your own account', 400);
    }

    // Delete related records before deleting user to avoid foreign key constraint errors
    const { TestAttempt, TestAnswer, Enrollment, ChapterProgress } = require('../models');

    // Find all enrollments for this user
    const enrollments = await Enrollment.findAll({
      where: { student_id: id },
      attributes: ['id']
    });

    const enrollmentIds = enrollments.map(enrollment => enrollment.id);

    // Delete chapter_progress records for all enrollments
    if (enrollmentIds.length > 0) {
      await ChapterProgress.destroy({
        where: { enrollment_id: enrollmentIds }
      });
    }

    // Delete enrollments
    await Enrollment.destroy({
      where: { student_id: id }
    });

    // Find all test attempt IDs for this user
    const testAttempts = await TestAttempt.findAll({
      where: { student_id: id },
      attributes: ['id']
    });

    const attemptIds = testAttempts.map(attempt => attempt.id);

    // Delete test answers for all test attempts in one query
    if (attemptIds.length > 0) {
      await TestAnswer.destroy({
        where: { attempt_id: attemptIds }
      });
    }

    // Delete test attempts
    await TestAttempt.destroy({
      where: { student_id: id }
    });

    // Now delete the user
    await user.destroy();

    logger.info(`User ${user.email} deleted by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
};

/**
 * Activate user
 */
const activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.update({ is_active: true });

    logger.info(`User ${user.email} activated by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'User activated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Activate user error:', error);
    next(error);
  }
};

/**
 * Deactivate user
 */
const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.id) {
      throw new AppError('Cannot deactivate your own account', 400);
    }

    await user.update({ is_active: false });

    logger.info(`User ${user.email} deactivated by admin ${req.user.email}`);

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Deactivate user error:', error);
    next(error);
  }
};

/**
 * Get user's courses (for instructors)
 */
const getUserCourses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const courses = await Course.findAll({
      where: { instructor_id: id },
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'status', 'progress', 'enrolled_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      message: 'User courses retrieved successfully',
      data: {
        courses: courses.map(course => ({
          ...course.getPublicInfo(),
          enrollment_count: course.enrollments.length
        }))
      }
    });
  } catch (error) {
    logger.error('Get user courses error:', error);
    next(error);
  }
};

/**
 * Get user's enrollments (for students)
 */
const getUserEnrollments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const enrollments = await Enrollment.findAll({
      where: { student_id: id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'thumbnail', 'category', 'difficulty']
        }
      ],
      order: [['enrolled_at', 'DESC']]
    });

    res.json({
      success: true,
      message: 'User enrollments retrieved successfully',
      data: {
        enrollments: enrollments.map(enrollment => ({
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress,
          enrolled_at: enrollment.enrolled_at,
          completed_at: enrollment.completed_at,
          last_accessed_at: enrollment.last_accessed_at,
          course: enrollment.course.getPublicInfo()
        }))
      }
    });
  } catch (error) {
    logger.error('Get user enrollments error:', error);
    next(error);
  }
};
/**
 * Build aggregated student profile payload
 */
const buildStudentProfileData = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['google_id', 'password', 'reset_password_token', 'reset_password_expires'] }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const [enrollments, certificates, testAttempts] = await Promise.all([
    Enrollment.findAll({
      where: { student_id: userId },
      include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'thumbnail', 'category', 'difficulty'] }],
      order: [['enrolled_at', 'DESC']]
    }),
    Certificate.findAll({
      where: { student_id: userId, certificate_type: 'course' },
      order: [['issued_date', 'DESC']]
    }),
    TestAttempt.findAll({
      where: { student_id: userId, status: 'completed' },
      include: [{ model: CourseTest, as: 'test', attributes: ['id', 'title', 'course_id', 'passing_score'] }],
      order: [['completed_at', 'DESC']]
    })
  ]);

  return {
    profile: user.getPublicProfile(),
    enrollments: enrollments.map((e) => ({
      id: e.id,
      status: e.status,
      progress: e.progress,
      test_passed: e.test_passed,
      enrolled_at: e.enrolled_at,
      completed_at: e.completed_at,
      time_spent: e.time_spent,
      course: e.course ? e.course.getPublicInfo?.() || e.course : null
    })),
    certificates,
    testAttempts: testAttempts.map((a) => {
      const passingScore = a.test?.passing_score ?? 70;
      const score = parseFloat(a.score);
      return {
        id: a.id,
        score: a.score,
        status: a.status,
        completed_at: a.completed_at,
        test: a.test,
        isPassed: !Number.isNaN(score) && score >= passingScore
      };
    }),
    summary: {
      totalEnrolled: enrollments.length,
      contentCompleted: enrollments.filter((e) => ['content_completed', 'completed', 'certified'].includes(e.status)).length,
      certified: enrollments.filter((e) => e.status === 'certified').length,
      certificatesEarned: certificates.length,
      testsPassed: testAttempts.filter((a) => {
        const passingScore = a.test?.passing_score ?? 70;
        const score = parseFloat(a.score);
        return !Number.isNaN(score) && score >= passingScore;
      }).length
    }
  };
};

/**
 * Get aggregated student profile (admin)
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await buildStudentProfileData(id);
    res.json({
      success: true,
      message: 'Student profile retrieved successfully',
      data
    });
  } catch (error) {
    logger.error('Get student profile error:', error);
    next(error);
  }
};

/**
 * Update student profile (admin)
 */
const updateStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        throw new AppError('Email already in use', 400);
      }
    }

    if (req.body.student_id && req.body.student_id !== user.student_id) {
      const existingStudentId = await User.findOne({ where: { student_id: req.body.student_id } });
      if (existingStudentId && existingStudentId.id !== parseInt(id)) {
        throw new AppError('Student ID already in use', 400);
      }
    }

    const allowedFields = [
      'name', 'email', 'bio', 'phone', 'location', 'student_id', 'date_of_birth',
      'gender', 'education_level', 'college_name', 'graduation_year', 'specialization',
      'joined_at', 'emergency_contact_name', 'emergency_contact_phone', 'is_active',
      'notification_preferences'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);
    const data = await buildStudentProfileData(id);

    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data
    });
  } catch (error) {
    logger.error('Update student profile error:', error);
    next(error);
  }
};

/**
 * Update user plan type (Admin only)
 */
const updateUserPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plan_type } = req.body;

    if (!['free', 'premium'].includes(plan_type)) {
      throw new AppError('Invalid plan type. Must be "free" or "premium"', 400);
    }

    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.update({ plan_type });

    logger.info(`Admin ${req.user.email} updated user ${user.email} plan to ${plan_type}`);

    res.json({
      success: true,
      message: `User plan updated to ${plan_type} successfully`,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan_type: user.plan_type
        }
      }
    });
  } catch (error) {
    logger.error('Update user plan error:', error);
    next(error);
  }
};

/**
 * Get student performance (admin only)
 */
const getStudentPerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await studentPerformanceService.getStudentPerformance(id);

    res.json({
      success: true,
      message: 'Student performance retrieved successfully',
      data
    });
  } catch (error) {
    logger.error('Get student performance error:', error);
    next(error);
  }
};

module.exports = {
  getUsers,
  getStudents,
  searchUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUserCourses,
  getUserEnrollments,
  getStudentProfile,
  updateStudentProfile,
  buildStudentProfileData,
  updateUserPlan,
  getStudentPerformance
};

