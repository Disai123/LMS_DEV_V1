const { InternshipSubmission, User, Internship, sequelize } = require('../models');
const scoringService = require('../services/scoringService');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Submit internship completion tasks
 */
exports.submitInternship = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            internship_id,
            internship_title,
            github_url,
            drive_url,
            documentation_url,
            description
        } = req.body;

        if (!internship_id || !internship_title) {
            return res.status(400).json({
                success: false,
                message: 'Internship ID and title are required'
            });
        }

        // Check if already submitted
        const existing = await InternshipSubmission.findOne({
            where: { student_id: studentId, internship_id }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted tasks for this internship. Use the edit option to update.',
                data: existing
            });
        }

        // Create submission
        const submission = await InternshipSubmission.create({
            student_id: studentId,
            internship_id,
            internship_title,
            github_url,
            drive_url,
            documentation_url,
            description,
            status: 'pending',
            submitted_at: new Date()
        });

        logger.info(`Internship submission created: ${submission.id} by student ${studentId}`);

        res.status(201).json({
            success: true,
            message: 'Internship tasks submitted successfully',
            data: submission
        });
    } catch (error) {
        logger.error('Error submitting internship tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit internship tasks',
            error: error.message
        });
    }
};

/**
 * Get student's own submission for a specific internship
 */
exports.getMySubmissionForInternship = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { internship_id } = req.params;

        const submission = await InternshipSubmission.findOne({
            where: { student_id: studentId, internship_id }
        });

        res.json({
            success: true,
            data: submission || null
        });
    } catch (error) {
        logger.error('Error fetching submission for internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submission'
        });
    }
};

/**
 * Student: Update (re-submit) their own submission
 * Resets status to 'pending' so admin re-evaluates
 */
exports.updateSubmission = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { id } = req.params;
        const { github_url, drive_url, documentation_url, description } = req.body;

        const submission = await InternshipSubmission.findOne({
            where: { id, student_id: studentId }
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found or you do not have permission to edit it'
            });
        }

        if (submission.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Approved submissions cannot be edited'
            });
        }

        await submission.update({
            github_url,
            drive_url,
            documentation_url,
            description,
            status: 'pending',   // reset to pending so admin re-evaluates
            submitted_at: new Date(),
            reviewed_at: null,
            admin_feedback: null
        });

        logger.info(`Internship submission ${id} updated by student ${studentId} — reset to pending`);

        res.json({
            success: true,
            message: 'Submission updated. It will be re-evaluated by the admin.',
            data: submission
        });
    } catch (error) {
        logger.error('Error updating internship submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: error.message
        });
    }
};



/**
 * Get student's own submissions
 */
exports.getMySubmissions = async (req, res) => {
    try {
        const studentId = req.user.id;
        const submissions = await InternshipSubmission.findAll({
            where: { student_id: studentId },
            order: [['submitted_at', 'DESC']]
        });

        res.json({
            success: true,
            data: submissions
        });
    } catch (error) {
        logger.error('Error fetching internship submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions'
        });
    }
};

/**
 * Admin: Get all submissions
 */
exports.getAllSubmissions = async (req, res) => {
    try {
        const { status, internship_id, page = 1, limit = 20 } = req.query;
        const where = {};
        if (status) where.status = status;
        if (internship_id) where.internship_id = internship_id;

        const offset = (page - 1) * limit;

        const { rows: submissions, count } = await InternshipSubmission.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['submitted_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: submissions,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching internship submissions for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions'
        });
    }
};

/**
 * Admin: Get submission statistics
 */
exports.getSubmissionStats = async (req, res) => {
    try {
        const stats = await InternshipSubmission.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        const formattedStats = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            revision_requested: 0
        };

        stats.forEach(s => {
            const status = s.status;
            const count = parseInt(s.get('count'));
            if (formattedStats.hasOwnProperty(status)) {
                formattedStats[status] = count;
                formattedStats.total += count;
            }
        });

        res.json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        logger.error('Error fetching internship submission stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
};

/**
 * Admin: Approve submission
 */
exports.approveSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, points = 100 } = req.body;
        const reviewerId = req.user.id;

        const submission = await InternshipSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        if (submission.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Submission already approved'
            });
        }

        // Update submission status
        await submission.approve(reviewerId, feedback, points);

        // Award points via scoring service
        await scoringService.awardInternshipPoints({
            studentId: submission.student_id,
            internshipId: submission.internship_id,
            internshipTitle: submission.internship_title,
            points,
            approvedBy: reviewerId
        });

        logger.info(`Internship submission ${id} approved by admin ${reviewerId}`);

        res.json({
            success: true,
            message: 'Internship submission approved and points awarded',
            data: submission
        });
    } catch (error) {
        logger.error('Error approving internship submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve submission',
            error: error.message
        });
    }
};

/**
 * Admin: Reject submission
 */
exports.rejectSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const reviewerId = req.user.id;

        if (!feedback) {
            return res.status(400).json({
                success: false,
                message: 'Feedback is required for rejection'
            });
        }

        const submission = await InternshipSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        await submission.reject(reviewerId, feedback);

        logger.info(`Internship submission ${id} rejected by admin ${reviewerId}`);

        res.json({
            success: true,
            message: 'Internship submission rejected',
            data: submission
        });
    } catch (error) {
        logger.error('Error rejecting internship submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject submission'
        });
    }
};
