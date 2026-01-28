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

    async sendPasswordResetEmail(email, resetToken, userName) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"GNANAM AI LMS" <noreply@gnanamai.com>',
                to: email,
                subject: '🔐 Password Reset Request - GNANAM AI LMS',
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
                subject: '✅ Password Successfully Reset - GNANAM AI LMS',
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
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>We received a request to reset your password for your GNANAM AI LMS account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0;">
                <li>This link will expire in <strong>1 hour</strong></li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br><strong>GNANAM AI LMS Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} GNANAM AI LMS. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    getPasswordResetConfirmationTemplate(userName) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .success-icon {
            text-align: center;
            font-size: 60px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .info {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Password Successfully Reset</h1>
          </div>
          <div class="content">
            <div class="success-icon">✓</div>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Your password has been successfully reset for your GNANAM AI LMS account.</p>
            <p>You can now log in with your new password.</p>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Go to Login</a>
            </div>
            <div class="info">
              <strong>🔒 Security Tip:</strong>
              <ul style="margin: 10px 0;">
                <li>Keep your password secure and don't share it with anyone</li>
                <li>Use a strong, unique password</li>
                <li>If you didn't make this change, contact support immediately</li>
              </ul>
            </div>
            <p>If you have any questions or concerns, please contact our support team.</p>
            <p>Best regards,<br><strong>GNANAM AI LMS Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} GNANAM AI LMS. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
}

module.exports = new EmailService();
