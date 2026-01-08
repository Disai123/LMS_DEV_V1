const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if table already exists
        const tableExists = await queryInterface.sequelize.query(
            `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'realtime_project_submissions'
      );`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (tableExists[0].exists) {
            console.log('Table realtime_project_submissions already exists, skipping creation');
            return;
        }

        await queryInterface.createTable('realtime_project_submissions', {
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
            },

            // Timestamps
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Create indexes
        await queryInterface.addIndex('realtime_project_submissions', ['student_id'], {
            name: 'idx_rps_student'
        });

        await queryInterface.addIndex('realtime_project_submissions', ['status'], {
            name: 'idx_rps_status'
        });

        await queryInterface.addIndex('realtime_project_submissions', ['project_id'], {
            name: 'idx_rps_project'
        });

        // Create unique constraint
        await queryInterface.addConstraint('realtime_project_submissions', {
            fields: ['student_id', 'project_id'],
            type: 'unique',
            name: 'unique_student_project'
        });

        console.log('Created table: realtime_project_submissions');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('realtime_project_submissions');
    }
};
