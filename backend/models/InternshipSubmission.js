const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const InternshipSubmission = sequelize.define('InternshipSubmission', {
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
        internship_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'internships',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        internship_title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        // Submission Details
        github_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        drive_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        documentation_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
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
        }
    }, {
        tableName: 'internship_submissions',
        underscored: true,
        indexes: [
            {
                fields: ['student_id']
            },
            {
                fields: ['internship_id']
            },
            {
                fields: ['status']
            },
            {
                unique: true,
                fields: ['student_id', 'internship_id'],
                name: 'unique_student_internship_submission'
            }
        ]
    });

    // Instance methods
    InternshipSubmission.prototype.approve = async function (reviewerId, feedback = null, points = 0) {
        this.status = 'approved';
        this.reviewed_at = new Date();
        this.reviewed_by = reviewerId;
        this.admin_feedback = feedback;
        this.points_awarded = points;
        return await this.save();
    };

    InternshipSubmission.prototype.reject = async function (reviewerId, feedback) {
        this.status = 'rejected';
        this.reviewed_at = new Date();
        this.reviewed_by = reviewerId;
        this.admin_feedback = feedback;
        return await this.save();
    };

    return InternshipSubmission;
};
