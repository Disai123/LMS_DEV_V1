# Backend Generation Prompt for Full Stack E-Commerce Web Application

Generate the complete backend code for a Full Stack E-Commerce Web Application using FastAPI.

## Tech Stack
- Backend: FastAPI (Python)
- Database: Neon PostgreSQL
- ORM: SQLAlchemy
- Authentication: JWT (JSON Web Tokens)
- Password Hashing: Passlib with bcrypt
- CORS: FastAPI CORS middleware

## Project Structure
Create the following file structure:
```
backend/
  app/
    __init__.py
    main.py
    database.py
    models.py
    schemas.py
    auth.py
    routes/
      __init__.py
      auth.py
      products.py
      cart.py
      orders.py
    dependencies.py
  requirements.txt
  .env.example
```

## Database Models

### User Model
Create a User model with:
- id (UUID, primary key)
- email (String, unique, required)
- password_hash (String, required)
- full_name (String, required)
- phone_number (String, optional)
- created_at (DateTime, auto-generated)
- updated_at (DateTime, auto-updated)

### Product Model
Create a Product model with:
- id (UUID, primary key)
- name (String, required)
- description (Text, optional)
- price (Float, required)
- image_url (String, optional)
- stock_quantity (Integer, default 0)
- created_at (DateTime, auto-generated)
- updated_at (DateTime, auto-updated)

### Cart Model
Create a Cart model with:
- id (UUID, primary key)
- user_id (UUID, foreign key to User)
- product_id (UUID, foreign key to Product)
- quantity (Integer, required, default 1)
- created_at (DateTime, auto-generated)
- updated_at (DateTime, auto-updated)
- Unique constraint on user_id and product_id

### Order Model
Create an Order model with:
- id (UUID, primary key)
- user_id (UUID, foreign key to User)
- total_amount (Float, required)
- status (String, default "pending")
- shipping_address (Text, required)
- full_name (String, required)
- email (String, required)
- phone_number (String, required)
- created_at (DateTime, auto-generated)
- updated_at (DateTime, auto-updated)

### OrderItem Model
Create an OrderItem model with:
- id (UUID, primary key)
- order_id (UUID, foreign key to Order)
- product_id (UUID, foreign key to Product)
- quantity (Integer, required)
- price (Float, required)
- created_at (DateTime, auto-generated)

## Database Schema Requirements

- Use SQLAlchemy ORM for database operations
- Set up database connection using connection string
- Create database session dependency
- Implement database initialization
- Create all tables on startup
- Use UUID for primary keys
- Set up proper foreign key relationships
- Add indexes for frequently queried fields

## API Endpoints

### Authentication Endpoints

#### POST /register
- Accept user registration data (email, password, full_name)
- Validate email format and uniqueness
- Hash password using Passlib bcrypt
- Create new user in database
- Return user data (without password) and JWT token
- Handle duplicate email errors
- Return appropriate status codes

#### POST /login
- Accept login credentials (email, password)
- Validate user exists
- Verify password using Passlib
- Generate JWT token with user ID and email
- Return JWT token and user data
- Handle invalid credentials
- Return appropriate status codes

#### GET /me
- Protected endpoint requiring JWT token
- Return current authenticated user data
- Validate JWT token from Authorization header
- Handle invalid or expired tokens

### Product Endpoints

#### GET /products
- Return list of all products
- Include pagination support
- Return product details (id, name, description, price, image_url, stock_quantity)
- Filter by availability if needed

#### GET /products/top
- Return top 3 products
- Can be based on sales, popularity, or featured flag
- Return product details

#### GET /products/{product_id}
- Return single product by ID
- Handle product not found errors
- Return appropriate status codes

### Cart Endpoints

#### GET /cart
- Protected endpoint requiring JWT token
- Return all cart items for authenticated user
- Include product details for each cart item
- Calculate total amount
- Return empty array if cart is empty

#### POST /cart/add
- Protected endpoint requiring JWT token
- Accept product_id and quantity
- Add product to user's cart
- If product already in cart, update quantity
- Validate product exists
- Validate stock availability
- Return updated cart item

#### PUT /cart/{cart_item_id}
- Protected endpoint requiring JWT token
- Update quantity of cart item
- Validate cart item belongs to user
- Validate stock availability
- Return updated cart item

#### DELETE /cart/{cart_item_id}
- Protected endpoint requiring JWT token
- Remove item from cart
- Validate cart item belongs to user
- Return success message

#### DELETE /cart/clear
- Protected endpoint requiring JWT token
- Clear all items from user's cart
- Return success message

### Order Endpoints

#### POST /orders
- Protected endpoint requiring JWT token
- Accept order data (shipping_address, full_name, email, phone_number)
- Get cart items for user
- Validate cart is not empty
- Validate stock availability for all items
- Create order with order items
- Calculate total amount
- Update product stock quantities
- Clear user's cart after order creation
- Return order details with order items

#### GET /orders
- Protected endpoint requiring JWT token
- Return all orders for authenticated user
- Include order items with product details
- Order by created_at descending

#### GET /orders/{order_id}
- Protected endpoint requiring JWT token
- Return single order by ID
- Validate order belongs to user
- Include order items with product details
- Handle order not found errors

## Authentication & Security

### JWT Token Implementation
- Generate JWT tokens on login and registration
- Include user ID and email in token payload
- Set token expiration time (e.g., 24 hours)
- Use secret key from environment variables
- Create dependency function to verify JWT tokens
- Extract user from token for protected routes

### Password Security
- Hash passwords using Passlib with bcrypt
- Never return password hashes in API responses
- Validate password strength (minimum length, complexity)
- Compare passwords securely during login

### CORS Configuration
- Configure CORS middleware
- Allow frontend origin
- Allow necessary headers (Authorization, Content-Type)
- Allow necessary methods (GET, POST, PUT, DELETE)

## Pydantic Schemas

### User Schemas
- UserCreate: email, password, full_name
- UserLogin: email, password
- UserResponse: id, email, full_name, created_at (exclude password_hash)

### Product Schemas
- ProductCreate: name, description, price, image_url, stock_quantity
- ProductResponse: id, name, description, price, image_url, stock_quantity, created_at

### Cart Schemas
- CartItemCreate: product_id, quantity
- CartItemUpdate: quantity
- CartItemResponse: id, product (ProductResponse), quantity, created_at
- CartResponse: items (list of CartItemResponse), total_amount

### Order Schemas
- OrderCreate: shipping_address, full_name, email, phone_number
- OrderItemResponse: id, product (ProductResponse), quantity, price
- OrderResponse: id, user_id, total_amount, status, shipping_address, full_name, email, phone_number, order_items (list of OrderItemResponse), created_at

## Error Handling

### Custom Exceptions
- Create custom exception handlers
- Handle validation errors
- Handle authentication errors (401)
- Handle authorization errors (403)
- Handle not found errors (404)
- Handle duplicate entry errors (409)
- Handle stock unavailable errors (400)
- Return consistent error response format

### Error Response Format
- status_code: HTTP status code
- detail: Error message
- Use HTTPException from FastAPI

## Database Configuration

### Connection Setup
- Use SQLAlchemy for database connection
- Read database URL from environment variables
- Create database engine
- Create session factory
- Implement database session dependency
- Handle connection errors gracefully

### Database Initialization
- Create all tables on application startup
- Use Alembic for migrations (optional)
- Seed initial data if needed (top 3 products)

## Environment Variables

Create .env.example with:
- DATABASE_URL: PostgreSQL connection string
- SECRET_KEY: JWT secret key
- ALGORITHM: JWT algorithm (HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time

## Main Application Setup

### FastAPI App Configuration
- Create FastAPI application instance
- Configure CORS middleware
- Include all route routers
- Add exception handlers
- Set up startup event for database initialization
- Add API documentation (Swagger UI)
- Add health check endpoint

### Route Organization
- Organize routes by feature (auth, products, cart, orders)
- Use APIRouter for each feature
- Include routers in main app
- Add route prefixes
- Add tags for API documentation

## Dependencies

### requirements.txt
Include all necessary packages:
- fastapi
- uvicorn
- sqlalchemy
- psycopg2-binary
- python-dotenv
- passlib[bcrypt]
- python-jose[cryptography]
- pydantic
- pydantic-settings

## Technical Requirements

- Use FastAPI best practices
- Implement proper dependency injection
- Use async/await for database operations
- Implement proper error handling
- Validate all input data using Pydantic
- Use type hints throughout
- Follow PEP 8 style guidelines
- Implement proper logging
- Use environment variables for configuration
- Never expose sensitive data in responses
- Implement proper database transaction handling
- Handle database connection errors
- Validate foreign key relationships
- Implement proper stock management
- Calculate totals accurately

## API Response Format

### Success Responses
- Return appropriate HTTP status codes (200, 201)
- Return data in consistent JSON format
- Include relevant data in response body

### Error Responses
- Return appropriate HTTP status codes (400, 401, 403, 404, 409, 500)
- Return error details in consistent format
- Include helpful error messages

## Output Requirements

Generate complete, working FastAPI code for:
- All database models (User, Product, Cart, Order, OrderItem)
- All API endpoints (auth, products, cart, orders)
- Authentication and JWT implementation
- Database configuration and setup
- Pydantic schemas for all models
- Error handling and custom exceptions
- Main application setup
- Dependencies file (requirements.txt)
- Environment variables example (.env.example)

Do not generate any frontend code, React components, or UI-related code. Generate only backend FastAPI code, database models, API endpoints, and related backend logic.

