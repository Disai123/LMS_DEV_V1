# Minimalist To-Do App

A visually stunning, minimalist To-Do application built with React, Vite, and FastAPI.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+**

## Setup Instructions

### 1. Backend Setup (FastAPI)

Open a terminal in the `todo_app` directory:

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The backend API will start at `http://localhost:8000`.

### 2. Frontend Setup (React)

Open a **new** terminal in the `todo_app` directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

## Features
- **Premium Dark Mode**: Deep space black background with glassmorphism effects.
- **Smooth Interactions**: Hover effects, improved focus states, and transitions.
- **Full persistence**: Tasks are saved to a local SQLite database.

## Architecture
- **Frontend**: React (Vite) + Vanilla CSS (Glassmorphism) + Axios
- **Backend**: FastAPI + SQLite + SQLAlchemy
