const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const RealtimeProjectSubmission = sequelize.define('RealtimeProjectSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        project_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Project folder name/ID from Realtime_projects'
        },
        project_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        // Submission URLs
        github_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        deployed_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        demo_video_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        // Content
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        technologies_used: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            allowNull: true
        },
        challenges_faced: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        learnings: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        // Attachments (URL-based)
        screenshots_urls: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            allowNull: true,
            comment: 'Array of screenshot URLs (Google Drive, Imgur, etc.)'
        },
        documentation_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Google Docs/Drive URL for documentation'
        },

        // Status & Approval
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'revision_requested'),
            defaultValue: 'pending',
            allowNull: false
        },
        submitted_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        reviewed_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reviewed_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        admin_feedback: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        // Scoring
        points_awarded: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: false
        }
    }, {
        tableName: 'realtime_project_submissions',
        underscored: true,
        indexes: [
            {
                fields: ['student_id'],
                name: 'idx_rps_student'
            },
            {
                fields: ['status'],
                name: 'idx_rps_status'
            },
            {
                fields: ['project_id'],
                name: 'idx_rps_project'
            },
            {
                unique: true,
                fields: ['student_id', 'project_id'],
                name: 'unique_student_project'
            }
        ]
    });

    // Instance methods
    RealtimeProjectSubmission.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        return values;
    };

    RealtimeProjectSubmission.prototype.approve = async function (reviewerId, feedback = null, points = 0) {
        this.status = 'approved';
        this.reviewed_at = new Date();
        this.reviewed_by = reviewerId;
        this.admin_feedback = feedback;
        this.points_awarded = points;
        return await this.save();
    };

    RealtimeProjectSubmission.prototype.reject = async function (reviewerId, feedback) {
        this.status = 'rejected';
        this.reviewed_at = new Date();
        this.reviewed_by = reviewerId;
        this.admin_feedback = feedback;
        return await this.save();
    };

    RealtimeProjectSubmission.prototype.requestRevision = async function (reviewerId, feedback) {
        this.status = 'revision_requested';
        this.reviewed_at = new Date();
        this.reviewed_by = reviewerId;
        this.admin_feedback = feedback;
        return await this.save();
    };

    // Class methods
    RealtimeProjectSubmission.findByStudent = function (studentId) {
        return this.findAll({
            where: { student_id: studentId },
            order: [['submitted_at', 'DESC']]
        });
    };

    RealtimeProjectSubmission.findByProject = function (projectId) {
        return this.findAll({
            where: { project_id: projectId },
            order: [['submitted_at', 'DESC']]
        });
    };

    RealtimeProjectSubmission.findPending = function () {
        return this.findAll({
            where: { status: 'pending' },
            order: [['submitted_at', 'ASC']]
        });
    };

    RealtimeProjectSubmission.checkExists = async function (studentId, projectId) {
        return await this.findOne({
            where: {
                student_id: studentId,
                project_id: projectId
            }
        });
    };

    return RealtimeProjectSubmission;
};
