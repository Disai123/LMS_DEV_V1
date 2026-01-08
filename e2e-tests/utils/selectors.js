/**
 * Centralized Selector Definitions
 * All page selectors organized by page/component
 */

const SELECTORS = {
    // Registration Page
    REGISTRATION: {
        NAME_INPUT: 'input[name="name"], input[placeholder*="Name" i]',
        EMAIL_INPUT: 'input[name="email"], input[type="email"]',
        PASSWORD_INPUT: 'input[name="password"], input[type="password"]',
        SUBMIT_BUTTON: 'button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")',
        SUCCESS_MESSAGE: '.success, .alert-success, [role="alert"]:has-text("success")',
        ERROR_MESSAGE: '.error, .alert-error, .alert-danger, [role="alert"]:has-text("error")',
    },

    // Login Page
    LOGIN: {
        EMAIL_INPUT: 'input[name="email"], input[type="email"]',
        PASSWORD_INPUT: 'input[name="password"], input[type="password"]',
        SUBMIT_BUTTON: 'button[type="submit"], button:has-text("Login"), button:has-text("Sign In")',
        SUCCESS_MESSAGE: '.success, .alert-success',
        ERROR_MESSAGE: '.error, .alert-error, .alert-danger',
    },

    // Navigation
    NAV: {
        DASHBOARD_LINK: 'a[href="/dashboard"], a:has-text("Dashboard")',
        COURSES_LINK: 'a[href="/courses"], a:has-text("Courses")',
        MY_COURSES_LINK: 'a[href="/my-courses"], a:has-text("My Courses")',
        CERTIFICATES_LINK: 'a[href*="certificate"], a:has-text("Certificates")',
        USER_MENU: '.user-menu, [data-testid="user-menu"], button:has-text("Test Student")',
        LOGOUT_BUTTON: 'button:has-text("Logout"), a:has-text("Logout"), [role="menuitem"]:has-text("Logout")',
        LOGIN_BUTTON: 'a[href="/login"], button:has-text("Login")',
    },

    // Dashboard
    DASHBOARD: {
        WELCOME_MESSAGE: 'h1, h2, .welcome',
        ENROLLED_COURSES: '.enrolled-courses, [data-testid="enrolled-courses"]',
        CERTIFICATES_SECTION: '.certificates, [data-testid="certificates"]',
    },

    // Courses Page
    COURSES: {
        COURSE_CARD: '.course-card, [data-testid="course-card"]',
        COURSE_TITLE: '.course-title, h3, h2',
        ENROLL_BUTTON: 'button:has-text("Enroll"), button:has-text("Enroll Now")',
        ENROLLED_BADGE: '.enrolled, .badge:has-text("Enrolled")',
    },

    // Course Page
    COURSE: {
        COURSE_TITLE: 'h1, .course-title',
        PROGRESS_BAR: '.progress, [role="progressbar"]',
        PROGRESS_TEXT: '.progress-text, .completion-text',
        CHAPTER_LIST: '.chapters, .chapter-list, [data-testid="chapters"]',
        CHAPTER_ITEM: '.chapter, .chapter-item, [data-testid="chapter"]',
        CHAPTER_TITLE: '.chapter-title, h3, h4',
        CHAPTER_LOCKED: '.locked, [data-locked="true"]',
        VIDEO_PLAYER: 'video, iframe[src*="youtube"], iframe[src*="vimeo"], .video-player',
        MARK_COMPLETE_BUTTON: 'button:has-text("Mark as Complete"), button:has-text("Complete")',
        NEXT_CHAPTER_BUTTON: 'button:has-text("Next"), button:has-text("Next Chapter")',
        BACK_TO_COURSE_BUTTON: 'button:has-text("Back to Course"), a:has-text("Back to Course")',
    },

    // Test/Quiz Page
    TEST: {
        TAKE_TEST_BUTTON: 'button:has-text("Take Test"), a:has-text("Take Test")',
        START_TEST_BUTTON: 'button:has-text("Start Test"), button:has-text("Begin Test")',
        QUESTION_CONTAINER: '.question, [data-testid="question"]',
        QUESTION_TEXT: '.question-text, h3, h4',
        ANSWER_OPTION: 'input[type="radio"], .answer-option, [data-testid="answer"]',
        SUBMIT_TEST_BUTTON: 'button:has-text("Submit Test"), button[type="submit"]',
        TEST_RESULTS: '.test-results, .results, [data-testid="results"]',
        SCORE_DISPLAY: '.score, .test-score, [data-testid="score"]',
        PASS_MESSAGE: '.pass, .success, :has-text("Congratulations")',
        FAIL_MESSAGE: '.fail, .error, :has-text("Unfortunately")',
    },

    // Certificate Page
    CERTIFICATE: {
        CERTIFICATES_LIST: '.certificates-list, [data-testid="certificates"]',
        CERTIFICATE_CARD: '.certificate-card, [data-testid="certificate"]',
        VIEW_CERTIFICATE_BUTTON: 'button:has-text("View Certificate"), a:has-text("View Certificate")',
        DOWNLOAD_BUTTON: 'button:has-text("Download"), button:has-text("Download PDF")',
        CERTIFICATE_MODAL: '.modal, [role="dialog"], .certificate-modal',
        CERTIFICATE_PREVIEW: '.certificate-preview, canvas, img[alt*="certificate" i]',
        CLOSE_MODAL_BUTTON: 'button:has-text("Close"), [aria-label="Close"]',
        STUDENT_NAME: '.student-name, [data-testid="student-name"]',
        COURSE_NAME: '.course-name, [data-testid="course-name"]',
        CERTIFICATE_DATE: '.date, [data-testid="date"]',
        CERTIFICATE_ID: '.certificate-id, [data-testid="certificate-id"]',
    },

    // Common Elements
    COMMON: {
        LOADING_SPINNER: '.loading, .spinner, [role="status"]',
        SUCCESS_TOAST: '.toast-success, .notification-success',
        ERROR_TOAST: '.toast-error, .notification-error',
        MODAL: '.modal, [role="dialog"]',
        MODAL_CLOSE: 'button[aria-label="Close"], .modal-close',
    }
};

module.exports = SELECTORS;
