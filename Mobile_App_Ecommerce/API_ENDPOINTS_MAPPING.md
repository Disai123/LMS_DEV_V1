# API Endpoints Mapping
## Next.js API Routes → Express Backend API

This document maps all existing Next.js API routes to the new Express backend API endpoints.

---

## Endpoint Structure

**Base URL:** `http://localhost:5001/api` (or your backend URL)

All endpoints return JSON responses in format:
```json
{
  "success": true/false,
  "data": { ... },
  "error": "error message",
  "message": "optional message"
}
```

---

## Authentication Endpoints

### Register User

**Next.js:** `POST /api/auth/register`  
**Backend:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id", "email", "name" },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

### Login

**Next.js:** `POST /api/auth/login` (via NextAuth)  
**Backend:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id", "email", "name", "role" },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

### Get Current User

**Next.js:** Via NextAuth session  
**Backend:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

### Refresh Token

**Next.js:** N/A  
**Backend:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_access_token"
  }
}
```

---

### Logout

**Next.js:** Via NextAuth  
**Backend:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### Get All Products

**Next.js:** `GET /api/products`  
**Backend:** `GET /api/products`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (optional)
- `search` (optional)
- `featured` (optional: true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": "99.99",
      "image": "image_url",
      "stock": 10,
      "isActive": true,
      "category": "Electronics",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### Get Single Product

**Next.js:** `GET /api/products/[id]`  
**Backend:** `GET /api/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": "99.99",
    "image": "image_url",
    "stock": 10,
    "isActive": true,
    "category": "Electronics",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Create Product (Admin Only)

**Next.js:** `POST /api/admin/products`  
**Backend:** `POST /api/products`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "image": "image_url",
  "stock": 10,
  "category": "Electronics"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* product object */ }
}
```

---

### Update Product (Admin Only)

**Next.js:** `PUT /api/admin/products/[id]`  
**Backend:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 5
}
```

---

### Delete Product (Admin Only)

**Next.js:** `DELETE /api/admin/products/[id]`  
**Backend:** `DELETE /api/products/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### Get User Cart

**Next.js:** `GET /api/cart`  
**Backend:** `GET /api/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cart_item_id",
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "price": "99.99",
        "image": "image_url"
      },
      "quantity": 2
    }
  ]
}
```

---

### Add Item to Cart

**Next.js:** `POST /api/cart`  
**Backend:** `POST /api/cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_item_id",
    "product": { /* product object */ },
    "quantity": 2
  }
}
```

---

### Update Cart Item Quantity

**Next.js:** `PUT /api/cart/[id]`  
**Backend:** `PUT /api/cart/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### Remove Item from Cart

**Next.js:** `DELETE /api/cart/[id]`  
**Backend:** `DELETE /api/cart/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## Order Endpoints

### Get User Orders

**Next.js:** `GET /api/orders`  
**Backend:** `GET /api/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_id",
      "orderNumber": "ORD-12345",
      "total": "199.98",
      "status": "PENDING",
      "shippingAddress": { /* address object */ },
      "orderItems": [
        {
          "id": "order_item_id",
          "product": { /* product object */ },
          "quantity": 2,
          "price": "99.99"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Single Order

**Next.js:** `GET /api/orders/[id]`  
**Backend:** `GET /api/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderNumber": "ORD-12345",
    "total": "199.98",
    "status": "PENDING",
    "shippingAddress": { /* address object */ },
    "orderItems": [ /* array of order items */ ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Create Order

**Next.js:** `POST /api/orders`  
**Backend:** `POST /api/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "id": "product_id",
      "quantity": 2,
      "price": "99.99"
    }
  ],
  "shippingInfo": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "City",
    "state": "State",
    "zip": "12345",
    "country": "Country",
    "phone": "123-456-7890"
  },
  "total": "199.98"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderNumber": "ORD-12345",
    "total": "199.98",
    "status": "PENDING",
    "orderItems": [ /* array of order items */ ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Admin Endpoints

### Get Admin Dashboard Stats

**Next.js:** `GET /api/admin/dashboard`  
**Backend:** `GET /api/admin/dashboard`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": "10000.00",
    "totalOrders": 150,
    "totalProducts": 50,
    "totalUsers": 200,
    "recentOrders": [ /* array of recent orders */ ]
  }
}
```

---

### Get All Orders (Admin)

**Next.js:** `GET /api/admin/orders`  
**Backend:** `GET /api/admin/orders`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: filter by status)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of orders */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

### Update Order Status (Admin)

**Next.js:** `PUT /api/admin/orders/[id]`  
**Backend:** `PUT /api/admin/orders/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRACK123" // optional
}
```

---

### Get All Products (Admin)

**Next.js:** `GET /api/admin/products`  
**Backend:** `GET /api/admin/products`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (optional)
- `category` (optional)
- `isActive` (optional: true/false)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of products */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_access_token>
```

**Token Expiration:**
- Access token: 15 minutes - 1 hour
- Refresh token: 7-30 days

**Token Refresh Flow:**
1. When access token expires, client receives 401
2. Client calls `POST /api/auth/refresh` with refresh token
3. Backend returns new access token
4. Client updates stored access token and retries original request

---

## Notes

- All timestamps are in ISO 8601 format
- All prices are strings (to avoid floating point precision issues) or use Decimal type
- Pagination uses page/limit query parameters
- Search and filtering use query parameters
- Admin endpoints require `role: 'admin'` in JWT token
- Cart is automatically cleared after order creation
- Product prices in order items are snapshots (stored at time of order)

