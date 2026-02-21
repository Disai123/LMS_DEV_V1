@echo off
echo Starting To-Do App...

cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

start "FastAPI Backend" cmd /k "uvicorn main:app --reload"

cd ..\frontend
if not exist node_modules (
    echo Installing Frontend dependencies...
    npm install
)

start "React Frontend" cmd /k "npm run dev"

echo App started! Backend: http://localhost:8000, Frontend: http://localhost:5173
pause
