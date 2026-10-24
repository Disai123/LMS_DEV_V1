# UI/UX Wireframes Document - E-commerce Web Application

## 1. Overview
This document outlines the visual structure and user interaction flow for the E-commerce Web Application. The design focuses on a clean, intuitive interface for Customers to shop seamlessly and for Administrators to manage the business efficiently.

**Target platforms:** Desktop and Mobile (Responsive Web).

---

## 2. User Flows

### 2.1 Customer Purchase Flow
1.  **Landing**: User arrives at **Home Page**.
2.  **Discovery**: User searches or clicks a category -> Views **Product List**.
3.  **Selection**: User clicks a product -> Views **Product Details** -> Clicks "Add to Cart".
4.  **Review**: User navigates to **Shopping Cart** to review items.
5.  **Checkout**: User clicks "Checkout" -> Enters Shipping & Payment info -> Confirms Order.
6.  **Confirmation**: User sees **Order Success** screen with tracking number.

### 2.2 Admin Management Flow
1.  **Access**: Admin logs in via **Admin Login**.
2.  **Overview**: Admin lands on **Dashboard** (sees sales stats).
3.  **Operation (Products)**: Navigates to **Product Management** -> Adds/Edits items.
4.  **Operation (Orders)**: Navigates to **Order Management** -> Updates status of new orders.

---

## 3. Screen List

**Customer Interface:**
1.  Home Page
2.  Product Listing Page (Search Results)
3.  Product Details Page
4.  Shopping Cart Page
5.  Checkout Page
6.  Order Confirmation Page
7.  User Account (Login/Register)
8.  Order History / Tracking Page

**Admin Interface:**
1.  Admin Login
2.  Admin Dashboard
3.  Product Management (List & Edit)
4.  Order Management (List & Details)

---

## 4. Wireframe Descriptions

### A. Customer Screens

#### 1. Home Page
*   **Purpose**: Welcome users and highlight featured products/categories.
*   **Layout/Sections**:
    *   **Header**: Logo, Search Bar, "Cart" icon (with count), "Login" button.
    *   **Hero Section**: Large promotional banner (slider).
    *   **Categories**: Grid of main categories (Electronics, Fashion, etc.).
    *   **Featured Products**: Horizontal scroll or grid of top-selling items.
    *   **Footer**: Quick links, Social media, Contact info.
*   **Interactions**:
    *   Clicking a Category -> Navigates to Product Listing.
    *   Using Search -> Navigates to Product Listing with results.

#### 2. Product Listing Page
*   **Purpose**: Display lists of products based on category or search.
*   **Layout/Sections**:
    *   **Sidebar (Desktop) / Filter Button (Mobile)**: Filters for Price Range, Category.
    *   **Product Grid**: Thumbnail image, Name, Price, "Add to Cart" button.
    *   **Pagination/Load More**: At the bottom.
*   **Interactions**:
    *   Click Product Card -> Open Product Details.
    *   "Add to Cart" -> Updates Cart counter immediately.

#### 3. Product Details Page
*   **Purpose**: Provide full details to convince user to buy.
*   **Layout/Sections**:
    *   **Left**: Large Main Image + Thumbnail carousel.
    *   **Right**: Product Title, Price, Description, Rating (Stars), Quantity Selector.
    *   **Action Area**: Big "Add to Cart" button.
    *   **Bottom**: Reviews section.
*   **Interactions**:
    *   Quantity +/- -> Adjusts number.
    *   Add to Cart -> Triggers success toast/popup.

#### 4. Shopping Cart Page
*   **Purpose**: Review items before payment.
*   **Layout/Sections**:
    *   **List**: Item Image, Name, Price, Quantity Input, Remove (Trash Icon).
    *   **Summary Box**: Subtotal, Tax, Shipping, **Total Price**.
    *   **CTA**: "Proceed to Checkout" button.
*   **Interactions**:
    *   Change Quantity -> Auto-updates Total.
    *   Remove Item -> Removes row and updates Total.

#### 5. Checkout Page
*   **Purpose**: Collect shipping and payment info.
*   **Layout/Sections**:
    *   **Step 1**: Shipping Address Form.
    *   **Step 2**: Payment Method Toggle (Credit Card / PayPal / COD).
    *   **Order Summary**: Brief list of items + Final Total.
    *   **CTA**: "Place Order" button.
*   **Interactions**:
    *   "Place Order" -> Validates forms -> Redirects to Confirmation.

#### 6. User Account (Order History)
*   **Purpose**: View past activity and track orders.
*   **Layout/Sections**:
    *   **Tabs**: Profile / My Orders.
    *   **Order List**: Date, Order ID, Total, Status (e.g., "Shipped"), "View" button.
*   **Interactions**:
    *   Click Order -> Shows full details of items in that order.

---

### B. Admin Screens

#### 1. Admin Dashboard
*   **Purpose**: High-level view of business health.
*   **Layout/Sections**:
    *   **Sidebar**: Navigation (Dashboard, Products, Orders, Users).
    *   **Metric Cards**: Total Sales, Total Orders, Pending Orders.
    *   **Recent Activity Table**: Quick view of last 5 orders.
*   **Interactions**:
    *   Click "Pending Orders" card -> Navigates to Order List filtered by pending.

#### 2. Product Management (List & Edit)
*   **Purpose**: Manage inventory.
*   **Layout/Sections**:
    *   **Top**: "Add New Product" button.
    *   **Table**: Image, Name, Stock count, Price, Actions (Edit/Delete).
*   **Interactions**:
    *   "Edit" -> Opens form with existing data to update stock/price.
    *   "Add New" -> Opens blank form to create specific product.

#### 3. Order Management
*   **Purpose**: Process customer orders.
*   **Layout/Sections**:
    *   **Table**: Order ID, Customer Name, Date, Status, Total.
    *   **Detail View (Modal/Page)**: List of items purchased, Shipping Address, Status Dropdown.
*   **Interactions**:
    *   Change Status Dropdown (Processing -> Shipped) -> Updates system and notifies user.
