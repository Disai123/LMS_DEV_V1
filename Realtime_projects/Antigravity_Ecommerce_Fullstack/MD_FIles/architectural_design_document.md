# Architectural Design Document - E-commerce Web Application

## 1. Introduction

### 1.1 Purpose of the System
The purpose of this document is to define the technical architecture for the new E-commerce Web Application. The system aims to provide a robust, scalable, and secure platform for customers to browse and purchase products, while offering administrators comprehensive tools for managing inventory and orders.

### 1.2 High-Level Description
The application will be a modern, decoupled web system comprising a responsive Single Page Application (SPA) frontend and a high-performance RESTful backend API. It is designed to support real-time user interactions, secure payment processing, and efficient data management.

---

## 2. Architecture Overview

### 2.1 System Architecture
The system follows a **Client-Server Architecture** utilizing a tiered approach:
1.  **Presentation Layer (Frontend)**: React.js application handling user interface and experience.
2.  **Application Layer (Backend)**: FastAPI (Python) service handling business logic, API endpoints, and integrations.
3.  **Data Layer**: Relational Database for structured data storage.

### 2.2 Component Diagram Description
*   **Client (Browser)**: Runs the React app. Communicates via HTTPS/JSON.
*   **API Gateway / Reverse Proxy (Optional Nginx)**: Handles incoming requests, SSL termination, and static file serving.
*   **Backend Application Server**: Hosts the FastAPI app. Contains modules for Auth, Products, Orders, and Payments.
*   **Database**: Stores persistent data (Users, Products, Orders).
*   **External Services**: Payment Gateway API (e.g., Stripe) for transaction processing.

---

## 3. Application Architecture

### 3.1 Frontend Design
*   **Framework**: React.js with Vite (for fast build/dev experience).
*   **State Management**: React Context API or Redux Toolkit (for shopping cart and user session).
*   **Routing**: React Router for client-side navigation.
*   **Styling**: Vanilla CSS or Tailwind CSS (per project standards) to ensure responsive design.
*   **API Consumption**: Axios or Fetch API for communicating with the backend.

### 3.2 Backend Design
*   **Framework**: FastAPI (Python). Chosen for high performance (async capabilities) and automatic documentation (Swagger UI).
*   **Authentication**: OAuth2 / JWT (JSON Web Tokens) flow for stateless authentication.
*   **ORM**: SQLAlchemy or Tortoise ORM for database interactions.
*   **Business Logic Modules**:
    *   `auth`: User registration, login, token generation.
    *   `product`: CRUD operations, search filtering logic.
    *   `order`: Order creation, validation, status updates.
    *   `payment`: Integration logic with payment provider.

### 3.3 APIs and Integrations
*   **Internal API**: RESTful endpoints (e.g., `GET /api/products`, `POST /api/orders`).
*   **Payment Integration**: Secure, server-side integration leveraging Payment Intents (avoiding direct handling of sensitive card data on our server).

---

## 4. Data Architecture

### 4.1 Database Design (Schema Description)

**A. Users Table**
*   `id` (PK), `email` (Unique), `password_hash`, `full_name`, `role` (customer/admin), `created_at`

**B. Products Table**
*   `id` (PK), `name`, `description`, `price`, `stock_quantity`, `category`, `image_url`, `created_at`

**C. Orders Table**
*   `id` (PK), `user_id` (FK), `total_amount`, `status` (Processing, Shipped, etc.), `shipping_address`, `created_at`

**D. OrderItems Table** (Many-to-Many resolution)
*   `id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `price_at_purchase`

### 4.2 Data Flow
1.  **User Registration**: Frontend sends JSON -> Backend validates -> Hashed password stored in DB.
2.  **Product Search**: Frontend sends query params -> Backend queries DB with filters -> Returns JSON list.
3.  **Checkout**: Frontend sends Cart + Address -> Backend creates 'Order' record -> Creates 'OrderItems' -> Returns Order ID.

---

## 5. Technology Stack

*   **Frontend**: React.js, Vite, Axios, React Router.
*   **Backend**: Python 3.10+, FastAPI, Uvicorn (ASGI server).
*   **Database**: PostgreSQL (via Neon for managed hosting).
*   **Authentication**: PyJWT, Passlib (for hashing).
*   **Version Control**: Git.

---

## 6. Security Architecture

### 6.1 Authentication & Authorization
*   **JWT Implementation**: Access tokens are short-lived.
*   **Role-Based Access Control (RBAC)**: Checks user `role` before allowing access to Admin routes (e.g., `POST /api/products`).

### 6.2 Data Protection
*   **Encryption**: SSL/TLS (HTTPS) for all data in transit.
*   **Password Storage**: Bcrypt hashing algorithm.
*   **Input Validation**: Pydantic models in FastAPI ensure strict type checking and validation of incoming data to prevent injection attacks.

---

## 7. Deployment Architecture

### 7.1 Hosting Environment
*   **Frontend**: Static hosting (e.g., Vercel, Netlify, or AWS S3 + CloudFront).
*   **Backend**: Containerized (Docker) service hosted on a cloud provider (e.g., Railway, Render, or AWS EC2).
*   **Database**: Managed PostgreSQL Service (Neon, Supabase, or AWS RDS).

### 7.2 Scalability
*   **Horizontal Scaling**: The stateless backend allows spinning up multiple instances behind a load balancer.
*   **Caching**: Redis can be introduced later to cache frequently accessed product data.

### 7.3 CI/CD Pipeline
*   **Source**: GitHub Repository.
*   **Build**: Automated testing (Pytest) on pull requests.
*   **Deploy**: Automated deployment to staging/production upon merge to main branch.

---

## 8. Non-Functional Considerations

*   **Reliability**: Error handling and logging middleware to capture and report server crashes.
*   **Maintainability**: Codebase structured deeply into `routers`, `schemas`, `models`, and `services` to ensure separation of concerns.
*   **Performance**: Async database drivers to handle concurrent requests efficiently. Frontend image optimization (WebP) and lazy loading.
*   **Availability**: Targeting 99.9% uptime by using managed cloud services with automated backups.
