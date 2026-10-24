# Deployment Guide for Render.com

This guide explains how to deploy the **Ecommerce Web** application (FastAPI Backend + React Frontend) to [Render](https://render.com).

## Prerequisites
1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Create a [Render account](https://dashboard.render.com/register).
3.  Have your **Neon PostgreSQL** connection string ready (starts with `postgresql+asyncpg://...`).

---

## Part 1: Backend Deployment

1.  **Create a New Web Service**:
    - Go to the Render Dashboard.
    - Click **New +** -> **Web Service**.
    - Connect your Git repository.

2.  **Configure the Service**:
    - **Name**: `ecommerce-backend` (or similar).
    - **Root Directory**: `backend` (Important: This tells Render where your python app is).
    - **Runtime**: **Python 3**.
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3.  **Environment Variables**:
    - Scroll down to the **Environment Variables** section and add:
        - `DATABASE_URL`: Your Neon DB connection string (ensure it uses `postgresql+asyncpg://`).
        - `SECRET_KEY`: A strong random string for security.
        - `PYTHON_VERSION`: `3.10.0` (Optional, to ensure compatibility).

4.  **Deploy**:
    - Click **Create Web Service**.
    - Wait for the build to finish. Once valid, copy the **Service URL** (e.g., `https://ecommerce-backend.onrender.com`). You will need this for the frontend.

---

## Part 2: Frontend Deployment

1.  **Create a New Static Site**:
    - Go to the Render Dashboard.
    - Click **New +** -> **Static Site**.
    - Connect the same Git repository.

2.  **Configure the Site**:
    - **Name**: `ecommerce-frontend`.
    - **Root Directory**: `frontend`.
    - **Build Command**: `npm install && npm run build`
    - **Publish Directory**: `build`

3.  **Environment Variables**:
    - Add the following variable:
        - `REACT_APP_API_URL`: The Backend Service URL you copied in Part 1 (e.g., `https://ecommerce-backend.onrender.com`).
    *Note: Render Static Sites define env vars at build time.*

4.  **Rewrite Rules (Critical for React Router)**:
    - Go to the **Redirects/Rewrites** tab for your new Static Site service.
    - Add a new rule:
        - **Source**: `/*`
        - **Destination**: `/index.html`
        - **Action**: `Rewrite`
    - Save the rule. This ensures that when you refresh a page like `/login`, the server serves the React app instead of a 404.

5.  **Deploy**:
    - Click **Create Static Site** (or trigger a manual deploy if initially created).
    - Once finished, visit your Frontend URL.

---

## Part 3: Database Migration (First Run)

Since Render manages the deployment, you need to ensure tables are created.
1.  **Option A: Auto-create on start** (Already included in code logic):
    - The current `app/seed_data.py` logic can create tables, but usually migrations are better.
    - You can add a pre-deploy or start command wrapper to run migrations, or simply run the seed script locally pointing to the production DB *once*.

2.  **Option B: Connect Remotely**:
    - Locally, update your `.env` to point to the **Production Database URL**.
    - Run `alembic upgrade head` from your local terminal.
    - Run `python seed_data.py` to populate initial data.

---

## Troubleshooting

-   **CORS Errors**: If the frontend cannot talk to the backend, check `backend/app/main.py`. ensure the `origins` list includes your new Render Frontend URL (e.g., `https://ecommerce-frontend.onrender.com`). You may need to commit and push this change update.
