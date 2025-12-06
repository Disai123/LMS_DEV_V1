# Database Schema Conversion Guide
## Prisma to Sequelize (PostgreSQL)

This document maps the Prisma schema from the E-commerce app to Sequelize models for the new backend.

---

## Schema Mapping Reference

### Prisma → Sequelize Type Mapping

| Prisma Type | Sequelize Type | PostgreSQL Type | Notes |
|-------------|----------------|-----------------|-------|
| String | DataTypes.STRING | VARCHAR | Default length 255 |
| String @unique | DataTypes.STRING + unique: true | VARCHAR + UNIQUE | |
| String @id @default(cuid()) | DataTypes.UUID + defaultValue: Sequelize.UUIDV4 | UUID | Or INTEGER with auto-increment |
| String? | DataTypes.STRING + allowNull: true | VARCHAR NULL | |
| Decimal | DataTypes.DECIMAL(10, 2) | DECIMAL(10, 2) | For money |
| Int | DataTypes.INTEGER | INTEGER | |
| Boolean | DataTypes.BOOLEAN | BOOLEAN | |
| DateTime @default(now()) | DataTypes.DATE + defaultValue: Sequelize.NOW | TIMESTAMP | |
| DateTime @updatedAt | DataTypes.DATE | TIMESTAMP | Handled by Sequelize hooks |
| Json | DataTypes.JSONB | JSONB | For PostgreSQL |
| Enum | DataTypes.ENUM(...) | ENUM | |

---

## Model Conversions

### 1. User Model

**Prisma Schema:**
```
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders    Order[]
  cartItems CartItem[]
  
  @@map("users")
}
```

**Sequelize Model Structure:**
- id: UUID (primary key, auto-generated)
- email: STRING (unique, not null)
- name: STRING (nullable)
- password: STRING (nullable - for OAuth users)
- role: ENUM('customer', 'admin') - DEFAULT 'customer' (add this for admin access)
- created_at: DATE (auto-generated)
- updated_at: DATE (auto-updated)

**Additional Fields to Consider:**
- phone: STRING (nullable) - for shipping
- address: JSONB (nullable) - for default shipping address
- is_active: BOOLEAN - DEFAULT true

---

### 2. Product Model

**Prisma Schema:**
```
model Product {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  image       String?
  stock       Int      @default(0)
  isActive    Boolean  @default(true)
  category    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems OrderItem[]
  cartItems  CartItem[]
  
  @@map("products")
}
```

**Sequelize Model Structure:**
- id: UUID (primary key, auto-generated)
- name: STRING (unique, not null)
- description: TEXT (nullable) - use TEXT instead of STRING for longer descriptions
- price: DECIMAL(10, 2) (not null)
- image: STRING (nullable) - store URL or file path
- stock: INTEGER (default: 0, not null)
- is_active: BOOLEAN (default: true, not null)
- category: STRING (nullable)
- created_at: DATE (auto-generated)
- updated_at: DATE (auto-updated)

**Additional Fields to Consider:**
- sku: STRING (unique, nullable) - product SKU
- images: ARRAY(STRING) or JSONB - for multiple images
- weight: DECIMAL - for shipping calculations
- dimensions: JSONB - length, width, height

---

### 3. Order Model

**Prisma Schema:**
```
model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique
  userId      String
  total       Decimal     @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING)
  shippingAddress Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
  
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Sequelize Model Structure:**
- id: UUID (primary key, auto-generated)
- order_number: STRING (unique, not null) - snake_case for Sequelize
- user_id: UUID (foreign key → users.id, onDelete: CASCADE)
- total: DECIMAL(10, 2) (not null)
- status: ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') (default: 'PENDING')
- shipping_address: JSONB (nullable)
- created_at: DATE (auto-generated)
- updated_at: DATE (auto-updated)

**Additional Fields to Consider:**
- payment_status: ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED')
- payment_method: STRING
- shipping_cost: DECIMAL(10, 2)
- tracking_number: STRING (nullable)
- estimated_delivery: DATE (nullable)

---

### 4. OrderItem Model

**Prisma Schema:**
```
model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("order_items")
}
```

**Sequelize Model Structure:**
- id: UUID (primary key, auto-generated)
- order_id: UUID (foreign key → orders.id, onDelete: CASCADE)
- product_id: UUID (foreign key → products.id, onDelete: CASCADE)
- quantity: INTEGER (not null)
- price: DECIMAL(10, 2) (not null) - snapshot price at time of order
- created_at: DATE (auto-generated)
- updated_at: DATE (auto-updated)

**Additional Fields to Consider:**
- product_name: STRING - snapshot of product name at time of order
- subtotal: DECIMAL(10, 2) - calculated: quantity * price

---

### 5. CartItem Model

**Prisma Schema:**
```
model CartItem {
  id        String @id @default(cuid())
  userId    String
  productId String
  quantity  Int
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@map("cart_items")
}
```

**Sequelize Model Structure:**
- id: UUID (primary key, auto-generated)
- user_id: UUID (foreign key → users.id, onDelete: CASCADE)
- product_id: UUID (foreign key → products.id, onDelete: CASCADE)
- quantity: INTEGER (not null, default: 1)
- created_at: DATE (auto-generated)
- updated_at: DATE (auto-updated)

**Unique Constraint:**
- Composite unique index on (user_id, product_id)

---

## Model Associations (Relations)

### Sequelize Associations Setup

**User Model Associations:**
- User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' })
- User.hasMany(CartItem, { foreignKey: 'user_id', onDelete: 'CASCADE' })

**Product Model Associations:**
- Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' })
- Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' })

**Order Model Associations:**
- Order.belongsTo(User, { foreignKey: 'user_id' })
- Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' })

**OrderItem Model Associations:**
- OrderItem.belongsTo(Order, { foreignKey: 'order_id' })
- OrderItem.belongsTo(Product, { foreignKey: 'product_id' })

**CartItem Model Associations:**
- CartItem.belongsTo(User, { foreignKey: 'user_id' })
- CartItem.belongsTo(Product, { foreignKey: 'product_id' })

---

## Migration Strategy

### Step 1: Create Database
- Create new PostgreSQL database (or schema) for e-commerce
- Database name: `ecommerce_db` or `aishani_ecommerce`

### Step 2: Create Migrations
Use Sequelize CLI to generate migrations:
```bash
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-products
npx sequelize-cli migration:generate --name create-orders
npx sequelize-cli migration:generate --name create-order-items
npx sequelize-cli migration:generate --name create-cart-items
```

### Step 3: Migration Order
Execute migrations in this order (respecting foreign key dependencies):
1. Users (no dependencies)
2. Products (no dependencies)
3. Orders (depends on Users)
4. OrderItems (depends on Orders and Products)
5. CartItems (depends on Users and Products)

### Step 4: Indexes
Add indexes for performance:
- users.email (already unique)
- products.name (already unique)
- orders.order_number (already unique)
- orders.user_id (for user order queries)
- orders.status (for filtering orders)
- order_items.order_id (for order details queries)
- cart_items.user_id (for user cart queries)
- cart_items(user_id, product_id) (unique constraint)

### Step 5: Data Migration (if needed)
If migrating from existing Prisma database:
1. Export data from Prisma database
2. Transform data format (Prisma → Sequelize)
3. Import data into Sequelize database
4. Verify data integrity

---

## Model File Structure

Each Sequelize model follows this pattern (matching your LMS backend):

```javascript
// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // ... other fields
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};
```

---

## Key Differences: Prisma vs Sequelize

| Aspect | Prisma | Sequelize |
|--------|--------|-----------|
| **Field Naming** | camelCase (createdAt) | snake_case (created_at) with underscored: true |
| **ID Generation** | cuid() (strings) | UUID or INTEGER auto-increment |
| **Relations** | @relation decorator | associate() method |
| **Queries** | Prisma Client methods | Sequelize query methods |
| **Migrations** | Prisma Migrate | Sequelize CLI migrations |
| **Types** | Generated TypeScript types | Manual type definitions |

---

## Notes

- Use snake_case for database column names (matching your LMS backend convention)
- Use camelCase for JavaScript object properties (Sequelize handles conversion)
- Add timestamps to all models (created_at, updated_at)
- Use UUID for IDs (matches Prisma) or INTEGER (if you prefer)
- Store JSON data (like shipping_address) as JSONB in PostgreSQL
- Use ENUM for status fields
- Add indexes on foreign keys and frequently queried columns

---

This schema conversion ensures compatibility between the Prisma-based Next.js app and the new Sequelize-based backend API.

