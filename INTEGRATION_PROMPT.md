# Integration Prompt for Full Stack E-Commerce Web Application

Connect and integrate the frontend React application with the backend FastAPI application.

## Integration Overview
Integrate the frontend React app with the backend FastAPI API, ensuring proper communication, authentication, error handling, and data flow.

## Tech Stack
- Frontend: React with Axios
- Backend: FastAPI
- Authentication: JWT tokens
- CORS: Configured for cross-origin requests

## Integration Tasks

### 1. API Configuration Setup

#### Create API Service File
Create `frontend/src/services/api.js` or `frontend/src/utils/api.js`:
- Configure Axios instance with base URL
- Read API base URL from environment variables
- Set default headers (Content-Type: application/json)
- Add request interceptor to include JWT token in headers
- Add response interceptor for error handling
- Handle token refresh if needed
- Export configured axios instance

#### Environment Variables Setup
Create `frontend/.env` and `frontend/.env.example`:
- REACT_APP_API_URL: Backend API base URL (e.g., http://localhost:8000 or production URL)
- REACT_APP_API_VERSION: API version if applicable (e.g., /api/v1)

### 2. Authentication Integration

#### Login Integration
- Connect Login page form to POST /login endpoint
- Send email and password to backend
- Store JWT token in localStorage on successful login
- Handle authentication errors (invalid credentials)
- Redirect to /products on success
- Show loading state during API call
- Display error messages from backend

#### Registration Integration
- Connect Registration page form to POST /register endpoint
- Send user data (email, password, full_name) to backend
- Store JWT token in localStorage on successful registration
- Handle validation errors (duplicate email, weak password)
- Redirect to /products on success
- Show loading state during API call
- Display error messages from backend

#### Token Management
- Automatically include JWT token in Authorization header for protected routes
- Format: `Authorization: Bearer <token>`
- Handle token expiration (redirect to login if token invalid)
- Clear token on logout
- Check token validity on app initialization

#### Protected Route Setup
- Create route protection wrapper component
- Check for valid JWT token before rendering protected pages
- Redirect to /login if no valid token
- Apply to: Products, Cart, Checkout pages

### 3. Products Integration

#### Fetch Products
- Connect Products page to GET /products endpoint
- Fetch product list on component mount
- Display loading state while fetching
- Handle empty product list
- Handle API errors gracefully
- Store products in component state or context

#### Fetch Top Products
- Connect Home page to GET /products/top endpoint
- Fetch top 3 products for hero section
- Display loading state
- Handle errors gracefully
- Show placeholder if no products available

#### Product Details
- Connect product detail view to GET /products/{product_id} endpoint
- Fetch single product data
- Handle product not found errors
- Display product information

### 4. Cart Integration

#### Get Cart Items
- Connect Cart page to GET /cart endpoint
- Fetch user's cart items on component mount
- Include JWT token in request header
- Update CartContext with fetched items
- Handle empty cart state
- Calculate and display total from backend or frontend

#### Add to Cart
- Connect "Add to Cart" button to POST /cart/add endpoint
- Send product_id and quantity (default 1)
- Include JWT token in request header
- Update CartContext after successful add
- Show success notification
- Handle errors (product not found, out of stock)
- Update cart count in navigation

#### Update Cart Item Quantity
- Connect quantity +/- buttons to PUT /cart/{cart_item_id} endpoint
- Send updated quantity
- Include JWT token in request header
- Update CartContext with new quantity
- Recalculate total
- Handle errors (invalid quantity, out of stock)

#### Remove Cart Item
- Connect remove button to DELETE /cart/{cart_item_id} endpoint
- Include JWT token in request header
- Remove item from CartContext after successful deletion
- Update cart total
- Show confirmation if needed
- Handle errors gracefully

#### Clear Cart
- Connect clear cart functionality to DELETE /cart/clear endpoint
- Include JWT token in request header
- Clear CartContext after successful clear
- Handle errors gracefully

### 5. Orders Integration

#### Create Order
- Connect Checkout page "Place Order" button to POST /orders endpoint
- Send order data: shipping_address, full_name, email, phone_number
- Include JWT token in request header
- Send cart items from CartContext
- Show loading state during order creation
- Handle validation errors (empty cart, invalid address)
- Clear cart after successful order
- Show success confirmation with order details
- Redirect to order confirmation page or home

#### Get User Orders
- Connect Orders/History page to GET /orders endpoint
- Fetch all orders for authenticated user
- Include JWT token in request header
- Display order list with details
- Show loading state
- Handle empty orders state
- Display order items for each order

#### Get Single Order
- Connect order details view to GET /orders/{order_id} endpoint
- Fetch order details by ID
- Include JWT token in request header
- Validate order belongs to user
- Display order information and items
- Handle order not found errors

### 6. Error Handling Integration

#### API Error Handling
- Create centralized error handler
- Parse error responses from backend
- Display user-friendly error messages
- Handle different HTTP status codes:
  - 400: Bad Request - Show validation errors
  - 401: Unauthorized - Redirect to login
  - 403: Forbidden - Show access denied message
  - 404: Not Found - Show not found message
  - 409: Conflict - Show duplicate entry message
  - 500: Server Error - Show generic error message
- Handle network errors (no connection, timeout)
- Show error notifications/toasts

#### Form Validation Integration
- Display backend validation errors in forms
- Show field-specific error messages
- Highlight invalid fields
- Prevent form submission if validation fails
- Combine frontend and backend validation

### 7. Loading States

#### Implement Loading Indicators
- Show loading spinner during API calls
- Disable buttons during API requests
- Show skeleton loaders for data fetching
- Prevent multiple simultaneous requests
- Clear loading state on error or success

### 8. CORS Configuration

#### Backend CORS Setup
- Verify CORS middleware is configured in FastAPI
- Allow frontend origin in CORS settings
- Allow necessary headers: Authorization, Content-Type
- Allow necessary methods: GET, POST, PUT, DELETE
- Handle preflight requests

### 9. Environment Configuration

#### Frontend Environment Setup
- Create `.env` file with API URL
- Create `.env.example` with placeholder values
- Use environment variables for API base URL
- Different URLs for development and production
- Never commit `.env` file to version control

#### Backend Environment Setup
- Verify `.env` file has DATABASE_URL
- Verify SECRET_KEY is set
- Verify CORS origins match frontend URL
- Use environment variables for all configuration

### 10. Data Flow Integration

#### Authentication Flow
1. User submits login/register form
2. Frontend sends request to backend
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in subsequent requests
6. Backend validates token for protected routes

#### Cart Flow
1. User clicks "Add to Cart"
2. Frontend sends POST /cart/add with product_id
3. Backend adds item to database
4. Backend returns updated cart item
5. Frontend updates CartContext
6. UI reflects cart changes

#### Checkout Flow
1. User fills checkout form
2. Frontend validates form
3. Frontend sends POST /orders with order data
4. Backend creates order and order items
5. Backend clears user's cart
6. Backend returns order confirmation
7. Frontend clears CartContext
8. Frontend shows success message

### 11. State Management Integration

#### CartContext Updates
- Sync CartContext with backend cart data
- Fetch cart on app initialization if user is logged in
- Update context after add/update/remove operations
- Persist cart state during session
- Clear context on logout

#### User Context (Optional)
- Create UserContext for user data
- Fetch user data on login using GET /me
- Store user information in context
- Update user data when needed
- Clear user data on logout

### 12. API Endpoint Mapping

#### Map Frontend Calls to Backend Endpoints
- POST /register → Registration form submission
- POST /login → Login form submission
- GET /me → Fetch current user (optional)
- GET /products → Products page listing
- GET /products/top → Home page top products
- GET /products/{id} → Product detail page
- GET /cart → Cart page items
- POST /cart/add → Add to cart button
- PUT /cart/{id} → Update quantity buttons
- DELETE /cart/{id} → Remove item button
- DELETE /cart/clear → Clear cart action
- POST /orders → Checkout form submission
- GET /orders → Orders history page
- GET /orders/{id} → Order detail page

### 13. Testing Integration

#### Test API Connections
- Test all endpoints from frontend
- Verify authentication flow
- Test error scenarios
- Verify CORS is working
- Test with different user roles if applicable
- Verify data persistence

### 14. Code Updates Required

#### Frontend Updates
- Update all API calls to use configured axios instance
- Add error handling to all API calls
- Add loading states to all API calls
- Update forms to submit to backend endpoints
- Add token to all protected route requests
- Update CartContext to sync with backend
- Add route protection for authenticated pages

#### Backend Updates (if needed)
- Verify CORS configuration
- Verify all endpoints return proper status codes
- Verify error responses are in consistent format
- Verify JWT authentication is working
- Verify database relationships are correct

## Technical Requirements

- Use Axios for all HTTP requests
- Include JWT token in Authorization header for protected routes
- Handle all HTTP status codes appropriately
- Show user-friendly error messages
- Implement proper loading states
- Sync frontend state with backend data
- Handle network errors gracefully
- Validate data before sending to backend
- Clear sensitive data on logout
- Use environment variables for configuration
- Test all integration points
- Ensure CORS is properly configured
- Handle token expiration
- Implement proper error boundaries

## Output Requirements

Generate complete integration code for:
- API service/utility file with axios configuration
- Environment variable files (.env, .env.example)
- Updated authentication pages (Login, Register) with API calls
- Updated Products page with API integration
- Updated Cart page with API integration
- Updated Checkout page with API integration
- Updated CartContext to sync with backend
- Route protection components
- Error handling utilities
- Loading state components
- API endpoint mapping documentation

Do not generate new frontend pages or backend endpoints. Only generate integration code that connects existing frontend components to existing backend endpoints.

