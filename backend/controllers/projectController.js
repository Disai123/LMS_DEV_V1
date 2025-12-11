const { Project, Document, User, Video, ProjectProgress, ProjectPhase } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const scoringService = require('../services/scoringService');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const { status, difficulty, category, isPublished, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (difficulty) whereClause.difficulty = difficulty;
    if (category) whereClause.category = category;
    if (isPublished !== undefined) whereClause.is_published = isPublished === 'true';

    const offset = (page - 1) * limit;
    
    const projects = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Document,
          as: 'documents',
          attributes: ['id', 'title', 'document_type', 'phase', 'file_url'],
          required: false
        },
        {
          model: Video,
          as: 'videos',
          attributes: ['id', 'title', 'description', 'video_url', 'video_type', 'phase', 'phase_number', 'duration', 'view_count'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      success: true,
      data: {
        projects: projects.rows,
        pagination: {
          total: projects.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(projects.count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Document,
          as: 'documents',
          attributes: ['id', 'title', 'description', 'document_type', 'phase', 'file_url', 'file_size', 'mime_type', 'created_at'],
          required: false,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Video,
          as: 'videos',
          attributes: ['id', 'title', 'description', 'video_url', 'video_type', 'phase', 'phase_number', 'duration', 'view_count', 'created_at'],
          required: false,
          order: [['video_type', 'ASC'], ['phase_number', 'ASC'], ['created_at', 'DESC']]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create new project (Admin only)
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      estimatedDuration,
      category,
      technologies,
      phases,
      thumbnail,
      logo
    } = req.body;

    const project = await Project.create({
      title,
      description,
      difficulty,
      estimatedDuration,
      category,
      technologies,
      phases,
      thumbnail,
      logo,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    // Fetch the created project with associations
    const createdProject = await Project.findByPk(project.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: createdProject
    });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Add updatedBy to the update data
    updateData.updatedBy = req.user.id;

    const [updatedRowsCount] = await Project.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Fetch the updated project
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project (Admin only)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRowsCount = await Project.destroy({
      where: { id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Publish/Unpublish project (Admin only)
const toggleProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updateData = {
      is_published,
      updated_by: req.user.id
    };

    if (is_published && !project.published_at) {
      updateData.published_at = new Date();
    }

    await Project.update(updateData, {
      where: { id }
    });

    res.json({
      success: true,
      message: `Project ${is_published ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    logger.error('Error toggling project status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project status',
      error: error.message
    });
  }
};

// Get project statistics (Admin only)
const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const publishedProjects = await Project.count({ where: { is_published: true } });
    const activeProjects = await Project.count({ where: { status: 'active' } });
    
    const projectsByDifficulty = await Project.findAll({
      attributes: [
        'difficulty',
        [Project.sequelize.fn('COUNT', Project.sequelize.col('id')), 'count']
      ],
      group: ['difficulty'],
      raw: true
    });

    const projectsByCategory = await Project.findAll({
      attributes: [
        'category',
        [Project.sequelize.fn('COUNT', Project.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        publishedProjects,
        activeProjects,
        projectsByDifficulty,
        projectsByCategory
      }
    });
  } catch (error) {
    logger.error('Error fetching project statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project statistics',
      error: error.message
    });
  }
};

// Seed projects (Admin only)
const seedProjects = async (req, res) => {
  try {
    const seedProjectsScript = require('../seed-projects');
    await seedProjectsScript();
    
    res.json({
      success: true,
      message: 'Projects seeded successfully'
    });
  } catch (error) {
    logger.error('Error seeding projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding projects',
      error: error.message
    });
  }
};

// Submit project for review (Student only)
const submitProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { submission_url } = req.body;
    const studentId = req.user.id;

    if (!submission_url || !submission_url.trim()) {
      throw new AppError('Submission URL is required', 400);
    }

    // Validate URL format
    try {
      new URL(submission_url);
    } catch (e) {
      throw new AppError('Invalid URL format', 400);
    }

    // Get project
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Get all phases for this project
    const phases = await ProjectPhase.findAll({
      where: { projectId: projectId }
    });

    if (phases.length === 0) {
      throw new AppError('Project has no phases', 400);
    }

    // Check if all phases are completed
    const phaseIds = phases.map(p => p.id);
    const completedPhases = await ProjectProgress.findAll({
      where: {
        userId: studentId,
        projectId: projectId,
        phaseId: { [Op.in]: phaseIds },
        status: 'completed'
      }
    });

    if (completedPhases.length !== phases.length) {
      throw new AppError('All phases must be completed before submission', 400);
    }

    // Check if already submitted
    const existingSubmission = await ProjectProgress.findOne({
      where: {
        userId: studentId,
        projectId: projectId,
        submission_url: { [Op.ne]: null }
      }
    });

    if (existingSubmission && existingSubmission.submission_url) {
      throw new AppError('Project already submitted', 400);
    }

    // Update or create project progress with submission
    const [progress] = await ProjectProgress.findOrCreate({
      where: {
        userId: studentId,
        projectId: projectId,
        phaseId: null // Overall project submission
      },
      defaults: {
        userId: studentId,
        projectId: projectId,
        phaseId: null,
        status: 'completed',
        progressPercentage: 100
      }
    });

    await progress.update({
      submission_url: submission_url.trim(),
      submitted_at: new Date(),
      status: 'completed',
      progressPercentage: 100
    });

    logger.info(`Project submitted: student ${studentId}, project ${projectId}`);

    res.json({
      success: true,
      message: 'Project submitted successfully for review',
      data: {
        submission: {
          project_id: projectId,
          submission_url: progress.submission_url,
          submitted_at: progress.submitted_at
        }
      }
    });
  } catch (error) {
    logger.error('Error submitting project:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error submitting project',
        error: error.message
      });
    }
  }
};

// Get pending project submissions (Admin only)
const getProjectSubmissions = async (req, res) => {
  try {
    const { status = 'pending', projectId } = req.query;

    const whereClause = {
      submission_url: { [Op.ne]: null }
    };

    if (status === 'pending') {
      whereClause.admin_approved = false;
    } else if (status === 'approved') {
      whereClause.admin_approved = true;
    }

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const submissions = await ProjectProgress.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'difficulty']
        },
        {
          model: User,
          as: 'approvedBy',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        submissions: submissions.map(sub => ({
          id: sub.id,
          student: sub.user,
          project: sub.project,
          submission_url: sub.submission_url,
          submitted_at: sub.submitted_at,
          admin_approved: sub.admin_approved,
          approved_by: sub.approvedBy,
          approved_at: sub.approved_at,
          review_notes: sub.review_notes,
          points_awarded: sub.points_awarded
        }))
      }
    });
  } catch (error) {
    logger.error('Error fetching project submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project submissions',
      error: error.message
    });
  }
};

// Approve project submission (Admin only)
const approveProjectSubmission = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;
    const { review_notes } = req.body;
    const adminId = req.user.id;

    // Get project progress
    const progress = await ProjectProgress.findOne({
      where: {
        projectId: projectId,
        userId: studentId,
        submission_url: { [Op.ne]: null }
      },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'difficulty']
        }
      ]
    });

    if (!progress) {
      throw new AppError('Project submission not found', 404);
    }

    if (progress.admin_approved) {
      throw new AppError('Project already approved', 400);
    }

    // Get project difficulty for points calculation
    const projectDifficulty = progress.project?.difficulty || 'intermediate';

    // Update progress
    await progress.update({
      admin_approved: true,
      approved_by: adminId,
      approved_at: new Date(),
      review_notes: review_notes || null
    });

    // Award points
    try {
      await scoringService.awardProjectPoints({
        studentId: studentId,
        projectId: projectId,
        approvedBy: adminId,
        projectDifficulty: projectDifficulty
      });

      // Update points_awarded in progress
      const points = await scoringService.getPointsForRule('project_approval', projectDifficulty);
      await progress.update({ points_awarded: points });
    } catch (scoringError) {
      logger.error('Error awarding project points:', scoringError);
      // Don't fail the approval if scoring fails
    }

    logger.info(`Project approved: student ${studentId}, project ${projectId} by admin ${adminId}`);

    res.json({
      success: true,
      message: 'Project approved successfully',
      data: {
        submission: {
          project_id: projectId,
          student_id: studentId,
          approved: true,
          approved_at: progress.approved_at,
          points_awarded: progress.points_awarded
        }
      }
    });
  } catch (error) {
    logger.error('Error approving project submission:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error approving project submission',
        error: error.message
      });
    }
  }
};

// Reject project submission (Admin only)
const rejectProjectSubmission = async (req, res) => {
  try {
    const { projectId, studentId } = req.params;
    const { review_notes } = req.body;
    const adminId = req.user.id;

    if (!review_notes || !review_notes.trim()) {
      throw new AppError('Review notes are required for rejection', 400);
    }

    // Get project progress
    const progress = await ProjectProgress.findOne({
      where: {
        projectId: projectId,
        userId: studentId,
        submission_url: { [Op.ne]: null }
      }
    });

    if (!progress) {
      throw new AppError('Project submission not found', 404);
    }

    if (progress.admin_approved) {
      throw new AppError('Cannot reject an already approved project', 400);
    }

    // Update progress with rejection notes
    await progress.update({
      review_notes: review_notes.trim(),
      approved_by: adminId,
      approved_at: new Date()
      // admin_approved remains false
    });

    logger.info(`Project rejected: student ${studentId}, project ${projectId} by admin ${adminId}`);

    res.json({
      success: true,
      message: 'Project rejected',
      data: {
        submission: {
          project_id: projectId,
          student_id: studentId,
          rejected: true,
          review_notes: progress.review_notes
        }
      }
    });
  } catch (error) {
    logger.error('Error rejecting project submission:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error rejecting project submission',
        error: error.message
      });
    }
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  getProjectStats,
  seedProjects,
  submitProject,
  getProjectSubmissions,
  approveProjectSubmission,
  rejectProjectSubmission
};