# Password Reset Setup Guide

## 🚀 Quick Start

Follow these steps to enable password reset functionality in your LMS:

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install `nodemailer` (already added to package.json).

### 2. Configure Email Service

Update your `backend/.env` file with your email credentials:

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env**:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=GNANAM AI LMS <noreply@gnanamai.com>
```

#### Option B: SendGrid (Recommended for Production)

```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=GNANAM AI LMS <noreply@gnanamai.com>
```

#### Option C: Custom SMTP

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=GNANAM AI LMS <noreply@gnanamai.com>
```

### 3. Run Database Migration

```bash
cd backend
npm run db:migrate
```

This will add `reset_password_token` and `reset_password_expires` columns to the `users` table.

### 4. Start the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## ✅ Testing the Feature

### Test Flow 1: Successful Password Reset

1. **Navigate to Login Page**: http://localhost:3000/login
2. **Click "Forgot password?"** link (only visible for students)
3. **Enter your email** and click "Send Reset Link"
4. **Check your email** for the reset link
5. **Click the reset link** in the email
6. **Enter new password** and confirm
7. **Submit** and verify redirect to login
8. **Login with new password**

### Test Flow 2: Invalid/Expired Token

1. Wait 1 hour after requesting reset (or manually expire token in database)
2. Try to use the reset link
3. Verify error message: "Invalid or Expired Link"
4. Click "Request New Reset Link"

### Test Flow 3: Edge Cases

- **Non-existent email**: Should show success message (security)
- **Google OAuth account**: Should show success but not send email
- **Admin account**: Should show success but not send email
- **Password mismatch**: Should show validation error
- **Weak password**: Should show strength indicator

## 🔍 Verification Checklist

- [ ] Email service configured correctly
- [ ] Migration ran successfully
- [ ] Can request password reset
- [ ] Reset email is received
- [ ] Email contains clickable link
- [ ] Reset link redirects to reset page
- [ ] Can set new password
- [ ] Confirmation email is received
- [ ] Can login with new password
- [ ] Old password no longer works
- [ ] Token expires after 1 hour
- [ ] Token is one-time use only

## 🐛 Troubleshooting

### Email Not Sending

**Problem**: Reset email not received

**Solutions**:
1. Check spam/junk folder
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. For Gmail: Ensure app password is correct (not regular password)
4. Check backend logs for email errors
5. Test email service:
   ```bash
   # In backend directory
   node -e "require('./services/emailService').sendPasswordResetEmail('test@example.com', 'test-token', 'Test User')"
   ```

### Migration Errors

**Problem**: Migration fails to run

**Solutions**:
1. Check database connection
2. Ensure you're in the backend directory
3. Run: `npm run db:migrate:status` to check migration status
4. If needed, manually run migration:
   ```bash
   npx sequelize-cli db:migrate --name 046-add-password-reset-fields.js
   ```

### Token Validation Fails

**Problem**: "Invalid or expired reset token" error

**Solutions**:
1. Check if token has expired (1 hour limit)
2. Verify token hasn't been used already
3. Check database: `SELECT reset_password_token, reset_password_expires FROM users WHERE email = 'user@example.com';`

## 📧 Email Templates

The system sends two types of emails:

### 1. Password Reset Email
- **Subject**: 🔐 Password Reset Request - GNANAM AI LMS
- **Contains**: Reset link (valid for 1 hour)
- **Design**: Professional HTML with Disney-themed colors

### 2. Password Reset Confirmation
- **Subject**: ✅ Password Successfully Reset - GNANAM AI LMS
- **Contains**: Confirmation message and login link
- **Design**: Professional HTML with success styling

## 🔒 Security Features

1. **Token Hashing**: Reset tokens are hashed before storage
2. **Time Expiration**: Tokens expire after 1 hour
3. **One-Time Use**: Tokens are cleared after successful reset
4. **Email Enumeration Protection**: Always returns success message
5. **Rate Limiting**: Max 3 reset requests per 15 minutes per IP
6. **Student-Only**: Only works for student accounts with passwords
7. **Password Validation**: Minimum 6 characters, must differ from old password

## 📝 Database Schema Changes

```sql
-- Added columns to users table
ALTER TABLE users 
  ADD COLUMN reset_password_token VARCHAR(255) NULL,
  ADD COLUMN reset_password_expires TIMESTAMP NULL;

-- Added index for performance
CREATE INDEX idx_users_reset_password_token 
  ON users(reset_password_token);
```

## 🎨 UI Features

- **Disney-themed styling** consistent with LMS design
- **Password strength indicator** (Weak/Fair/Good/Strong)
- **Show/hide password toggle**
- **Responsive design** for mobile devices
- **Loading states** and animations
- **User-friendly error messages**

## 🔄 Rollback (If Needed)

If you need to rollback the changes:

```bash
cd backend
npx sequelize-cli db:migrate:undo
```

This will remove the password reset columns from the users table.

## 📞 Support

If you encounter any issues:
1. Check backend logs: `backend/logs/app.log`
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure both backend and frontend are running
