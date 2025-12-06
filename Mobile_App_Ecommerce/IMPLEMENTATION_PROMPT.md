# Complete Implementation Prompt
## Build the Entire Mobile App E-Commerce Project

This prompt is designed to create the **complete, functional codebase** for the Mobile App E-Commerce project. Follow this prompt step-by-step to build everything.

---

## 📋 Project Overview

Build a **complete, standalone E-Commerce application** with:

1. **Backend API** - Node.js + Express + Sequelize + PostgreSQL
2. **Mobile App** - React Native (iOS & Android)
3. **Web App** - React.js 18 (Vite)

**All code should be in the `Mobile_App_Ecommerce` folder. This is completely separate from any LMS project.**

---

## 📚 Reference Documentation

Before starting, review these files in the `docs/` folder:
- `MASTER_PLAN.md` - Complete project structure and phases
- `DATABASE_SCHEMA_CONVERSION.md` - Database schema and model design
- `API_ENDPOINTS_MAPPING.md` - All API endpoints and responses
- `IMPLEMENTATION_CHECKLIST.md` - Detailed task checklist
- `PROJECT_SETUP.md` - Setup and configuration guide

---

## 🎯 Implementation Instructions

### **STEP 1: Project Structure Setup**

Create the complete folder structure in `Mobile_App_Ecommerce/`:

```
Mobile_App_Ecommerce/
├── backend/              (Create this - Node.js/Express API)
├── mobile-app/           (Create this - React Native)
├── web-app/              (Create this - React.js 18)
└── docs/                 (Already exists - documentation)
```

---

### **STEP 2: Backend Implementation (Priority 1)**

Create the complete backend API in `backend/` folder:

#### 2.1 Initialize Backend Project
- Create `backend/` folder
- Initialize Node.js project (`npm init -y`)
- Create `package.json` with all required dependencies
- Create `.env.example` file with all environment variables
- Create `.gitignore` file

#### 2.2 Install Dependencies
Install all required packages:
```bash
npm install express sequelize pg pg-hstore cors helmet morgan compression express-rate-limit
npm install jsonwebtoken bcryptjs dotenv winston joi multer
npm install --save-dev nodemon sequelize-cli
```

#### 2.3 Database Configuration
- Create `config/database.js` - Sequelize configuration for PostgreSQL
- Create `config/jwt.js` - JWT configuration
- Set up environment variables structure

#### 2.4 Database Models (Use `DATABASE_SCHEMA_CONVERSION.md` as reference)
Create Sequelize models in `models/` folder:
- `models/User.js` - User model with email, name, password, role
- `models/Product.js` - Product model with name, description, price, image, stock, category
- `models/Order.js` - Order model with order_number, user_id, total, status, shipping_address
- `models/OrderItem.js` - OrderItem model with order_id, product_id, quantity, price
- `models/CartItem.js` - CartItem model with user_id, product_id, quantity
- `models/index.js` - Sequelize instance, model associations, and exports

**Model Requirements:**
- Use UUID or INTEGER for primary keys
- Use snake_case for database columns (created_at, updated_at)
- Set up all foreign key relationships
- Add validations and constraints
- Define all associations (User → Orders, Product → CartItems, etc.)

#### 2.5 Database Migrations
Create Sequelize migrations in `migrations/` folder:
- Migration to create users table
- Migration to create products table
- Migration to create orders table
- Migration to create order_items table
- Migration to create cart_items table
- Add indexes on foreign keys and frequently queried columns

#### 2.6 Database Seeders
Create seeders in `seeders/` folder:
- Seeder for admin user
- Seeder for test customer users
- Seeder for sample products with different categories

#### 2.7 Middleware
Create middleware in `middleware/` folder:
- `middleware/auth.js` - JWT authentication middleware
  - `authenticate` function - verify JWT token
  - `requireAdmin` function - check admin role
- `middleware/errorHandler.js` - Global error handling middleware
- `middleware/upload.js` - Multer configuration for product image uploads
- `middleware/validator.js` - Request validation middleware using Joi

#### 2.8 Utilities
Create utilities in `utils/` folder:
- `utils/logger.js` - Winston logger configuration
- `utils/validation.js` - Joi validation schemas for all requests
- `utils/helpers.js` - Helper functions (order number generator, etc.)

#### 2.9 Controllers (Use `API_ENDPOINTS_MAPPING.md` as reference)
Create controllers in `controllers/` folder:

**authController.js:**
- `register` - User registration with password hashing
- `login` - User login, generate JWT tokens
- `getCurrentUser` - Get authenticated user details
- `refreshToken` - Refresh access token
- `logout` - Logout (invalidate token if needed)

**productController.js:**
- `getProducts` - List products with pagination, search, category filter
- `getProduct` - Get single product by ID
- `createProduct` - Create product (admin only)
- `updateProduct` - Update product (admin only)
- `deleteProduct` - Delete product (admin only)

**cartController.js:**
- `getCart` - Get user's cart items with product details
- `addToCart` - Add item to cart or update quantity
- `updateCartItem` - Update cart item quantity
- `removeFromCart` - Remove item from cart
- `clearCart` - Clear entire cart

**orderController.js:**
- `getOrders` - Get user's orders
- `getOrder` - Get single order by ID
- `createOrder` - Create new order from cart items
- `updateOrderStatus` - Update order status (admin only)

**categoryController.js:**
- `getCategories` - Get all active categories

**wishlistController.js (if implementing):**
- `getWishlist` - Get user's wishlist
- `addToWishlist` - Add product to wishlist
- `removeFromWishlist` - Remove product from wishlist

#### 2.10 Routes (Use `API_ENDPOINTS_MAPPING.md` as reference)
Create routes in `routes/` folder:

**authRoutes.js:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protected)
- POST /api/auth/refresh
- POST /api/auth/logout (protected)

**productRoutes.js:**
- GET /api/products (public, with pagination, search, filters)
- GET /api/products/:id (public)
- POST /api/products (protected, admin only)
- PUT /api/products/:id (protected, admin only)
- DELETE /api/products/:id (protected, admin only)

**cartRoutes.js (all protected):**
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:productId
- DELETE /api/cart/:productId

**orderRoutes.js:**
- GET /api/orders (protected)
- GET /api/orders/:id (protected)
- POST /api/orders (protected)
- PUT /api/orders/:id (protected, admin only)

**categoryRoutes.js:**
- GET /api/categories

**wishlistRoutes.js (if implementing, all protected):**
- GET /api/wishlist
- POST /api/wishlist
- DELETE /api/wishlist/:productId

**routes/index.js:**
- Aggregate all routes and mount them

#### 2.11 Services (Optional but recommended)
Create services in `services/` folder:
- `services/stripeService.js` - Stripe payment integration
- `services/emailService.js` - Email sending for order confirmations
- `services/imageService.js` - Image upload and processing

#### 2.12 Main Server File
Create `server.js` in `backend/` folder:
- Express app setup
- Middleware configuration (CORS, Helmet, Morgan, Compression, Rate Limiting)
- Database connection
- Route mounting
- Error handling middleware
- Server startup

**API Response Format:**
All responses should follow this format:
```json
{
  "success": true/false,
  "data": { ... },
  "message": "Optional message",
  "error": "Error message if failed",
  "pagination": { ... } // For paginated responses
}
```

#### 2.13 Environment Variables
Create `.env.example` file with:
- Database connection variables
- JWT secrets
- Server port
- CORS origins
- Stripe keys (optional)
- Email configuration (optional)

#### 2.14 Package.json Scripts
Add scripts to `package.json`:
- `start` - Start production server
- `dev` - Start development server with nodemon
- `db:migrate` - Run migrations
- `db:seed` - Run seeders
- `db:reset` - Reset database (drop, migrate, seed)

---

### **STEP 3: Mobile App Implementation (Priority 2)**

Create the complete React Native mobile app in `mobile-app/` folder:

#### 3.1 Initialize React Native Project
- Create `mobile-app/` folder
- Initialize React Native project (choose Expo or React Native CLI)
- Install all required dependencies
- Create `.env.example` file

#### 3.2 Project Structure
Create folder structure:
```
mobile-app/
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── store/
│   ├── services/
│   ├── utils/
│   └── context/
├── assets/
├── android/
└── ios/
```

#### 3.3 Dependencies Installation
Install required packages:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios zustand @react-native-async-storage/async-storage
npm install react-native-elements react-native-vector-icons react-hook-form
```

#### 3.4 API Service Layer
Create `src/services/api.js`:
- Axios instance with base URL from environment
- Request interceptor to add JWT token
- Response interceptor for error handling and token refresh
- Automatic token refresh on 401

Create service files:
- `src/services/authService.js` - Authentication API calls
- `src/services/productService.js` - Product API calls
- `src/services/cartService.js` - Cart API calls
- `src/services/orderService.js` - Order API calls
- `src/services/categoryService.js` - Category API calls
- `src/services/wishlistService.js` - Wishlist API calls (if implementing)

#### 3.5 State Management
Create Zustand stores in `src/store/`:
- `authStore.js` - Authentication state (user, token, login, logout)
- `cartStore.js` - Cart state (items, add, remove, update)
- `productStore.js` - Product state (products, filters, search)
- `categoryStore.js` - Category state
- `wishlistStore.js` - Wishlist state (if implementing)

#### 3.6 Navigation Setup
Create navigation in `src/navigation/`:
- `AppNavigator.js` - Main app navigator
- `AuthNavigator.js` - Authentication flow (Login, Register)
- `TabNavigator.js` - Bottom tab navigator (Home, Products, Cart, Orders, Profile)

#### 3.7 Screens Implementation

**Authentication Screens (`src/screens/Auth/`):**
- `LoginScreen.js` - Login form with validation
- `RegisterScreen.js` - Registration form with validation
- `ForgotPasswordScreen.js` - Password reset (optional)

**Home Screen (`src/screens/Home/`):**
- `HomeScreen.js` - Featured products, categories, banners

**Product Screens (`src/screens/Products/`):**
- `ProductListScreen.js` - Product listing with filters, search, pagination
- `ProductDetailScreen.js` - Product details, images, add to cart, add to wishlist
- `ProductSearchScreen.js` - Search functionality

**Cart Screen (`src/screens/Cart/`):**
- `CartScreen.js` - Cart items, update quantities, remove items, checkout button

**Wishlist Screen (`src/screens/Wishlist/` - if implementing):**
- `WishlistScreen.js` - Wishlist items, move to cart, remove

**Checkout Screens (`src/screens/Checkout/`):**
- `CheckoutScreen.js` - Shipping address form, order summary
- `PaymentScreen.js` - Payment integration

**Order Screens (`src/screens/Orders/`):**
- `OrderListScreen.js` - Order history
- `OrderDetailScreen.js` - Order details with status

**Profile Screens (`src/screens/Profile/`):**
- `ProfileScreen.js` - User profile display
- `EditProfileScreen.js` - Edit profile form
- `AddressBookScreen.js` - Manage shipping addresses

**Settings Screen (`src/screens/Settings/`):**
- `SettingsScreen.js` - App settings, logout

#### 3.8 Components
Create reusable components in `src/components/`:
- `common/Button.js` - Reusable button component
- `common/Input.js` - Reusable input component
- `common/Card.js` - Card container component
- `common/Loading.js` - Loading spinner component
- `ProductCard.js` - Product card component
- `CartItem.js` - Cart item component
- `OrderCard.js` - Order card component
- `Header.js` - App header component

#### 3.9 Utilities
Create utilities in `src/utils/`:
- `constants.js` - App constants (API URLs, colors, etc.)
- `helpers.js` - Helper functions
- `storage.js` - AsyncStorage wrapper for token storage

#### 3.10 App Configuration
- Create `app.json` or configure `package.json`
- Set up environment variables
- Configure app icons and splash screens

---

### **STEP 4: Web App Implementation (Priority 3)**

Create the complete React.js 18 web app in `web-app/` folder:

#### 4.1 Initialize React Project
- Create `web-app/` folder
- Initialize React.js 18 project with Vite
- Install all required dependencies
- Create `.env.example` file

#### 4.2 Project Structure
Create folder structure:
```
web-app/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── store/
│   ├── contexts/
│   ├── utils/
│   └── styles/
├── public/
└── index.html
```

#### 4.3 Dependencies Installation
Install required packages:
```bash
npm install axios zustand react-router-dom
npm install react-hook-form
npm install -D tailwindcss  # Optional for styling
```

#### 4.4 API Service Layer
Create `src/services/api.js`:
- Axios instance with base URL
- Request interceptor for JWT token
- Response interceptor for error handling

Create service files:
- `src/services/authService.js`
- `src/services/productService.js`
- `src/services/cartService.js`
- `src/services/orderService.js`
- `src/services/categoryService.js`
- `src/services/wishlistService.js` (if implementing)

#### 4.5 State Management
Create Zustand stores in `src/store/`:
- `authStore.js`
- `cartStore.js`
- `productStore.js`
- `categoryStore.js`
- `wishlistStore.js` (if implementing)

#### 4.6 Routing
Set up React Router in `src/App.js`:
- Public routes (Home, Products, Product Detail, Login, Register)
- Protected routes (Cart, Orders, Profile, Wishlist)
- Admin routes (if needed)

#### 4.7 Pages Implementation
Create pages in `src/pages/`:
- `Home.js` - Homepage with featured products
- `Products.js` - Product listing with filters and search
- `ProductDetail.js` - Product detail page
- `Cart.js` - Shopping cart page
- `Wishlist.js` - Wishlist page (if implementing)
- `Checkout.js` - Checkout page
- `Orders.js` - Order history page
- `OrderDetail.js` - Order detail page
- `Login.js` - Login page
- `Register.js` - Registration page
- `Profile.js` - User profile page

#### 4.8 Components
Create reusable components in `src/components/`:
- `Layout/Header.js` - Site header with navigation
- `Layout/Footer.js` - Site footer
- `ProductCard.js` - Product card component
- `CartItem.js` - Cart item component
- `OrderCard.js` - Order card component
- `Loading.js` - Loading component
- `Error.js` - Error component

#### 4.9 Authentication Context
Create `src/contexts/AuthContext.js`:
- Authentication state management
- Login/logout functions
- Protected route wrapper

---

## ✅ Implementation Requirements

### **Functional Requirements:**
1. **Backend must be fully functional:**
   - All API endpoints working
   - Authentication with JWT
   - Database operations working
   - Error handling implemented
   - Request validation working

2. **Mobile app must be fully functional:**
   - All screens implemented
   - Navigation working
   - API integration working
   - State management working
   - Authentication flow working

3. **Web app must be fully functional:**
   - All pages implemented
   - Routing working
   - API integration working
   - State management working
   - Authentication flow working

### **Code Quality Requirements:**
- Clean, well-structured code
- Proper error handling
- Input validation
- Consistent code style
- Comments where necessary
- Environment variables for configuration

### **Database Requirements:**
- All migrations must run successfully
- All seeders must work
- Foreign key relationships must be correct
- Indexes added for performance

### **API Requirements:**
- All endpoints must match `API_ENDPOINTS_MAPPING.md`
- Response format must be consistent
- Error responses must be properly formatted
- Authentication must work correctly

---

## 🚀 Implementation Order

**Follow this order for implementation:**

1. **Backend First** (Complete Steps 2.1 - 2.14)
   - Set up project structure
   - Create database models and migrations
   - Implement all controllers and routes
   - Test all API endpoints with Postman/Thunder Client

2. **Mobile App Second** (Complete Steps 3.1 - 3.10)
   - Set up React Native project
   - Implement API service layer
   - Build all screens
   - Connect to backend API
   - Test on simulator/emulator

3. **Web App Third** (Complete Steps 4.1 - 4.9)
   - Set up React.js project
   - Implement API service layer
   - Build all pages
   - Connect to backend API
   - Test in browser

---

## 📝 Testing Checklist

After implementation, test:

**Backend:**
- [ ] All API endpoints respond correctly
- [ ] Authentication works (login, register, token refresh)
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Database operations work correctly
- [ ] Error handling works correctly

**Mobile App:**
- [ ] App runs on iOS simulator
- [ ] App runs on Android emulator
- [ ] Login/Register works
- [ ] Product listing works
- [ ] Cart functionality works
- [ ] Order creation works
- [ ] Navigation works correctly

**Web App:**
- [ ] App runs in browser
- [ ] Login/Register works
- [ ] Product listing works
- [ ] Cart functionality works
- [ ] Order creation works
- [ ] Routing works correctly

---

## 🔧 Configuration Notes

1. **Environment Variables:**
   - Backend needs database connection, JWT secrets
   - Mobile app needs API URL
   - Web app needs API URL

2. **Database:**
   - Create PostgreSQL database first
   - Run migrations before starting backend
   - Run seeders for test data

3. **CORS:**
   - Backend must allow requests from web app (localhost:3000 or 5173)
   - Backend must allow requests from mobile app (localhost:8081 for Expo)

---

## 📚 Reference Files

Always refer to these files for accuracy:
- **Structure & Plan:** `docs/MASTER_PLAN.md`
- **Database Schema:** `docs/DATABASE_SCHEMA_CONVERSION.md`
- **API Endpoints:** `docs/API_ENDPOINTS_MAPPING.md`
- **Setup Guide:** `docs/PROJECT_SETUP.md`
- **Checklist:** `docs/IMPLEMENTATION_CHECKLIST.md`

---

## 🎯 Success Criteria

The project is complete when:
- ✅ Backend API is running and all endpoints work
- ✅ Mobile app runs on iOS and Android
- ✅ Web app runs in browser
- ✅ All features work end-to-end
- ✅ Authentication works on all platforms
- ✅ Database operations work correctly
- ✅ Code is clean and well-structured

---

**Start implementation with Backend (Step 2), then Mobile App (Step 3), then Web App (Step 4). Make sure each step is fully functional before moving to the next!**

---

**Ready to build? Begin with Step 2: Backend Implementation!** 🚀

