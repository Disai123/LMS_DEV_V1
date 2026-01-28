const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

async function fixSchema() {
    const queryInterface = sequelize.getQueryInterface();
    const tableName = 'hackathon_submissions';

    try {
        console.log('Checking table schema for:', tableName);
        const tableDescription = await queryInterface.describeTable(tableName);

        // List of columns to ensure exist
        const columns = [
            { name: 'project_title', type: DataTypes.STRING(255) },
            { name: 'project_description', type: DataTypes.TEXT },
            { name: 'github_url', type: DataTypes.TEXT },
            { name: 'live_url', type: DataTypes.TEXT },
            { name: 'demo_video_url', type: DataTypes.TEXT },
            { name: 'presentation_url', type: DataTypes.TEXT },
            { name: 'documentation_url', type: DataTypes.TEXT },
            { name: 'additional_files_url', type: DataTypes.TEXT },
            { name: 'submission_notes', type: DataTypes.TEXT }
        ];

        for (const col of columns) {
            if (!tableDescription[col.name]) {
                console.log(`Adding missing column: ${col.name}`);
                await queryInterface.addColumn(tableName, col.name, {
                    type: col.type,
                    allowNull: true // Add as nullable first to avoid issues with existing rows
                });
                console.log(`Added column: ${col.name}`);
            } else {
                console.log(`Column exists: ${col.name}`);
            }
        }

        console.log('Schema repair completed successfully.');
    } catch (error) {
        console.error('Error fixing schema:', error);
    } finally {
        await sequelize.close();
    }
}

fixSchema();
