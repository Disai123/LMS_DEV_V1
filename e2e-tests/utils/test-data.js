const fs = require('fs');
const path = require('path');

/**
 * Test Data Management Utilities
 * Handles generation and storage of test data for E2E tests
 */

class TestDataManager {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'test-data');
        this.credentialsFile = path.join(this.dataDir, 'user-credentials.json');
        this.ensureDataDirectory();
    }

    /**
     * Ensure test-data directory exists
     */
    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    /**
     * Generate random user credentials
     * @returns {Object} User credentials object
     */
    generateUserCredentials() {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);

        return {
            name: `Test Student ${randomNum}`,
            email: `testuser${timestamp}${randomNum}@example.com`,
            password: 'TestPassword123!',
            createdAt: new Date().toISOString()
        };
    }

    /**
     * Save user credentials to file
     * @param {Object} credentials - User credentials to save
     */
    saveUserCredentials(credentials) {
        try {
            let allCredentials = [];

            // Read existing credentials if file exists
            if (fs.existsSync(this.credentialsFile)) {
                const fileContent = fs.readFileSync(this.credentialsFile, 'utf8');
                allCredentials = JSON.parse(fileContent);
            }

            // Add new credentials
            allCredentials.push(credentials);

            // Keep only last 10 credentials
            if (allCredentials.length > 10) {
                allCredentials = allCredentials.slice(-10);
            }

            // Write back to file
            fs.writeFileSync(
                this.credentialsFile,
                JSON.stringify(allCredentials, null, 2),
                'utf8'
            );

            console.log('✅ User credentials saved successfully');
        } catch (error) {
            console.error('❌ Error saving user credentials:', error.message);
        }
    }

    /**
     * Get the most recent user credentials
     * @returns {Object|null} Most recent user credentials or null
     */
    getLatestUserCredentials() {
        try {
            if (!fs.existsSync(this.credentialsFile)) {
                return null;
            }

            const fileContent = fs.readFileSync(this.credentialsFile, 'utf8');
            const allCredentials = JSON.parse(fileContent);

            if (allCredentials.length === 0) {
                return null;
            }

            return allCredentials[allCredentials.length - 1];
        } catch (error) {
            console.error('❌ Error reading user credentials:', error.message);
            return null;
        }
    }

    /**
     * Clear all saved credentials
     */
    clearAllCredentials() {
        try {
            if (fs.existsSync(this.credentialsFile)) {
                fs.unlinkSync(this.credentialsFile);
                console.log('✅ All user credentials cleared');
            }
        } catch (error) {
            console.error('❌ Error clearing credentials:', error.message);
        }
    }
}

/**
 * Course and Chapter Data Constants
 */
const COURSE_DATA = {
    DEMO_COURSE: {
        id: process.env.DEMO_COURSE_ID || 7,
        title: 'Demo',
        chapters: [
            {
                order: 1,
                title: 'Introduction to Machine Learning',
                type: 'video'
            },
            {
                order: 2,
                title: 'Advanced ML Concepts',
                type: 'video'
            }
        ],
        test: {
            name: 'test_final',
            questions: 1,
            passingScore: 100
        }
    }
};

/**
 * Test Configuration Constants
 */
const TEST_CONFIG = {
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT) || 60000,
    NAVIGATION_TIMEOUT: parseInt(process.env.NAVIGATION_TIMEOUT) || 30000,
    ACTION_TIMEOUT: parseInt(process.env.ACTION_TIMEOUT) || 15000,
    VIDEO_WAIT_TIME: 3000, // Wait time for video to load
    CHAPTER_COMPLETE_WAIT: 2000, // Wait time after marking chapter complete
    TEST_SUBMIT_WAIT: 3000, // Wait time after test submission
};

module.exports = {
    TestDataManager,
    COURSE_DATA,
    TEST_CONFIG
};
