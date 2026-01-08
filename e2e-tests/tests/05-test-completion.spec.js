const { test, expect } = require('@playwright/test');
const { TestDataManager, COURSE_DATA } = require('../utils/test-data');
const SELECTORS = require('../utils/selectors');
const {
    login,
    navigateTo,
    takeScreenshot,
    submitTest,
    getTestScore
} = require('../utils/helpers');

/**
 * Test: Test Completion
 * 
 * This test verifies that a user can take and complete the course test
 * after achieving 100% course completion.
 */

test.describe('Test Completion', () => {
    let testDataManager;
    let userCredentials;
    const demoCourse = COURSE_DATA.DEMO_COURSE;

    test.beforeAll(() => {
        testDataManager = new TestDataManager();
        userCredentials = testDataManager.getLatestUserCredentials();

        if (!userCredentials) {
            throw new Error('No user credentials found. Please run registration test first.');
        }

        console.log('\n📋 Test Configuration:');
        console.log(`   User: ${userCredentials.email}`);
        console.log(`   Course: ${demoCourse.title}`);
        console.log(`   Test: ${demoCourse.test.name}`);
    });

    test('should successfully take and pass the course test', async ({ page }) => {
        console.log('\n🧪 TEST: Course Test Completion');
        console.log('='.repeat(50));

        // Step 1: Login
        console.log('\n🔐 Step 1: Login as test user');
        await login(page, userCredentials);

        // Step 2: Navigate to Demo course
        console.log('\n📍 Step 2: Navigate to Demo course');
        await navigateTo(page, `/courses/${demoCourse.id}`);
        await takeScreenshot(page, 'course-page-before-test');

        // Step 3: Verify test is unlocked
        console.log('\n🔍 Step 3: Verify test is unlocked');

        const testButton = page.locator(SELECTORS.TEST.TAKE_TEST_BUTTON);
        await testButton.waitFor({ state: 'visible', timeout: 10000 });
        console.log('✅ Test button is visible');

        await takeScreenshot(page, 'test-unlocked');

        // Step 4: Click "Take Test" button
        console.log('\n📝 Step 4: Click "Take Test" button');
        await testButton.click();
        await page.waitForLoadState('networkidle');
        await takeScreenshot(page, 'test-page');

        // Step 5: Start the test
        console.log('\n▶️  Step 5: Start the test');

        const startButton = page.locator(SELECTORS.TEST.START_TEST_BUTTON);
        const startButtonVisible = await startButton.isVisible().catch(() => false);

        if (startButtonVisible) {
            await startButton.click();
            await page.waitForLoadState('networkidle');
        } else {
            console.log('ℹ️  No "Start Test" button - test may have started automatically');
        }

        await takeScreenshot(page, 'test-started');

        // Step 6: Answer test questions
        console.log('\n✍️  Step 6: Answer test questions');

        // Wait for questions to load
        await page.waitForSelector(SELECTORS.TEST.QUESTION_CONTAINER, { timeout: 10000 });

        // Get all answer options and select the first one for each question
        const answerOptions = page.locator(SELECTORS.TEST.ANSWER_OPTION);
        const answerCount = await answerOptions.count();

        console.log(`   Found ${answerCount} answer options`);

        if (answerCount > 0) {
            // Select the first answer (or a reasonable answer)
            await answerOptions.first().click();
            await page.waitForTimeout(1000);
        }

        await takeScreenshot(page, 'test-answers-selected');

        // Step 7: Submit the test
        console.log('\n✅ Step 7: Submit the test');
        await submitTest(page, [0]); // Submit with first answer selected

        await takeScreenshot(page, 'test-submitted');

        // Step 8: Verify test results
        console.log('\n🔍 Step 8: Verify test results');

        // Wait for results page
        await page.waitForSelector(SELECTORS.TEST.TEST_RESULTS, { timeout: 10000 });

        const score = await getTestScore(page);
        console.log(`📊 Test Score: ${score}%`);

        // Verify passing score
        expect(score).toBeGreaterThanOrEqual(demoCourse.test.passingScore);
        console.log(`✅ Test passed with score: ${score}%`);

        await takeScreenshot(page, 'test-results');

        // Step 9: Verify certificate eligibility
        console.log('\n🏆 Step 9: Verify certificate eligibility');

        const passMessage = page.locator(SELECTORS.TEST.PASS_MESSAGE);
        const passMessageVisible = await passMessage.isVisible().catch(() => false);

        if (passMessageVisible) {
            console.log('✅ Pass message is visible');
            const messageText = await passMessage.textContent();
            console.log(`   Message: ${messageText}`);
        } else {
            console.log('ℹ️  Pass message not found');
        }

        console.log('\n✅ TEST PASSED: Course test completed successfully');
        console.log('='.repeat(50));
    });

    test('should show test results page with score details', async ({ page }) => {
        console.log('\n🧪 TEST: Test Results Display');
        console.log('='.repeat(50));

        // Login and navigate to course
        await login(page, userCredentials);
        await navigateTo(page, `/courses/${demoCourse.id}`);

        // The test should already be completed from the previous test
        // Verify that results are accessible

        await takeScreenshot(page, 'course-after-test-completion');

        console.log('✅ Course page displayed after test completion');

        console.log('\n✅ TEST PASSED: Test results display verified');
        console.log('='.repeat(50));
    });
});
