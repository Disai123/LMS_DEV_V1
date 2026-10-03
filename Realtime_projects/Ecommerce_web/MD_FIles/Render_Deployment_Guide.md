# Render + Neon Deployment Guide

This guide outlines how to deploy your E-commerce Web Application using **Neon** (PostgreSQL Database) and **Render** (Application Hosting).

## Prerequisites
*   A **GitHub** account (push your code there first).
*   A **Neon** account (neon.tech).
*   A **Render** account (render.com).

---

## Part 0: Local Development Setup

Before deploying, ensure your local environment is configured:

1.  Create a `.env` file in the `backend` directory (if not already present).
2.  Add the following environment variables:
    ```
    SECRET_KEY=your-secret-key-here
    DATABASE_URL=postgresql://neondb_owner:npg_1vCaQbPAeR9w@ep-weathered-smoke-a4j9f83e-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
    ```
3.  **Note**: The application now requires PostgreSQL for both local and production environments. SQLite is no longer supported.

---

## Part 1: Database Setup (Neon)

1.  Log in to **Neon Console**.
2.  Create a **New Project**.
3.  Once created, copy the **Connection String** from the Dashboard.
    *   It looks like: `postgres://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`
    *   **Keep this safe!** You will need it in Part 2.

---

## Part 2: Backend Deployment (Render)

1.  Log in to **Render Dashboard**.
2.  Click **New +** -> **Web Service**.
3.  Connect your **GitHub Repository**.
4.  Configure the service:
    *   **Name**: `ecommerce-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Environment**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  **Environment Variables** (Advanced / Environment tabs):
    *   Add `DATABASE_URL`: Paste your **Neon Connection String**.
    *   Add `SECRET_KEY`: (Any random long string).
    *   Add `ALLOWED_ORIGINS`: (Leave blank for now, will update in Part 4).
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. **Copy the Service URL** (e.g., `https://ecommerce-backend.onrender.com`).

### Seeding the Database (One-time)
Since Render doesn't have a direct shell for running scripts easily during build:
*   You can add a "Pre-Deploy Command" in settings (if on paid plan) OR:
*   Temporarily change the **Start Command** to: `python seed.py && uvicorn main:app --host 0.0.0.0 --port 10000`
*   Let it deploy once, then change the Start Command back to just `uvicorn...`.

---

## Part 3: Frontend Deployment (Render)

1.  In Render Dashboard, click **New +** -> **Static Site**.
2.  Connect the same **GitHub Repository**.
3.  Configure the site:
    *   **Name**: `ecommerce-frontend`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   Add `VITE_API_URL`: Paste your **Backend Service URL** from Part 2.
5.  Click **Create Static Site**.
6.  Wait for deployment. **Copy the Site URL** (e.g., `https://ecommerce-frontend.onrender.com`).

---

## Part 4: Final Connection

1.  Go back to your **Backend Web Service** in Render.
2.  Go to **Environment**.
3.  Add/Update `ALLOWED_ORIGINS` with your **Frontend Site URL**.
4.  **Save Changes** (this will trigger a re-deploy).

---

## Verification
1.  Open your **Frontend URL**.
2.  Log in with `admin@shop.com` / `admin123`.
3.  Verify that data loads correctly from your Neon database!
