# Ecommerce Web Application

This folder contains the source code for the full stack Ecommerce Web Application, built with React (Frontend) and FastAPI (Backend).

## Project Structure

*   **/backend**: Python FastAPI application.
*   **/frontend**: React Vite application.

## 1. Backend Setup

### Prerequisites
*   Python 3.10+
*   Pip

### Steps
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    *   **Windows**: `.\venv\Scripts\activate`
    *   **Mac/Linux**: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Seed the Database (Optional but Recommended)**:
    This will create an Admin user (`admin@shop.com` / `admin123`) and some sample products.
    ```bash
    python seed.py
    ```
6.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.
    API Docs (Swagger): `http://localhost:8000/docs`.

## 2. Frontend Setup

### Prerequisites
*   Node.js (v18+)

### Steps
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

## 3. Usage Guide

### Customer Flow
1.  **Register/Login**: Use `user@shop.com` / `user123` (from seed) or register a new account.
2.  **Browse**: View products on the Home page. Filter by category or search.
3.  **Cart**: Add items to cart and proceed to checkout.
4.  **Checkout**: Enter address and "Place Order".
5.  **Profile**: View order history in the Profile page.

### Admin Flow
1.  **Login**: Use `admin@shop.com` / `admin123` (seeded admin).
2.  **Dashboard**: Navigate to `/admin` (link appears in Navbar for admins).
3.  **Products**: Add, Edit, or Delete products.
4.  **Orders**: View all orders and update their status (e.g., to "Shipped").

## 4. Testing

### Backend Tests
To run the backend tests:
1.  Ensure you are in the `backend` folder and venv is active.
2.  Install `pytest` and `httpx` (if not already installed):
    ```bash
    pip install pytest httpx
    ```
3.  Run tests:
    ```bash
    pytest
    ```

## 5. Troubleshooting

*   **CORS Connection Refused**: Ensure the backend server is running on port 8000.
*   **Database Errors**: Delete `sql_app.db` and re-run `python seed.py` to reset the database.
