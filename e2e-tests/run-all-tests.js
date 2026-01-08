#!/usr/bin/env node

/**
 * Main Test Runner Script
 * 
 * This script runs all E2E tests in sequence and generates a comprehensive report.
 * Usage: node run-all-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Test configuration
const tests = [
    { name: '01-user-registration', description: 'User Registration' },
    { name: '02-user-login', description: 'User Login' },
    { name: '03-course-enrollment', description: 'Course Enrollment' },
    { name: '04-content-access', description: 'Content Access' },
    { name: '05-test-completion', description: 'Test Completion' },
    { name: '06-certificate-download', description: 'Certificate Download' },
    { name: '07-user-logout', description: 'User Logout' }
];

// Results tracking
const results = {
    passed: [],
    failed: [],
    skipped: [],
    startTime: new Date(),
    endTime: null
};

/**
 * Print header
 */
function printHeader() {
    console.log('\n' + '='.repeat(70));
    console.log(colors.bright + colors.cyan + '  LMS E2E Test Suite - Complete Test Run' + colors.reset);
    console.log('='.repeat(70) + '\n');
    console.log(`${colors.blue}Start Time:${colors.reset} ${results.startTime.toLocaleString()}`);
    console.log(`${colors.blue}Total Tests:${colors.reset} ${tests.length}\n`);
}

/**
 * Print test header
 */
function printTestHeader(index, test) {
    console.log('\n' + '-'.repeat(70));
    console.log(`${colors.bright}Test ${index + 1}/${tests.length}: ${test.description}${colors.reset}`);
    console.log(`${colors.blue}File:${colors.reset} tests/${test.name}.spec.js`);
    console.log('-'.repeat(70) + '\n');
}

/**
 * Run a single test
 */
function runTest(test, index) {
    printTestHeader(index, test);

    try {
        // Run the test using Playwright
        const command = `npx playwright test tests/${test.name}.spec.js --reporter=list`;

        execSync(command, {
            stdio: 'inherit',
            cwd: __dirname
        });

        // Test passed
        results.passed.push(test);
        console.log(`\n${colors.green}✅ PASSED: ${test.description}${colors.reset}`);
        return true;

    } catch (error) {
        // Test failed
        results.failed.push(test);
        console.log(`\n${colors.red}❌ FAILED: ${test.description}${colors.reset}`);
        console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
        return false;
    }
}

/**
 * Print summary
 */
function printSummary() {
    results.endTime = new Date();
    const duration = (results.endTime - results.startTime) / 1000;

    console.log('\n' + '='.repeat(70));
    console.log(colors.bright + colors.cyan + '  Test Run Summary' + colors.reset);
    console.log('='.repeat(70) + '\n');

    console.log(`${colors.blue}End Time:${colors.reset} ${results.endTime.toLocaleString()}`);
    console.log(`${colors.blue}Duration:${colors.reset} ${duration.toFixed(2)} seconds\n`);

    console.log(`${colors.green}✅ Passed:${colors.reset} ${results.passed.length}`);
    results.passed.forEach(test => {
        console.log(`   - ${test.description}`);
    });

    if (results.failed.length > 0) {
        console.log(`\n${colors.red}❌ Failed:${colors.reset} ${results.failed.length}`);
        results.failed.forEach(test => {
            console.log(`   - ${test.description}`);
        });
    }

    if (results.skipped.length > 0) {
        console.log(`\n${colors.yellow}⏭️  Skipped:${colors.reset} ${results.skipped.length}`);
        results.skipped.forEach(test => {
            console.log(`   - ${test.description}`);
        });
    }

    console.log('\n' + '='.repeat(70));

    // Overall result
    if (results.failed.length === 0) {
        console.log(colors.green + colors.bright + '\n🎉 ALL TESTS PASSED! 🎉\n' + colors.reset);
        return 0;
    } else {
        console.log(colors.red + colors.bright + '\n⚠️  SOME TESTS FAILED ⚠️\n' + colors.reset);
        return 1;
    }
}

/**
 * Save results to JSON file
 */
function saveResults() {
    const resultsDir = path.join(__dirname, 'test-results');

    // Ensure results directory exists
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    const resultsFile = path.join(resultsDir, `test-run-${Date.now()}.json`);

    const resultsData = {
        startTime: results.startTime.toISOString(),
        endTime: results.endTime.toISOString(),
        duration: (results.endTime - results.startTime) / 1000,
        total: tests.length,
        passed: results.passed.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        tests: {
            passed: results.passed.map(t => t.description),
            failed: results.failed.map(t => t.description),
            skipped: results.skipped.map(t => t.description)
        }
    };

    fs.writeFileSync(resultsFile, JSON.stringify(resultsData, null, 2));
    console.log(`${colors.blue}Results saved to:${colors.reset} ${resultsFile}\n`);
}

/**
 * Main execution
 */
async function main() {
    printHeader();

    // Run all tests in sequence
    for (let i = 0; i < tests.length; i++) {
        const success = runTest(tests[i], i);

        // Optional: Stop on first failure
        // if (!success) {
        //   console.log(`\n${colors.yellow}Stopping test run due to failure${colors.reset}`);
        //   break;
        // }
    }

    // Print summary
    const exitCode = printSummary();

    // Save results
    saveResults();

    // Generate HTML report
    console.log(`${colors.blue}Generating HTML report...${colors.reset}`);
    try {
        execSync('npx playwright show-report --host 127.0.0.1', {
            stdio: 'inherit',
            cwd: __dirname
        });
    } catch (error) {
        console.log(`${colors.yellow}HTML report generation skipped${colors.reset}`);
    }

    process.exit(exitCode);
}

// Run the tests
main().catch(error => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error);
    process.exit(1);
});
