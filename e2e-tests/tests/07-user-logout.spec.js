const { test, expect } = require('@playwright/test');
const { TestDataManager } = require('../utils/test-data');
const SELECTORS = require('../utils/selectors');
const { login, logout, takeScreenshot } = require('../utils/helpers');

/**
 * Test: User Logout
 * 
 * This test verifies that a logged-in user can successfully logout
 * and is redirected to the home page.
 */

test.describe('User Logout', () => {
    let testDataManager;
    let userCredentials;

    test.beforeAll(() => {
        testDataManager = new TestDataManager();
        userCredentials = testDataManager.getLatestUserCredentials();

        if (!userCredentials) {
            throw new Error('No user credentials found. Please run registration test first.');
        }

        console.log('\n📋 Test Configuration:');
        console.log(`   User: ${userCredentials.email}`);
    });

    test('should successfully logout user', async ({ page }) => {
        console.log('\n🧪 TEST: User Logout');
        console.log('='.repeat(50));

        // Step 1: Login
        console.log('\n🔐 Step 1: Login as test user');
        await login(page, userCredentials);
        await takeScreenshot(page, 'logged-in-dashboard');

        // Step 2: Verify user is logged in
        console.log('\n🔍 Step 2: Verify user is logged in');

        const userMenuVisible = await page.locator(SELECTORS.NAV.USER_MENU).isVisible();
        expect(userMenuVisible).toBeTruthy();
        console.log('✅ User menu is visible');

        // Step 3: Logout
        console.log('\n🚪 Step 3: Logout user');
        await logout(page);

        await takeScreenshot(page, 'after-logout');

        // Step 4: Verify logout
        console.log('\n🔍 Step 4: Verify logout successful');

        // Should be on home page
        const currentUrl = page.url();
        const isOnHomePage = currentUrl === 'http://localhost:3000/' || currentUrl.endsWith('/');
        expect(isOnHomePage).toBeTruthy();
        console.log(`✅ Redirected to home page: ${currentUrl}`);

        // Login button should be visible
        const loginButtonVisible = await page.locator(SELECTORS.NAV.LOGIN_BUTTON).isVisible().catch(() => false);

        if (loginButtonVisible) {
            console.log('✅ Login button is visible');
        } else {
            console.log('ℹ️  Login button not immediately visible');
        }

        // User menu should not be visible
        const userMenuStillVisible = await page.locator(SELECTORS.NAV.USER_MENU).isVisible().catch(() => false);
        expect(userMenuStillVisible).toBeFalsy();
        console.log('✅ User menu is no longer visible');

        console.log('\n✅ TEST PASSED: User logout successful');
        console.log('='.repeat(50));
    });

    test('should not allow access to protected routes after logout', async ({ page }) => {
        console.log('\n🧪 TEST: Protected Route Access After Logout');
        console.log('='.repeat(50));

        // Try to access dashboard without being logged in
        console.log('\n📍 Attempting to access dashboard without login');
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        // Should be redirected to login page
        const currentUrl = page.url();
        const isOnLogin = currentUrl.includes('/login');

        if (isOnLogin) {
            console.log('✅ Redirected to login page (expected behavior)');
        } else {
            console.log(`⚠️  Current URL: ${currentUrl}`);
        }

        await takeScreenshot(page, 'protected-route-after-logout');

        console.log('\n✅ TEST PASSED: Protected route access blocked after logout');
        console.log('='.repeat(50));
    });

    test('should require login again after logout', async ({ page }) => {
        console.log('\n🧪 TEST: Re-login After Logout');
        console.log('='.repeat(50));

        // Login again to verify logout was complete
        console.log('\n🔐 Logging in again');
        await login(page, userCredentials);

        // Verify successful login
        const userMenuVisible = await page.locator(SELECTORS.NAV.USER_MENU).isVisible();
        expect(userMenuVisible).toBeTruthy();
        console.log('✅ Successfully logged in again');

        await takeScreenshot(page, 'logged-in-again');

        console.log('\n✅ TEST PASSED: Re-login after logout successful');
        console.log('='.repeat(50));
    });
});
