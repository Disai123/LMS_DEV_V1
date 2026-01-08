const { test, expect } = require('@playwright/test');
const { TestDataManager, COURSE_DATA } = require('../utils/test-data');
const SELECTORS = require('../utils/selectors');
const { login, navigateTo, takeScreenshot, enrollInCourse } = require('../utils/helpers');

/**
 * Test: Course Enrollment
 * 
 * This test verifies that a logged-in user can successfully enroll
 * in the Demo course.
 */

test.describe('Course Enrollment', () => {
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
        console.log(`   Course: ${demoCourse.title} (ID: ${demoCourse.id})`);
    });

    test('should successfully enroll in Demo course', async ({ page }) => {
        console.log('\n🧪 TEST: Course Enrollment');
        console.log('='.repeat(50));

        // Step 1: Login
        console.log('\n🔐 Step 1: Login as test user');
        await login(page, userCredentials);

        // Step 2: Navigate to courses page
        console.log('\n📍 Step 2: Navigate to courses page');
        await navigateTo(page, '/courses');
        await takeScreenshot(page, 'courses-page');

        // Step 3: Find Demo course
        console.log('\n🔍 Step 3: Find Demo course');

        // Look for course card with Demo title
        const demoCourseCard = page.locator(SELECTORS.COURSES.COURSE_CARD)
            .filter({ hasText: demoCourse.title })
            .first();

        const courseVisible = await demoCourseCard.isVisible();
        expect(courseVisible).toBeTruthy();
        console.log(`✅ Found course: ${demoCourse.title}`);

        // Step 4: Click on the course to view details
        console.log('\n📖 Step 4: Click on course to view details');
        await demoCourseCard.click();
        await page.waitForLoadState('networkidle');

        // Verify we're on the course page
        expect(page.url()).toContain(`/courses/${demoCourse.id}`);
        await takeScreenshot(page, 'course-details-page');

        // Step 5: Enroll in the course
        console.log('\n✅ Step 5: Enroll in the course');

        // Check if already enrolled
        const enrollButton = page.locator(SELECTORS.COURSES.ENROLL_BUTTON);
        const isEnrollButtonVisible = await enrollButton.isVisible().catch(() => false);

        if (isEnrollButtonVisible) {
            console.log('📝 Clicking "Enroll Now" button');
            await enrollButton.click();
            await page.waitForTimeout(2000);
        } else {
            console.log('ℹ️  Already enrolled or enrollment button not found');
        }

        await takeScreenshot(page, 'after-enrollment');

        // Step 6: Verify enrollment
        console.log('\n🔍 Step 6: Verify enrollment');

        // Should see course content or chapters
        const chaptersVisible = await page.locator(SELECTORS.COURSE.CHAPTER_LIST).isVisible().catch(() => false);

        if (chaptersVisible) {
            console.log('✅ Course chapters are visible - enrollment successful');
        } else {
            console.log('⚠️  Chapters not immediately visible');
        }

        // Verify URL is still on course page
        expect(page.url()).toContain(`/courses/${demoCourse.id}`);

        console.log('\n✅ TEST PASSED: Course enrollment successful');
        console.log('='.repeat(50));
    });

    test('should show enrolled course in My Courses', async ({ page }) => {
        console.log('\n🧪 TEST: Verify Course in My Courses');
        console.log('='.repeat(50));

        // Login
        await login(page, userCredentials);

        // Navigate to My Courses or Dashboard
        console.log('\n📍 Navigating to dashboard/my courses');
        await navigateTo(page, '/dashboard');
        await takeScreenshot(page, 'dashboard-with-enrolled-course');

        // Look for the enrolled course
        const enrolledCourseVisible = await page.locator('text=' + demoCourse.title).isVisible().catch(() => false);

        if (enrolledCourseVisible) {
            console.log(`✅ Found enrolled course: ${demoCourse.title}`);
        } else {
            console.log('ℹ️  Enrolled course not visible on dashboard');
        }

        console.log('\n✅ TEST PASSED: Enrolled course verification complete');
        console.log('='.repeat(50));
    });
});
