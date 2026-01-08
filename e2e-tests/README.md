# LMS E2E Test Suite

Automated end-to-end test suite for the LMS (Learning Management System) Demo course flow using Playwright.

## 📋 Overview

This test suite automates the complete user journey through the LMS application, from registration to certificate download. It covers:

1. **User Registration** - Create a new user account
2. **User Login** - Authenticate with credentials
3. **Course Enrollment** - Enroll in the Demo course
4. **Content Access** - Complete all course chapters
5. **Test Completion** - Take and pass the course test
6. **Certificate Download** - View and download completion certificate
7. **User Logout** - Sign out from the application

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- LMS application running on `http://localhost:3000`
- Backend server running and accessible

### Installation

```bash
# Navigate to the e2e-tests directory
cd e2e-tests

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` if needed (default values should work for local development):
   ```env
   BASE_URL=http://localhost:3000
   DEMO_COURSE_ID=7
   ```

## 🧪 Running Tests

### Run All Tests

```bash
# Run all tests in sequence
npm test

# Or use the custom runner
node run-all-tests.js
```

### Run Individual Tests

```bash
# User registration
npm run test:registration

# User login
npm run test:login

# Course enrollment
npm run test:enrollment

# Content access
npm run test:content

# Test completion
npm run test:test-completion

# Certificate download
npm run test:certificate

# User logout
npm run test:logout
```

### Run Tests in Headed Mode (Visible Browser)

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests with UI Mode

```bash
npm run test:ui
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

Reports are generated in:
- **HTML Report**: `test-results/html-report/`
- **JSON Results**: `test-results/test-results.json`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/` (on failure)

## 📁 Project Structure

```
e2e-tests/
├── tests/                          # Test specifications
│   ├── 01-user-registration.spec.js
│   ├── 02-user-login.spec.js
│   ├── 03-course-enrollment.spec.js
│   ├── 04-content-access.spec.js
│   ├── 05-test-completion.spec.js
│   ├── 06-certificate-download.spec.js
│   └── 07-user-logout.spec.js
├── utils/                          # Helper utilities
│   ├── test-data.js               # Test data management
│   ├── selectors.js               # Page selectors
│   └── helpers.js                 # Helper functions
├── test-data/                      # Generated test data
│   └── user-credentials.json      # Saved user credentials
├── test-results/                   # Test execution results
├── playwright.config.js            # Playwright configuration
├── package.json                    # Dependencies and scripts
├── run-all-tests.js               # Main test runner
├── .env.example                    # Environment template
└── README.md                       # This file
```

## 🔧 Configuration

### Playwright Configuration

Edit `playwright.config.js` to customize:

- **Base URL**: Application URL
- **Timeouts**: Test, navigation, and action timeouts
- **Browsers**: Test on different browsers (Chromium, Firefox, WebKit)
- **Screenshots**: Capture settings
- **Videos**: Recording settings
- **Reporters**: Test report formats

### Environment Variables

Available in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3000` | LMS application URL |
| `DEMO_COURSE_ID` | `7` | Demo course ID |
| `DEFAULT_TIMEOUT` | `60000` | Default test timeout (ms) |
| `NAVIGATION_TIMEOUT` | `30000` | Navigation timeout (ms) |
| `ACTION_TIMEOUT` | `15000` | Action timeout (ms) |

## 📝 Test Data Management

The test suite automatically generates unique user credentials for each test run to avoid conflicts:

- **Email**: `testuser{timestamp}{random}@example.com`
- **Password**: `TestPassword123!`
- **Name**: `Test Student {random}`

Credentials are saved in `test-data/user-credentials.json` and reused across tests in the same run.

## 🎯 Test Scenarios

### 1. User Registration
- Navigate to registration page
- Fill registration form
- Submit and verify redirect
- Save credentials for subsequent tests

### 2. User Login
- Navigate to login page
- Enter credentials
- Verify successful login
- Check dashboard access

### 3. Course Enrollment
- Login as test user
- Navigate to courses page
- Find and enroll in Demo course
- Verify enrollment success

### 4. Content Access
- Access Chapter 1: Introduction to Machine Learning
- Wait for video content to load
- Mark chapter as complete
- Access Chapter 2: Advanced ML Concepts
- Complete all chapters
- Verify 100% course completion

### 5. Test Completion
- Verify test is unlocked (after 100% completion)
- Start the test
- Answer questions
- Submit test
- Verify passing score (100%)

### 6. Certificate Download
- Navigate to certificates section
- Find Demo course certificate
- View certificate details
- Download certificate PDF
- Verify certificate information

### 7. User Logout
- Click user menu
- Select logout
- Verify redirect to home page
- Confirm user is logged out

## 🐛 Troubleshooting

### Tests Failing?

1. **Check Application is Running**
   ```bash
   # Verify frontend is accessible
   curl http://localhost:3000
   
   # Verify backend is running
   curl http://localhost:5000/api/health
   ```

2. **Clear Test Data**
   ```bash
   # Remove saved credentials
   rm test-data/user-credentials.json
   ```

3. **Run in Headed Mode**
   ```bash
   npm run test:headed
   ```
   This allows you to see what's happening in the browser.

4. **Check Selectors**
   If the UI has changed, update selectors in `utils/selectors.js`

5. **Increase Timeouts**
   Edit `playwright.config.js` to increase timeout values if tests are timing out.

### Common Issues

**Issue**: Test fails at login
- **Solution**: Ensure registration test ran successfully first

**Issue**: Course not found
- **Solution**: Verify Demo course (ID: 7) exists in the database

**Issue**: Test button not visible
- **Solution**: Ensure course completion is 100% before test unlocks

**Issue**: Certificate not found
- **Solution**: Ensure test was passed successfully

## 📚 Best Practices

1. **Run Tests Sequentially**: Tests depend on each other (registration → login → enrollment, etc.)

2. **Fresh Test Data**: Each test run creates a new user to avoid conflicts

3. **Regular Execution**: Run tests after any UI or functionality changes

4. **Review Reports**: Check HTML reports for detailed test execution logs

5. **Update Selectors**: Keep `utils/selectors.js` updated if UI changes

## 🔄 Continuous Testing

### Manual Execution Schedule

Run tests at regular intervals:

- **After Code Changes**: Before committing changes
- **Daily**: Automated daily test runs
- **Before Deployment**: Full test suite before production deployment
- **After Deployment**: Smoke tests on production

### Integration with CI/CD

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run E2E Tests
  run: |
    cd e2e-tests
    npm install
    npm run install:browsers
    npm test
```

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

## 🤝 Contributing

When adding new tests:

1. Follow the existing naming convention: `##-test-name.spec.js`
2. Add test description and steps in comments
3. Use helper functions from `utils/helpers.js`
4. Update this README with new test scenarios
5. Add test to `run-all-tests.js` if needed

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Testing! 🎉**

For questions or issues, please contact the LMS development team.
