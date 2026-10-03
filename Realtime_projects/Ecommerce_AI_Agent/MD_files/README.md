# Basic E-Commerce Website

This is a full-stack e-commerce application built with React (Frontend) and FastAPI (Backend).

## Project Structure

- `backend/`: FastAPI application with PostgreSQL/SQLAlchemy.
- `frontend/`: React application with Tailwind CSS.

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL Database

## Setup Instructions

### 1. Database Setup
Ensure you have a PostgreSQL database running (e.g., local or Neon).
Create a database named `ecommerce_db` (or whatever you prefer).

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment:
    - Copy `.env.example` to `.env`.
    - Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.
    - Example: `DATABASE_URL=postgresql+asyncpg://user:password@localhost/ecommerce_db`
    - **Add `OPENAI_API_KEY=sk-...` for the AI Agent.**
5.  Run Migrations:
    - Initialize Alembic (if not already done, though config is provided):
      ```bash
      # Generate migration for new tables (including Agent tables):
      alembic revision --autogenerate -m "Add agent tables"
      alembic upgrade head
      ```
6.  Start the Server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will run at `http://localhost:8000`.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # OR
    npm install axios formik yup jwt-decode react-router-dom tailwindcss postcss autoprefixer
    ```
3.  Configure Environment:
    - Copy `.env.example` to `.env`.
    - Ensure `REACT_APP_API_URL=http://localhost:8000`.
4.  Start the Application:
    ```bash
    npm start
    ```
    The app will run at `http://localhost:3000`.

## Features
- **Public:** Browse products, view details, search/filter, add to cart.
- **User:** Register/Login, Checkout (Mock), View Order History.
- **Admin:** Dashboard to manage products and view all orders.

## Notes
- To create an Admin user, you can manually update the `is_admin` flag in the database for a registered user.
- Payments are mocked; entered card details are validated but not processed.
