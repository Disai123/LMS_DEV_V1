# Mobile App E-Commerce - Master Implementation Plan

## 📋 Executive Summary

This is a **standalone, complete E-Commerce project** with:
- **Backend API** built with Node.js + Express + Sequelize + PostgreSQL
- **React Native Mobile App** for iOS and Android
- **Web Frontend** (Next.js or React) that shares the same backend API

**Reference:** This project references the existing `Ecommerce` folder only for understanding features and requirements. It is completely separate and self-contained.

---

## 🎯 Project Goals

1. **Build Complete Backend API** with Node.js/Express + Sequelize + PostgreSQL (standalone, not related to LMS)
2. **Build React Native Mobile App** that consumes the backend API
3. **Build Web Frontend** (Next.js or React) that shares the same backend API
4. **All components in this folder** - completely self-contained project
5. **Share Database** between web and mobile applications

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────┬───────────────────────────────────────┤
│   Web Client        │        Mobile App                      │
│   (Next.js)         │        (React Native)                  │
│   Port: 3000        │        iOS/Android                     │
└──────────┬──────────┴────────────┬──────────────────────────┘
           │                       │
           │  REST API + JWT       │
           │                       │
┌──────────▼───────────────────────▼──────────────────────────┐
│          BACKEND API (Node.js + Express + Sequelize)        │
│          Port: 5001 (or separate port)                      │
│                                                              │
│  Routes:                                                     │
│  - /api/products                                             │
│  - /api/cart                                                 │
│  - /api/orders                                               │
│  - /api/auth                                                 │
│  - /api/admin                                                │
│  - /api/payments                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Sequelize ORM
                             │
┌────────────────────────────▼────────────────────────────────┐
│              PostgreSQL Database                              │
│  Tables:                                                      │
│  - users                                                      │
│  - products                                                   │
│  - orders                                                     │
│  - order_items                                               │
│  - cart_items                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

**IMPORTANT:** This is a **standalone project**. Everything is self-contained in the `Mobile_App_Ecommerce` folder.

```
Mobile_App_Ecommerce/                   (THIS FOLDER - Complete Standalone Project)
    │
    ├── backend/                        (E-commerce Backend API - Node.js + Express)
    │   ├── server.js
    │   ├── package.json
    │   ├── .env.example
    │   ├── .gitignore
    │   ├── server.js
    │   ├── package.json
    │   ├── .env.example
    │   ├── .gitignore
    │   │
    │   ├── config/
    │   │   ├── database.js             (Sequelize + PostgreSQL config)
    │   │   └── jwt.js                  (JWT authentication config)
    │   │
    │   ├── models/                     (Sequelize Models)
    │   │   ├── index.js                (Sequelize instance & associations)
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   ├── Order.js
    │   │   ├── OrderItem.js
    │   │   └── CartItem.js
    │   │
    │   ├── migrations/                 (Sequelize Migrations)
    │   │   ├── YYYYMMDDHHMMSS-create-users.js
    │   │   ├── YYYYMMDDHHMMSS-create-products.js
    │   │   ├── YYYYMMDDHHMMSS-create-orders.js
    │   │   ├── YYYYMMDDHHMMSS-create-order-items.js
    │   │   └── YYYYMMDDHHMMSS-create-cart-items.js
    │   │
    │   ├── seeders/                    (Database Seeders)
    │   │   ├── YYYYMMDDHHMMSS-seed-users.js
    │   │   └── YYYYMMDDHHMMSS-seed-products.js
    │   │
    │   ├── routes/                     (Express Routes)
    │   │   ├── index.js                (Route aggregator)
    │   │   ├── products.js
    │   │   ├── cart.js
    │   │   ├── orders.js
    │   │   ├── auth.js
    │   │   └── admin.js
    │   │
    │   ├── controllers/                (Business Logic)
    │   │   ├── productController.js
    │   │   ├── cartController.js
    │   │   ├── orderController.js
    │   │   ├── authController.js
    │   │   └── adminController.js
    │   │
    │   ├── middleware/                 (Express Middleware)
    │   │   ├── auth.js                 (JWT authentication)
    │   │   ├── errorHandler.js
    │   │   ├── upload.js               (File upload - product images)
    │   │   └── validator.js            (Request validation)
    │   │
    │   ├── services/                   (Service Layer)
    │   │   ├── stripeService.js        (Payment processing)
    │   │   ├── emailService.js         (Order notifications)
    │   │   └── imageService.js         (Image upload/processing)
    │   │
    │   ├── utils/                      (Utilities)
    │   │   ├── logger.js               (Winston logger)
    │   │   ├── validation.js           (Joi validation schemas)
    │   │   └── helpers.js              (Helper functions)
    │   │
    │   ├── uploads/                    (Uploaded files)
    │   │   └── products/
    │   │
    │   └── logs/                       (Application logs)
    │
    ├── web-app/                        (Web Frontend - Next.js or React)
    │   ├── package.json
    │   ├── next.config.js (or vite.config.js)
    │   ├── .env.example
    │   ├── .gitignore
    │   │
    │   ├── src/ (or app/ for Next.js)
    │   │   ├── pages/ (or app/ for Next.js 13+)
    │   │   │   ├── index.js (Home)
    │   │   │   ├── products.js
    │   │   │   ├── product/[id].js
    │   │   │   ├── cart.js
    │   │   │   ├── checkout.js
    │   │   │   ├── orders.js
    │   │   │   ├── login.js
    │   │   │   ├── register.js
    │   │   │   └── admin/
    │   │   ├── components/
    │   │   ├── services/ (API calls)
    │   │   ├── store/ (State management)
    │   │   └── utils/
    │   └── public/
    │
    ├── mobile-app/                     (React Native Mobile App - iOS & Android)
    │   ├── package.json
    │   ├── app.json
    │   ├── .env.example
    │   ├── .gitignore
    │   │
    │   ├── src/
    │   │   ├── screens/                (App Screens)
    │   │   │   ├── Auth/
    │   │   │   │   ├── LoginScreen.js
    │   │   │   │   ├── RegisterScreen.js
    │   │   │   │   └── ForgotPasswordScreen.js
    │   │   │   ├── Home/
    │   │   │   │   └── HomeScreen.js
    │   │   │   ├── Products/
    │   │   │   │   ├── ProductListScreen.js
    │   │   │   │   ├── ProductDetailScreen.js
    │   │   │   │   └── ProductSearchScreen.js
    │   │   │   ├── Cart/
    │   │   │   │   └── CartScreen.js
    │   │   │   ├── Checkout/
    │   │   │   │   ├── CheckoutScreen.js
    │   │   │   │   └── PaymentScreen.js
    │   │   │   ├── Orders/
    │   │   │   │   ├── OrderListScreen.js
    │   │   │   │   └── OrderDetailScreen.js
    │   │   │   ├── Profile/
    │   │   │   │   ├── ProfileScreen.js
    │   │   │   │   ├── EditProfileScreen.js
    │   │   │   │   └── AddressBookScreen.js
    │   │   │   └── Settings/
    │   │   │       └── SettingsScreen.js
    │   │   │
    │   │   ├── components/             (Reusable Components)
    │   │   │   ├── common/
    │   │   │   │   ├── Button.js
    │   │   │   │   ├── Input.js
    │   │   │   │   ├── Card.js
    │   │   │   │   └── Loading.js
    │   │   │   ├── ProductCard.js
    │   │   │   ├── CartItem.js
    │   │   │   ├── OrderCard.js
    │   │   │   └── Header.js
    │   │   │
    │   │   ├── navigation/             (Navigation Setup)
    │   │   │   ├── AppNavigator.js
    │   │   │   ├── AuthNavigator.js
    │   │   │   └── TabNavigator.js
    │   │   │
    │   │   ├── store/                  (State Management - Zustand/Redux)
    │   │   │   ├── authStore.js
    │   │   │   ├── cartStore.js
    │   │   │   └── productStore.js
    │   │   │
    │   │   ├── services/               (API Services)
    │   │   │   ├── api.js              (Axios instance)
    │   │   │   ├── productService.js
    │   │   │   ├── cartService.js
    │   │   │   ├── orderService.js
    │   │   │   ├── authService.js
    │   │   │   └── paymentService.js
    │   │   │
    │   │   ├── utils/                  (Utilities)
    │   │   │   ├── constants.js
    │   │   │   ├── helpers.js
    │   │   │   └── storage.js          (AsyncStorage helpers)
    │   │   │
    │   │   └── context/                (React Context - if needed)
    │   │       └── AuthContext.js
    │   │
    │   ├── assets/                     (Static Assets)
    │   │   ├── images/
    │   │   ├── icons/
    │   │   └── fonts/
    │   │
    │   ├── android/                    (Android native code)
    │   ├── ios/                        (iOS native code)
    │   └── __tests__/                  (Tests)
    │
    └── docs/                           (Documentation)
        ├── API_DOCUMENTATION.md
        ├── DATABASE_SCHEMA.md
        ├── MOBILE_APP_GUIDE.md
        └── DEPLOYMENT_GUIDE.md
```

---

## 🔄 Migration Phases

### **Phase 1: Backend Extraction** (Week 1-2)

#### 1.1 Database Setup
- Create new PostgreSQL database for e-commerce (standalone, separate from any other project)
- Design Sequelize models based on existing E-commerce Prisma schema:
  - User model
  - Product model
  - Order model
  - OrderItem model
  - CartItem model
- Create Sequelize migrations for all tables
- Set up database configuration file

#### 1.2 Backend Structure Creation
- Initialize Node.js/Express project in `backend/` folder
- Set up folder structure (routes, controllers, models, middleware)
- Configure Sequelize connection
- Set up Winston logger
- Configure CORS for mobile app and web app
- Set up environment variables

#### 1.3 Model Implementation
- Convert Prisma schema to Sequelize models
- Set up model associations (User → Orders, Product → CartItems, etc.)
- Define model validations and constraints
- Map Prisma types to Sequelize types:
  - String → STRING
  - Decimal → DECIMAL(10, 2)
  - DateTime → DATE
  - Boolean → BOOLEAN
  - Enum → ENUM

#### 1.4 API Routes Conversion
Convert each Next.js API route to Express route:

**Products API:**
- GET /api/products (list with pagination, filters)
- GET /api/products/:id (single product)
- POST /api/products (admin only - create)
- PUT /api/products/:id (admin only - update)
- DELETE /api/products/:id (admin only - delete)

**Cart API:**
- GET /api/cart (get user's cart)
- POST /api/cart (add item to cart)
- PUT /api/cart/:id (update cart item quantity)
- DELETE /api/cart/:id (remove from cart)

**Orders API:**
- GET /api/orders (user's orders)
- GET /api/orders/:id (single order)
- POST /api/orders (create order)
- PUT /api/orders/:id (update status - admin)

**Auth API:**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me (current user)
- POST /api/auth/refresh (refresh token)

**Admin API:**
- GET /api/admin/dashboard (stats)
- GET /api/admin/orders (all orders)
- PUT /api/admin/orders/:id (update order status)
- GET /api/admin/products (all products with filters)
- GET /api/admin/users (all users)

#### 1.5 Authentication Setup
- Implement JWT authentication (same pattern as LMS backend)
- Replace NextAuth with JWT tokens
- Create authentication middleware
- Set up token refresh mechanism
- Configure password hashing (bcrypt - same as LMS)

#### 1.6 Controller Implementation
- Extract business logic from Next.js API routes
- Create controllers for each resource
- Implement error handling
- Add request validation using Joi (like LMS backend)

#### 1.7 Services Layer
- Stripe payment integration service
- Email notification service (order confirmations)
- Image upload service (product images)

#### 1.8 Testing
- Test all API endpoints with Postman/Thunder Client
- Verify database operations
- Test authentication flow
- Test error handling

---

### **Phase 2: Database Migration** (Week 2)

#### 2.1 Data Migration Strategy
- Option A: Start fresh with new database (if no production data)
- Option B: Migrate existing data from Prisma database (if needed)

#### 2.2 Migration Scripts
- Create scripts to export data from Prisma database
- Create scripts to import data into Sequelize database
- Verify data integrity after migration

#### 2.3 Seed Data
- Create seeders for development data
- Seed products, categories, admin users

---

### **Phase 3: React Native Mobile App** (Week 3-5)

#### 3.1 Project Setup
- Initialize React Native project (using CLI or Expo)
- Install required dependencies:
  - Navigation (React Navigation)
  - HTTP client (Axios)
  - State management (Zustand or Redux)
  - Storage (AsyncStorage)
  - UI components library (React Native Elements or NativeBase)
  - Forms (React Hook Form)

#### 3.2 Navigation Setup
- Set up stack navigation
- Set up tab navigation (Home, Products, Cart, Orders, Profile)
- Implement authentication flow navigation
- Create navigation guards (protected routes)

#### 3.3 API Service Layer
- Create Axios instance with base URL
- Implement request interceptors (add JWT token)
- Implement response interceptors (handle errors)
- Create service functions for each API endpoint
- Handle token refresh automatically

#### 3.4 State Management
- Set up Zustand stores (or Redux):
  - Auth store (user, token, login/logout)
  - Cart store (cart items, add/remove/update)
  - Product store (products list, search, filters)
  - Order store (user orders)

#### 3.5 Authentication Screens
- Login screen with form validation
- Registration screen
- Forgot password screen
- Store JWT token in AsyncStorage
- Handle token expiration and refresh

#### 3.6 Home & Product Screens
- Home screen with featured products
- Product list screen with filters and search
- Product detail screen with images, description, add to cart
- Product search functionality

#### 3.7 Cart Screens
- Cart screen showing all items
- Update quantities
- Remove items
- Calculate total price
- Navigate to checkout

#### 3.8 Checkout & Payment
- Checkout screen with shipping address form
- Order summary
- Payment integration (Stripe or other)
- Order confirmation screen

#### 3.9 Orders Screens
- Order history list
- Order detail screen with tracking
- Order status updates

#### 3.10 Profile & Settings
- User profile screen
- Edit profile
- Address book management
- Settings screen
- Logout functionality

#### 3.11 UI/UX Polish
- Add loading indicators
- Error handling and messages
- Pull-to-refresh
- Image caching
- Offline support (optional)

#### 3.12 Testing
- Test on iOS simulator
- Test on Android emulator
- Test on physical devices
- Test all user flows

---

### **Phase 4: Next.js Frontend Update** (Week 5-6)

#### 4.1 Update API Calls
- Remove Next.js API routes usage
- Update all API calls to point to new backend API
- Replace NextAuth with JWT authentication
- Update token storage (cookies or localStorage)

#### 4.2 Authentication Update
- Implement JWT login/logout
- Store tokens in HTTP-only cookies or localStorage
- Handle token refresh
- Update protected route logic

#### 4.3 Testing Web App
- Test all web functionality
- Verify cart, checkout, orders work
- Test admin panel
- Ensure no breaking changes

---

### **Phase 5: Integration & Testing** (Week 6-7)

#### 5.1 End-to-End Testing
- Test complete user flows (web)
- Test complete user flows (mobile)
- Test data consistency between web and mobile
- Test concurrent access (same user on web + mobile)

#### 5.2 Performance Testing
- Backend API performance
- Mobile app performance
- Database query optimization
- Image loading optimization

#### 5.3 Security Testing
- JWT token security
- API endpoint security
- SQL injection prevention
- XSS prevention
- CORS configuration

---

### **Phase 6: Deployment** (Week 7-8)

#### 6.1 Backend Deployment
- Deploy backend API to server (AWS, Heroku, DigitalOcean, etc.)
- Set up environment variables
- Configure production database connection
- Set up monitoring and logging
- Configure domain name and SSL

#### 6.2 Mobile App Deployment
- Configure production API URL
- Build Android APK
- Build iOS IPA
- Test production builds
- Submit to Google Play Store
- Submit to Apple App Store

#### 6.3 Web App Deployment
- Update environment variables with production backend URL
- Build for production
- Deploy to Vercel/Netlify/Railway
- Test production deployment

---

## 🗄️ Database Schema (Sequelize Models)

### Users Table
- id (UUID or INTEGER PRIMARY KEY)
- email (STRING, UNIQUE, NOT NULL)
- name (STRING, NULLABLE)
- password (STRING, NULLABLE - for OAuth users)
- role (ENUM: 'customer', 'admin') - DEFAULT 'customer'
- created_at (DATE)
- updated_at (DATE)

### Products Table
- id (UUID or INTEGER PRIMARY KEY)
- name (STRING, UNIQUE, NOT NULL)
- description (TEXT, NULLABLE)
- price (DECIMAL(10, 2), NOT NULL)
- image (STRING, NULLABLE - URL or path)
- stock (INTEGER, DEFAULT 0)
- is_active (BOOLEAN, DEFAULT true)
- category (STRING, NULLABLE)
- created_at (DATE)
- updated_at (DATE)

### Orders Table
- id (UUID or INTEGER PRIMARY KEY)
- order_number (STRING, UNIQUE, NOT NULL)
- user_id (FOREIGN KEY → users.id)
- total (DECIMAL(10, 2), NOT NULL)
- status (ENUM: 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
- shipping_address (JSON/TEXT - store as JSONB in PostgreSQL)
- created_at (DATE)
- updated_at (DATE)

### Order Items Table
- id (UUID or INTEGER PRIMARY KEY)
- order_id (FOREIGN KEY → orders.id, CASCADE DELETE)
- product_id (FOREIGN KEY → products.id)
- quantity (INTEGER, NOT NULL)
- price (DECIMAL(10, 2), NOT NULL - snapshot at time of order)
- created_at (DATE)
- updated_at (DATE)

### Cart Items Table
- id (UUID or INTEGER PRIMARY KEY)
- user_id (FOREIGN KEY → users.id, CASCADE DELETE)
- product_id (FOREIGN KEY → products.id, CASCADE DELETE)
- quantity (INTEGER, NOT NULL)
- UNIQUE constraint on (user_id, product_id)
- created_at (DATE)
- updated_at (DATE)

---

## 🔐 Authentication Strategy

### JWT Token Structure
- Access Token: Short-lived (15 minutes - 1 hour)
- Refresh Token: Long-lived (7-30 days)
- Token payload: { id, email, role }

### Authentication Flow

**Login:**
1. User sends email/password to POST /api/auth/login
2. Backend validates credentials
3. Backend generates access token + refresh token
4. Backend returns tokens to client
5. Client stores tokens (AsyncStorage for mobile, cookies/localStorage for web)

**Protected Routes:**
1. Client sends request with Authorization: Bearer <token>
2. Backend middleware validates token
3. If valid, proceed; if invalid, return 401

**Token Refresh:**
1. When access token expires, client uses refresh token
2. POST /api/auth/refresh with refresh token
3. Backend validates refresh token and issues new access token
4. Client updates stored access token

---

## 📱 Mobile App Features

### Core Features
1. **Authentication**
   - Email/password login
   - Registration
   - Logout
   - Token refresh

2. **Product Browsing**
   - Product list with pagination
   - Product search
   - Category filters
   - Product detail view
   - Product images gallery

3. **Shopping Cart**
   - Add to cart
   - View cart items
   - Update quantities
   - Remove items
   - Calculate totals

4. **Checkout**
   - Shipping address form
   - Order summary
   - Payment processing
   - Order confirmation

5. **Orders**
   - Order history
   - Order details
   - Order status tracking

6. **Profile**
   - View profile
   - Edit profile
   - Manage addresses
   - Settings

### Nice-to-Have Features
- Push notifications for order updates
- Wishlist functionality
- Product reviews and ratings
- Barcode scanning for product lookup
- Offline mode (cache products)
- Biometric authentication

---

## 🔧 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Logging:** Winston
- **File Upload:** Multer
- **Payment:** Stripe SDK

### Mobile App
- **Framework:** React Native
- **Navigation:** React Navigation
- **State Management:** Zustand (or Redux)
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Forms:** React Hook Form
- **UI Library:** React Native Elements (or NativeBase)
- **Icons:** React Native Vector Icons

### Web App (Existing - Update Only)
- **Framework:** Next.js 14
- **State Management:** Zustand
- **HTTP Client:** Fetch API or Axios
- **Authentication:** JWT (replace NextAuth)

---

## 📊 API Response Format

All API responses should follow consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": { ... } // Optional validation errors
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔒 Security Considerations

1. **JWT Security**
   - Use strong secret keys
   - Set appropriate token expiration
   - Implement token refresh mechanism
   - Store tokens securely

2. **API Security**
   - Rate limiting on API endpoints
   - Input validation and sanitization
   - SQL injection prevention (Sequelize handles this)
   - CORS configuration
   - Helmet.js for security headers

3. **Password Security**
   - Hash passwords with bcrypt
   - Minimum password requirements
   - Password reset functionality

4. **Payment Security**
   - Never store credit card details
   - Use Stripe for payment processing
   - Validate payment on backend only

---

## 📈 Performance Considerations

1. **Database**
   - Add indexes on frequently queried columns
   - Optimize queries (avoid N+1 problems)
   - Use pagination for large datasets
   - Cache frequently accessed data (optional)

2. **API**
   - Implement response caching where appropriate
   - Compress responses
   - Optimize image sizes

3. **Mobile App**
   - Implement image caching
   - Lazy load product images
   - Optimize bundle size
   - Use FlatList for large lists

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for controllers
- Unit tests for services
- Integration tests for API endpoints
- Database migration tests

### Mobile App Testing
- Component tests
- Screen flow tests
- API integration tests
- Device testing (iOS and Android)

### E2E Testing
- Complete user flows
- Cross-platform testing
- Concurrent user testing

---

## 📝 Documentation Requirements

1. **API Documentation**
   - Endpoint list with request/response examples
   - Authentication guide
   - Error codes reference

2. **Database Documentation**
   - Entity relationship diagram
   - Table schemas
   - Migration guide

3. **Mobile App Documentation**
   - Setup guide
   - Build instructions
   - Deployment guide
   - Feature documentation

---

## ✅ Success Criteria

### Backend
- [ ] All Next.js API routes successfully migrated
- [ ] All endpoints tested and working
- [ ] Authentication working with JWT
- [ ] Database migrations completed
- [ ] Error handling implemented
- [ ] Logging configured

### Mobile App
- [ ] All core features implemented
- [ ] Works on both iOS and Android
- [ ] Authentication flow complete
- [ ] Shopping flow complete (browse → cart → checkout → order)
- [ ] UI/UX polished
- [ ] Performance optimized

### Integration
- [ ] Web app using new backend
- [ ] Mobile app using new backend
- [ ] Data consistent across platforms
- [ ] No breaking changes

---

## 🚀 Next Steps

1. **Review this plan** with your team
2. **Set up development environment**
3. **Start with Phase 1** (Backend Extraction)
4. **Follow phases sequentially** (each builds on previous)
5. **Test thoroughly** at each phase
6. **Deploy incrementally** (backend first, then mobile app)

---

## 📞 Notes

- This project uses **Sequelize** (not Prisma) for direct PostgreSQL control
- All database operations use **PostgreSQL directly** through Sequelize
- The backend structure follows standard Express + Sequelize patterns
- Mobile app can be built with **React Native CLI or Expo** (your choice)
- Both web and mobile **share the same backend API**

---

**Ready to begin? Start with Phase 1 - Backend Development!** 🎯

