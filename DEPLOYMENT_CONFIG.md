# Deployment Configuration Guide

This guide explains how to configure environment variables for both local development and production deployment of the LMS Project.

## Table of Contents

- [Overview](#overview)
- [Local Development Setup](#local-development-setup)
- [Production Deployment Setup](#production-deployment-setup)
- [Platform-Specific Guides](#platform-specific-guides)
- [Troubleshooting](#troubleshooting)

## Overview

The LMS Project consists of two main components:
- **Backend**: Node.js/Express API server
- **Frontend**: React/Vite application

For production deployment, you need to configure environment variables so the frontend knows where to find the backend API.

### Key Changes from Development to Production

| Aspect | Local Development | Production |
|--------|------------------|------------|
| Frontend URL | `http://localhost:3000` | Your deployed frontend URL |
| Backend URL | `http://localhost:5000` | Your deployed backend URL |
| Database | SQLite (file-based) | PostgreSQL (recommended) |
| Proxy | Vite dev proxy | Direct API calls via env var |

## Local Development Setup

### Backend Configuration

1. **Copy the example environment file:**
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **The default `.env` should work for local development:**
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   
   # Database (SQLite for local dev)
   DB_DIALECT=sqlite
   DB_STORAGE=./database.sqlite
   
   # JWT Secrets (use defaults for local dev)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
   
   # Google OAuth (use your own credentials)
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

3. **Start the backend:**
   ```bash
   npm start
   ```

### Frontend Configuration

1. **Copy the example environment file:**
   ```bash
   cd frontend
   copy env.example .env
   ```

2. **The default `.env` should work for local development:**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_POSTHOG_ENABLED=false
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Production Deployment Setup

### Step 1: Deploy the Backend

Choose your backend hosting platform and deploy the backend first. Common options:

- **Render** (Recommended for beginners)
- **Heroku**
- **AWS Elastic Beanstalk**
- **Railway**
- **Fly.io**

### Step 2: Configure Backend Environment Variables

In your backend hosting platform, set these environment variables:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com

# Database (PostgreSQL for production)
DB_DIALECT=postgres
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=true

# JWT Secrets (GENERATE NEW ONES!)
JWT_SECRET=<generate-a-strong-random-secret>
JWT_REFRESH_SECRET=<generate-a-different-strong-random-secret>

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
```

**Important:** Generate strong random secrets for production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Configure Frontend Environment Variables

1. **Create `.env.production` file in the frontend directory:**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_POSTHOG_ENABLED=true
   VITE_POSTHOG_KEY=your-posthog-key
   VITE_POSTHOG_HOST=https://app.posthog.com
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder** to your frontend hosting platform (Vercel, Netlify, S3, etc.)

## Platform-Specific Guides

### Render

#### Backend Deployment on Render

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Add environment variables from the [Backend Environment Variables](#step-2-configure-backend-environment-variables) section
5. Deploy!

Your backend URL will be: `https://your-app-name.onrender.com`

#### Frontend Deployment on Render

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-app-name.onrender.com
   ```
5. Deploy!

### Vercel (Frontend Only)

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = your backend URL
   - `VITE_GOOGLE_CLIENT_ID` = your Google client ID
5. Redeploy: `vercel --prod`

### Netlify (Frontend Only)

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Navigate to frontend directory: `cd frontend`
3. Build: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`
5. Set environment variables in Netlify dashboard:
   - `VITE_API_URL` = your backend URL
   - `VITE_GOOGLE_CLIENT_ID` = your Google client ID

### AWS Elastic Beanstalk (Backend)

1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init`
3. Create environment: `eb create production`
4. Set environment variables:
   ```bash
   eb setenv NODE_ENV=production FRONTEND_URL=https://your-frontend-domain.com DB_DIALECT=postgres ...
   ```
5. Deploy: `eb deploy`

Your backend URL will be: `https://your-app.region.elasticbeanstalk.com`

### Heroku

#### Backend Deployment

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   heroku config:set JWT_SECRET=your-secret
   ```
6. Deploy: `git push heroku main`

Your backend URL will be: `https://your-app-name.herokuapp.com`

## Troubleshooting

### Issue: "Network Error" or "Cannot connect to backend"

**Possible causes:**
1. `VITE_API_URL` is not set correctly
2. Backend server is not running
3. CORS is not configured properly
4. Mixed content (HTTP frontend trying to access HTTPS backend, or vice versa)

**Solutions:**
1. Verify `VITE_API_URL` in your frontend `.env` file
2. Check backend logs to ensure it's running
3. Verify `FRONTEND_URL` in backend `.env` matches your frontend domain
4. Ensure both frontend and backend use HTTPS in production

### Issue: "CORS Error"

**Solution:**
Make sure the `FRONTEND_URL` environment variable in your backend matches your frontend domain exactly:
```env
# Backend .env
FRONTEND_URL=https://your-frontend-domain.com
```

### Issue: Google OAuth not working in production

**Solutions:**
1. Update authorized JavaScript origins in Google Cloud Console:
   - Add your frontend URL: `https://your-frontend-domain.com`
2. Update authorized redirect URIs:
   - Add: `https://your-backend-domain.com/api/auth/google/callback`
3. Make sure `GOOGLE_CALLBACK_URL` in backend `.env` matches the redirect URI

### Issue: Database connection fails in production

**Solutions:**
1. Verify all database environment variables are set correctly
2. Ensure `DB_SSL=true` for production PostgreSQL databases
3. Check database firewall rules allow connections from your backend server
4. Verify database credentials are correct

### Issue: Environment variables not updating

**Solutions:**
1. **Frontend:** Rebuild the application after changing environment variables:
   ```bash
   npm run build
   ```
   Environment variables are embedded at build time in Vite!

2. **Backend:** Restart the server after changing environment variables

### Issue: API calls returning 404

**Possible causes:**
1. Incorrect API URL
2. Missing `/api` prefix in backend routes

**Solutions:**
1. Check that `VITE_API_URL` does NOT end with `/api` (it's added automatically)
2. Verify backend routes are prefixed with `/api`
3. Check browser network tab to see the actual URL being called

## Environment Variable Checklist

Before deploying to production, verify:

### Backend
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` set to actual frontend domain
- [ ] Database credentials configured (PostgreSQL recommended)
- [ ] Strong random `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] `GOOGLE_CALLBACK_URL` set to backend domain
- [ ] All sensitive data (passwords, secrets) are secure

### Frontend
- [ ] `VITE_API_URL` set to actual backend domain
- [ ] `VITE_GOOGLE_CLIENT_ID` matches backend configuration
- [ ] Application rebuilt after setting environment variables
- [ ] `dist` folder deployed to hosting platform

### Google OAuth
- [ ] Authorized JavaScript origins include frontend domain
- [ ] Authorized redirect URIs include backend callback URL
- [ ] Same client ID used in both frontend and backend

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Check backend server logs
3. Verify all environment variables are set correctly
4. Ensure both frontend and backend are using the same protocol (HTTP or HTTPS)
