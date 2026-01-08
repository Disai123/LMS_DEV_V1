const { expect } = require('@playwright/test');
const SELECTORS = require('./selectors');
const { TEST_CONFIG } = require('./test-data');

/**
 * Helper Functions for E2E Tests
 * Reusable functions to reduce code duplication
 */

/**
 * Login helper function
 * @param {Page} page - Playwright page object
 * @param {Object} credentials - User credentials {email, password}
 */
async function login(page, credentials) {
    console.log(`🔐 Logging in as: ${credentials.email}`);

    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Fill login form
    await page.fill(SELECTORS.LOGIN.EMAIL_INPUT, credentials.email);
    await page.fill(SELECTORS.LOGIN.PASSWORD_INPUT, credentials.password);

    // Submit login
    await page.click(SELECTORS.LOGIN.SUBMIT_BUTTON);

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: TEST_CONFIG.NAVIGATION_TIMEOUT });

    console.log('✅ Login successful');
}

/**
 * Logout helper function
 * @param {Page} page - Playwright page object
 */
async function logout(page) {
    console.log('🚪 Logging out...');

    // Click user menu
    await page.click(SELECTORS.NAV.USER_MENU);
    await page.waitForTimeout(500);

    // Click logout button
    await page.click(SELECTORS.NAV.LOGOUT_BUTTON);

    // Wait for redirect to home page
    await page.waitForURL('**/', { timeout: TEST_CONFIG.NAVIGATION_TIMEOUT });

    console.log('✅ Logout successful');
}

/**
 * Navigate to a specific page
 * @param {Page} page - Playwright page object
 * @param {string} path - Path to navigate to
 */
async function navigateTo(page, path) {
    console.log(`🧭 Navigating to: ${path}`);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
}

/**
 * Wait for element to be visible
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElement(page, selector, timeout = TEST_CONFIG.ACTION_TIMEOUT) {
    await page.waitForSelector(selector, {
        state: 'visible',
        timeout
    });
}

/**
 * Take screenshot with custom name
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
    const timestamp = Date.now();
    const filename = `${name}-${timestamp}.png`;
    await page.screenshot({
        path: `test-results/screenshots/${filename}`,
        fullPage: true
    });
    console.log(`📸 Screenshot saved: ${filename}`);
    return filename;
}

/**
 * Wait for video content to load
 * @param {Page} page - Playwright page object
 */
async function waitForVideoContent(page) {
    console.log('⏳ Waiting for video content to load...');

    // Wait for video player to be visible
    await waitForElement(page, SELECTORS.COURSE.VIDEO_PLAYER);

    // Additional wait for video to initialize
    await page.waitForTimeout(TEST_CONFIG.VIDEO_WAIT_TIME);

    console.log('✅ Video content loaded');
}

/**
 * Mark chapter as complete
 * @param {Page} page - Playwright page object
 */
async function markChapterComplete(page) {
    console.log('✅ Marking chapter as complete...');

    // Look for "Mark as Complete" button
    const completeButton = page.locator(SELECTORS.COURSE.MARK_COMPLETE_BUTTON);

    if (await completeButton.isVisible()) {
        await completeButton.click();
        await page.waitForTimeout(TEST_CONFIG.CHAPTER_COMPLETE_WAIT);
        console.log('✅ Chapter marked as complete');
    } else {
        console.log('ℹ️  No "Mark as Complete" button found - chapter may auto-complete');
    }
}

/**
 * Get course progress percentage
 * @param {Page} page - Playwright page object
 * @returns {number} Progress percentage
 */
async function getCourseProgress(page) {
    try {
        // Try to find progress text (e.g., "100% Complete")
        const progressText = await page.locator(SELECTORS.COURSE.PROGRESS_TEXT).first().textContent();
        const match = progressText.match(/(\d+)%/);

        if (match) {
            return parseInt(match[1]);
        }

        // Alternative: check progress bar aria-valuenow
        const progressBar = page.locator(SELECTORS.COURSE.PROGRESS_BAR).first();
        const ariaValue = await progressBar.getAttribute('aria-valuenow');

        if (ariaValue) {
            return parseInt(ariaValue);
        }

        return 0;
    } catch (error) {
        console.warn('⚠️  Could not determine course progress:', error.message);
        return 0;
    }
}

/**
 * Enroll in a course
 * @param {Page} page - Playwright page object
 * @param {number} courseId - Course ID
 */
async function enrollInCourse(page, courseId) {
    console.log(`📚 Enrolling in course ID: ${courseId}`);

    // Navigate to course page
    await navigateTo(page, `/courses/${courseId}`);

    // Click enroll button
    await page.click(SELECTORS.COURSES.ENROLL_BUTTON);

    // Wait for enrollment to complete
    await page.waitForTimeout(2000);

    console.log('✅ Enrollment successful');
}

/**
 * Access a chapter by title
 * @param {Page} page - Playwright page object
 * @param {string} chapterTitle - Chapter title to click
 */
async function accessChapter(page, chapterTitle) {
    console.log(`📖 Accessing chapter: ${chapterTitle}`);

    // Find and click the chapter
    const chapterLink = page.locator(SELECTORS.COURSE.CHAPTER_ITEM)
        .filter({ hasText: chapterTitle })
        .first();

    await chapterLink.click();
    await page.waitForLoadState('networkidle');

    console.log(`✅ Chapter accessed: ${chapterTitle}`);
}

/**
 * Submit test answers
 * @param {Page} page - Playwright page object
 * @param {Array} answers - Array of answer indices to select
 */
async function submitTest(page, answers = [0]) {
    console.log('📝 Submitting test...');

    // Select answers
    for (let i = 0; i < answers.length; i++) {
        const answerOptions = page.locator(SELECTORS.TEST.ANSWER_OPTION);
        const answerCount = await answerOptions.count();

        if (answerCount > 0) {
            const answerIndex = Math.min(answers[i], answerCount - 1);
            await answerOptions.nth(answerIndex).click();
            await page.waitForTimeout(500);
        }
    }

    // Submit test
    await page.click(SELECTORS.TEST.SUBMIT_TEST_BUTTON);
    await page.waitForTimeout(TEST_CONFIG.TEST_SUBMIT_WAIT);

    console.log('✅ Test submitted');
}

/**
 * Get test score from results page
 * @param {Page} page - Playwright page object
 * @returns {number} Test score percentage
 */
async function getTestScore(page) {
    try {
        const scoreText = await page.locator(SELECTORS.TEST.SCORE_DISPLAY).first().textContent();
        const match = scoreText.match(/(\d+)%/);

        if (match) {
            return parseInt(match[1]);
        }

        return 0;
    } catch (error) {
        console.warn('⚠️  Could not determine test score:', error.message);
        return 0;
    }
}

/**
 * Verify element contains text
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {string} expectedText - Expected text content
 */
async function verifyElementText(page, selector, expectedText) {
    const element = page.locator(selector).first();
    await expect(element).toContainText(expectedText, { ignoreCase: true });
}

/**
 * Wait for navigation and verify URL
 * @param {Page} page - Playwright page object
 * @param {string} expectedUrl - Expected URL pattern
 */
async function verifyNavigation(page, expectedUrl) {
    await page.waitForURL(expectedUrl, { timeout: TEST_CONFIG.NAVIGATION_TIMEOUT });
    const currentUrl = page.url();
    console.log(`✅ Navigated to: ${currentUrl}`);
}

module.exports = {
    login,
    logout,
    navigateTo,
    waitForElement,
    takeScreenshot,
    waitForVideoContent,
    markChapterComplete,
    getCourseProgress,
    enrollInCourse,
    accessChapter,
    submitTest,
    getTestScore,
    verifyElementText,
    verifyNavigation
};
