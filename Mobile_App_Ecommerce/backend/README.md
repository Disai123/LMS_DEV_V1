# E-Commerce Backend API

Node.js + Express + Sequelize + PostgreSQL backend API for the Mobile App E-Commerce project.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Update the following in `.env`:
- Database connection details
- JWT secrets
- Server port
- CORS origins

### 3. Create Database

```sql
CREATE DATABASE ecommerce_db;
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

### 6. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:5001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (Protected)

### Products
- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:productId` - Update cart item (Protected)
- `DELETE /api/cart/:productId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order (Protected)
- `PUT /api/orders/:id` - Update order status (Admin only)

### Categories
- `GET /api/categories` - Get all categories (Public)

### Health Check
- `GET /api/health` - Health check endpoint

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

## 📝 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

## 🗄️ Database Migrations

**Run migrations:**
```bash
npm run db:migrate
```

**Rollback last migration:**
```bash
npm run db:migrate:undo
```

**Rollback all migrations:**
```bash
npm run db:migrate:undo:all
```

## 🌱 Database Seeders

**Run all seeders:**
```bash
npm run db:seed
```

**Rollback all seeders:**
```bash
npm run db:seed:undo
```

## 📦 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Run database seeders
- `npm run db:reset` - Reset database (drop, migrate, seed)

## 🏗️ Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── migrations/      # Database migrations
├── models/          # Sequelize models
├── routes/          # API routes
├── seeders/         # Database seeders
├── services/        # Business logic services
├── utils/           # Utility functions
├── uploads/         # Uploaded files
├── logs/            # Application logs
└── server.js        # Main server file
```

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

