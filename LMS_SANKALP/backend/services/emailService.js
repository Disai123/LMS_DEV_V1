const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    shouldSendEmail(user, eventType) {
        const prefs = user?.notification_preferences || {
            email_course_updates: true,
            email_certificates: true,
            email_marketing: false
        };

        const courseEvents = ['welcome', 'course_enrolled', 'course_completed', 'test_passed', 'plan_upgraded'];
        const certificateEvents = ['certificate_issued', 'test_passed'];

        if (courseEvents.includes(eventType) && prefs.email_course_updates === false) {
            return false;
        }
        if (certificateEvents.includes(eventType) && prefs.email_certificates === false) {
            return false;
        }
        if (eventType === 'plan_upgraded' && prefs.email_marketing === false) {
            return false;
        }
        return true;
    }

    getBaseTemplate(title, bodyHtml) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>${title}</h1></div>
          <div class="content">${bodyHtml}</div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} GNANAM AI LMS. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>`;
    }

    async sendEventEmail(eventType, user, data = {}) {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                logger.warn(`Email not configured. Skipping ${eventType} email for ${user?.email}`);
                return { success: false, skipped: true };
            }

            if (!this.shouldSendEmail(user, eventType)) {
                return { success: false, skipped: true, reason: 'preferences' };
            }

            const userName = user.name || 'Student';
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            let subject = '';
            let html = '';

            switch (eventType) {
                case 'welcome':
                    subject = 'Welcome to GNANAM AI LMS';
                    html = this.getBaseTemplate('Welcome!', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>Welcome to GNANAM AI LMS. Your account is ready.</p>
                      <div style="text-align:center"><a href="${frontendUrl}/dashboard" class="button">Go to Dashboard</a></div>
                    `);
                    break;
                case 'course_enrolled':
                    subject = `Enrolled in ${data.courseTitle}`;
                    html = this.getBaseTemplate('Course Enrolled', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>You have enrolled in <strong>${data.courseTitle}</strong>.</p>
                      <div style="text-align:center"><a href="${frontendUrl}/courses/${data.courseId}" class="button">Start Learning</a></div>
                    `);
                    break;
                case 'course_completed':
                    subject = `Course Completed: ${data.courseTitle}`;
                    html = this.getBaseTemplate('Course Completed', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>Congratulations! You completed all chapters in <strong>${data.courseTitle}</strong>.</p>
                      <p>Take the final assessment to earn your certificate.</p>
                      <div style="text-align:center"><a href="${frontendUrl}/courses/${data.courseId}" class="button">Take Assessment</a></div>
                    `);
                    break;
                case 'test_passed':
                    subject = `Test Passed: ${data.testTitle || data.courseTitle}`;
                    html = this.getBaseTemplate('Test Passed', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>You passed <strong>${data.testTitle || 'the course assessment'}</strong> with a score of <strong>${data.score}%</strong>.</p>
                      <div style="text-align:center"><a href="${frontendUrl}/certificates" class="button">View Certificate</a></div>
                    `);
                    break;
                case 'certificate_issued':
                    subject = `Certificate Issued: ${data.courseTitle}`;
                    html = this.getBaseTemplate('Certificate Issued', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>Your certificate for <strong>${data.courseTitle}</strong> has been issued.</p>
                      <p>Certificate No: <strong>${data.certificateNumber}</strong></p>
                      <div style="text-align:center">
                        <a href="${frontendUrl}/certificates" class="button">View Certificate</a>
                      </div>
                    `);
                    break;
                case 'plan_upgraded':
                    subject = `Plan Upgraded to ${data.planName}`;
                    html = this.getBaseTemplate('Plan Upgraded', `
                      <p>Hello <strong>${userName}</strong>,</p>
                      <p>Your plan has been upgraded to <strong>${data.planName}</strong>.</p>
                      <div style="text-align:center"><a href="${frontendUrl}/dashboard" class="button">Go to Dashboard</a></div>
                    `);
                    break;
                default:
                    return { success: false, skipped: true, reason: 'unknown_event' };
            }

            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"GNANAM AI LMS" <noreply@gnanamai.com>',
                to: user.email,
                subject,
                html
            });

            logger.info(`${eventType} email sent to ${user.email}`);
            return { success: true };
        } catch (error) {
            logger.error(`Error sending ${eventType} email:`, error);
            return { success: false, error: error.message };
        }
    }

    async sendPasswordResetEmail(email, resetToken, userName) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"GNANAM AI LMS" <noreply@gnanamai.com>',
                to: email,
                subject: 'Password Reset Request - GNANAM AI LMS',
                html: this.getPasswordResetEmailTemplate(userName, resetUrl)
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Password reset email sent to ${email}`);
            return { success: true };
        } catch (error) {
            logger.error('Error sending password reset email:', error);
            throw error;
        }
    }

    async sendPasswordResetConfirmation(email, userName) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"GNANAM AI LMS" <noreply@gnanamai.com>',
                to: email,
                subject: 'Password Successfully Reset - GNANAM AI LMS',
                html: this.getPasswordResetConfirmationTemplate(userName)
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Password reset confirmation email sent to ${email}`);
            return { success: true };
        } catch (error) {
            logger.error('Error sending password reset confirmation email:', error);
            throw error;
        }
    }

    getPasswordResetEmailTemplate(userName, resetUrl) {
        return this.getBaseTemplate('Password Reset Request', `
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your GNANAM AI LMS account.</p>
          <div style="text-align:center"><a href="${resetUrl}" class="button">Reset Password</a></div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
        `);
    }

    getPasswordResetConfirmationTemplate(userName) {
        return this.getBaseTemplate('Password Successfully Reset', `
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your password has been successfully reset for your GNANAM AI LMS account.</p>
          <div style="text-align:center"><a href="${process.env.FRONTEND_URL}/login" class="button">Go to Login</a></div>
        `);
    }
}

module.exports = new EmailService();
