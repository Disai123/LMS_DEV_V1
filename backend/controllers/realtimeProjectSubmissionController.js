const { RealtimeProjectSubmission, User } = require('../models');
const scoringService = require('../services/scoringService');
const { issueRealtimeProjectCertificate } = require('./certificateController');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const notificationService = require('../services/notificationService');

/**
 * Submit a new realtime project
 */
exports.submitProject = async (req, res) => {
    try {
        const studentId = req.user.id;
        const {
            project_id,
            project_name,
            github_url,
            deployed_url,
            demo_video_url,
            description,
            technologies_used,
            challenges_faced,
            learnings,
            screenshots_urls,
            documentation_url,
            difficulty
        } = req.body;

        // Validate required fields
        if (!project_id || !project_name || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Project ID, name, and difficulty are required'
            });
        }

        // Check if already submitted
        const existing = await RealtimeProjectSubmission.checkExists(studentId, project_id);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this project',
                data: existing
            });
        }

        // Create submission
        const submission = await RealtimeProjectSubmission.create({
            student_id: studentId,
            project_id,
            project_name,
            github_url,
            deployed_url,
            demo_video_url,
            description,
            technologies_used: technologies_used || [],
            challenges_faced,
            learnings,
            screenshots_urls: screenshots_urls || [],
            documentation_url,
            difficulty,
            status: 'pending',
            submitted_at: new Date()
        });

        logger.info(`Project submission created: ${submission.id} by student ${studentId}`);

        // Notification
        await notificationService.create(
            studentId,
            'project_submitted',
            'Project Submitted',
            `Your real-time project "${project_name}" has been submitted successfully!`,
            `/projects`
        );

        res.status(201).json({
            success: true,
            message: 'Project submitted successfully',
            data: submission
        });
    } catch (error) {
        logger.error('Error submitting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit project',
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

        const submissions = await RealtimeProjectSubmission.findByStudent(studentId);

        res.json({
            success: true,
            data: submissions,
            count: submissions.length
        });
    } catch (error) {
        logger.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message
        });
    }
};

/**
 * Get submission by ID
 */
exports.getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.user_type === 'admin';

        const submission = await RealtimeProjectSubmission.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'username', 'email', 'first_name', 'last_name']
                },
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['id', 'username', 'first_name', 'last_name']
                }
            ]
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check authorization
        if (!isAdmin && submission.student_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this submission'
            });
        }

        res.json({
            success: true,
            data: submission
        });
    } catch (error) {
        logger.error('Error fetching submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submission',
            error: error.message
        });
    }
};

/**
 * Update submission (only if pending)
 */
exports.updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;
        const updateData = req.body;

        const submission = await RealtimeProjectSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check authorization
        if (submission.student_id !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this submission'
            });
        }

        // Can only update if pending or revision requested
        if (submission.status !== 'pending' && submission.status !== 'revision_requested') {
            return res.status(400).json({
                success: false,
                message: `Cannot update submission with status: ${submission.status}`
            });
        }

        // Update submission
        await submission.update(updateData);

        logger.info(`Submission updated: ${id} by student ${studentId}`);

        res.json({
            success: true,
            message: 'Submission updated successfully',
            data: submission
        });
    } catch (error) {
        logger.error('Error updating submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: error.message
        });
    }
};

/**
 * Delete submission (only if pending)
 */
exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;

        const submission = await RealtimeProjectSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check authorization
        if (submission.student_id !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this submission'
            });
        }

        // Can only delete if pending
        if (submission.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot delete submission with status: ${submission.status}`
            });
        }

        await submission.destroy();

        logger.info(`Submission deleted: ${id} by student ${studentId}`);

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete submission',
            error: error.message
        });
    }
};

/**
 * Get all submissions (Admin only)
 */
exports.getAllSubmissions = async (req, res) => {
    try {
        const { status, project_id, student_id, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (project_id) where.project_id = project_id;
        if (student_id) where.student_id = student_id;

        const offset = (page - 1) * limit;

        const { rows: submissions, count } = await RealtimeProjectSubmission.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'reviewer',
                    attributes: ['id', 'name']
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
        logger.error('Error fetching all submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.message
        });
    }
};

/**
 * Approve submission (Admin only)
 */
exports.approveSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const reviewerId = req.user.id;

        const submission = await RealtimeProjectSubmission.findByPk(id);

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

        // Get points for this difficulty
        const points = await scoringService.getPointsForRule('realtime_project_completion', submission.difficulty);

        // Approve submission
        await submission.approve(reviewerId, feedback, points);


        // Award points - THIS IS CRITICAL, don't silently fail
        await scoringService.awardRealtimeProjectPoints({
            studentId: submission.student_id,
            projectId: submission.project_id,
            projectName: submission.project_name,
            difficulty: submission.difficulty
        });

        logger.info(`Awarded ${points} points for realtime project: ${submission.project_name} to student ${submission.student_id}`);

        // Issue certificate simultaneously with points award
        let certificate = null;
        try {
            const student = await User.findByPk(submission.student_id);
            certificate = await issueRealtimeProjectCertificate(submission, student);
            logger.info(`Certificate issued for realtime project: ${submission.project_name} to student ${submission.student_id}`);
        } catch (certError) {
            // Don't fail the approval if cert issuance fails — log and continue
            logger.error('Certificate issuance failed (non-critical):', certError);
        }

        // Notification
        await notificationService.create(
            submission.student_id,
            'project_reviewed',
            'Project Approved',
            `Your project "${submission.project_name}" was APPROVED. You earned ${points} points!`,
            `/projects`
        );

        res.json({
            success: true,
            message: 'Submission approved successfully',
            data: submission,
            points_awarded: points,
            certificate: certificate ? certificate.getPublicInfo() : null
        });
    } catch (error) {
        logger.error('Error approving submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve submission',
            error: error.message
        });
    }
};

/**
 * Reject submission (Admin only)
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

        const submission = await RealtimeProjectSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        await submission.reject(reviewerId, feedback);

        logger.info(`Submission rejected: ${id} by admin ${reviewerId}`);

        // Notification
        await notificationService.create(
            submission.student_id,
            'project_reviewed',
            'Project Rejected',
            `Your project "${submission.project_name}" was REJECTED. Notes: ${feedback}`,
            `/projects`
        );

        res.json({
            success: true,
            message: 'Submission rejected',
            data: submission
        });
    } catch (error) {
        logger.error('Error rejecting submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject submission',
            error: error.message
        });
    }
};

/**
 * Request revision (Admin only)
 */
exports.requestRevision = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const reviewerId = req.user.id;

        if (!feedback) {
            return res.status(400).json({
                success: false,
                message: 'Feedback is required for revision request'
            });
        }

        const submission = await RealtimeProjectSubmission.findByPk(id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        await submission.requestRevision(reviewerId, feedback);

        logger.info(`Revision requested for submission: ${id} by admin ${reviewerId}`);

        // Notification
        await notificationService.create(
            submission.student_id,
            'project_reviewed',
            'Project Revision Requested',
            `Revision requested for "${submission.project_name}". Notes: ${feedback}`,
            `/projects`
        );

        res.json({
            success: true,
            message: 'Revision requested',
            data: submission
        });
    } catch (error) {
        logger.error('Error requesting revision:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to request revision',
            error: error.message
        });
    }
};

/**
 * Get submission statistics (Admin only)
 */
exports.getSubmissionStats = async (req, res) => {
    try {
        const totalSubmissions = await RealtimeProjectSubmission.count();
        const pendingSubmissions = await RealtimeProjectSubmission.count({ where: { status: 'pending' } });
        const approvedSubmissions = await RealtimeProjectSubmission.count({ where: { status: 'approved' } });
        const rejectedSubmissions = await RealtimeProjectSubmission.count({ where: { status: 'rejected' } });
        const revisionRequestedSubmissions = await RealtimeProjectSubmission.count({ where: { status: 'revision_requested' } });

        // Get submissions by project
        const submissionsByProject = await RealtimeProjectSubmission.findAll({
            attributes: [
                'project_id',
                'project_name',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['project_id', 'project_name'],
            order: [[require('sequelize').literal('count'), 'DESC']]
        });

        res.json({
            success: true,
            data: {
                total: totalSubmissions,
                pending: pendingSubmissions,
                approved: approvedSubmissions,
                rejected: rejectedSubmissions,
                revision_requested: revisionRequestedSubmissions,
                by_project: submissionsByProject
            }
        });
    } catch (error) {
        logger.error('Error fetching submission stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
