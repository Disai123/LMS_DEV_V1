# Deployment Guide: Render.com
## Project: Minimalist To-Do Application

### 1. Prerequisites
- A **GitHub Account**.
- A **Render.com Account**.
- The project code pushed to a GitHub repository.

---

### 2. Backend Deployment (FastAPI)
1.  **Log in to Render Dashboard** and click **"New +"**.
2.  Select **"Web Service"**.
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Name**: `todo-backend` (or similar)
    -   **Region**: Choose closest to you (e.g., Singapore, Oregon)
    -   **Branch**: `main`
    -   **Root Directory**: `todo_app/backend` (Important!)
    -   **Runtime**: **Python 3**
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  Click **"Create Web Service"**.
6.  **Wait for deployment**. Once live, copy the **Service URL** (e.g., `https://todo-backend.onrender.com`).

---

### 3. Frontend Deployment (React)
1.  Go back to **Dashboard** and click **"New +"**.
2.  Select **"Static Site"**.
3.  Connect the **same** GitHub repository.
4.  Configure the site:
    -   **Name**: `todo-frontend`
    -   **Branch**: `main`
    -   **Root Directory**: `todo_app/frontend` (Important!)
    -   **Build Command**: `npm install && npm run build`
    -   **Publish Directory**: `dist`
5.  **Environment Variables**:
    -   Click "Advanced" or "Environment".
    -   Add Key: `VITE_API_URL`
    -   Add Value: Partial URL from Backend step (e.g., `https://todo-backend.onrender.com`) **WITHOUT trailing slash**.
6.  Click **"Create Static Site"**.

---

### 4. Final Configuration (CORS)
1.  Go back to your **Backend Service** on Render.
2.  Go to **Environment** (or code change required).
    *   *Note: The current code allows all origins (`allow_origins=["*"]`), so it should work out of the box.*
    *   *Security Best Practice*: Update `main.py` locally to restrict origins to your new frontend URL, push changes, and Render will auto-deploy.

### 5. Verification
1.  Open your **Frontend URL** (e.g., `https://todo-frontend.onrender.com`).
2.  Try creating a task.
3.  If it persists on refresh, your deployment is successful!
