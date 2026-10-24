# Testing Guide for Ecommerce Web

This document outlines how to run tests for both the frontend and backend components of the Ecommerce Web application.

## 1. Backend Testing (FastAPI)

The backend uses `pytest` for unit and integration testing.

### Prerequisites
1. Ensure you have activated your Python virtual environment (e.g., `venv\Scripts\activate` on Windows or `source venv/bin/activate` on macOS/Linux).
2. Install the required dependencies: `pip install -r requirements.txt`.
3. Make sure you have a test database configured if your tests interact with the database.

### Running Tests
To execute all backend tests, navigate to the `backend` directory and run:

```bash
cd backend
pytest
```

To run a specific test file or class:
```bash
pytest app/tests/test_filename.py
```

### Manual API Testing (Swagger UI)
Since the backend is built with FastAPI, you can instantly test endpoints manually using the interactive API documentation.
1. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
2. Open your browser and navigate to: [http://localhost:8000/docs](http://localhost:8000/docs)
3. You can use the "Try it out" button on any endpoint to send requests and view responses.

---

## 2. Frontend Testing (React)

The React frontend relies on `react-scripts test` (which uses Jest and React Testing Library) to execute tests.

### Prerequisites
1. Ensure Node.js is installed.
2. Install frontend dependencies before running tests for the first time:
   ```bash
   cd frontend
   npm install
   ```

### Running Tests
To execute the frontend test runner in interactive watch mode, navigate to the `frontend` directory and run:

```bash
cd frontend
npm test
```

This will run all test files ending with `.test.js` or `.spec.js`. Press `a` in the terminal to run all tests or `q` to quit the test watcher.

### Manual UI Testing
To manually test the UI components and flows:
1. Start the React development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
3. Navigate through the site to verify layout, responsiveness, and state changes (e.g., adding to cart, logging in).
