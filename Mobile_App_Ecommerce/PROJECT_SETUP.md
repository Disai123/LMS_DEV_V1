# Project Setup Guide

## 🎯 Project Overview

This is a **complete, standalone E-Commerce application** with:
- Backend API (Node.js + Express + Sequelize + PostgreSQL)
- Mobile App (React Native)
- Web App (Next.js or React)

**All components are self-contained in the `Mobile_App_Ecommerce` folder.**

---

## 📁 Folder Structure to Create

```
Mobile_App_Ecommerce/
│
├── backend/                    # Backend API Server
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   ├── config/
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── utils/
│
├── mobile-app/                 # React Native Mobile App
│   ├── package.json
│   ├── app.json
│   ├── .env
│   ├── src/
│   ├── android/
│   ├── ios/
│   └── assets/
│
├── web-app/                    # Web Frontend
│   ├── package.json
│   ├── .env
│   ├── src/ (or app/)
│   └── public/
│
└── docs/                       # Documentation (already here)
    ├── MASTER_PLAN.md
    ├── DATABASE_SCHEMA_CONVERSION.md
    ├── API_ENDPOINTS_MAPPING.md
    └── IMPLEMENTATION_CHECKLIST.md
```

---

## 🚀 Quick Start

### Step 1: Create Folders

```bash
cd Mobile_App_Ecommerce

# Create backend folder
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Go back to Mobile_App_Ecommerce
cd ..

# Create mobile-app folder
mkdir mobile-app
cd mobile-app

# Initialize React Native project (choose one):
# Option A: Expo (easier)
npx create-expo-app . --template

# Option B: React Native CLI (more control)
npx react-native init MobileApp

# Go back to Mobile_App_Ecommerce
cd ..

# Create web-app folder
mkdir web-app
cd web-app

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app

# Or React with Vite
npm create vite@latest . -- --template react
```

### Step 2: Set Up Backend

Follow Phase 1 in `MASTER_PLAN.md`:
1. Install dependencies (Express, Sequelize, PostgreSQL, etc.)
2. Set up database configuration
3. Create models
4. Create migrations
5. Set up routes and controllers

### Step 3: Set Up Mobile App

Follow Phase 3 in `MASTER_PLAN.md`:
1. Install navigation, state management, API client
2. Set up API services
3. Build screens
4. Connect to backend

### Step 4: Set Up Web App

Follow Phase 4 in `MASTER_PLAN.md`:
1. Set up API client
2. Build pages
3. Connect to backend

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8081

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

### Mobile App (.env)
```env
API_URL=http://localhost:5001/api
```

### Web App (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 📦 Backend Dependencies

Install in `backend/` folder:
```bash
npm install express sequelize pg pg-hstore cors helmet morgan compression express-rate-limit
npm install jsonwebtoken bcryptjs dotenv winston joi multer
npm install --save-dev nodemon sequelize-cli
```

---

## 📦 Mobile App Dependencies

Install in `mobile-app/` folder:
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios zustand @react-native-async-storage/async-storage
npm install react-native-elements react-native-vector-icons
npm install react-hook-form
```

---

## 📦 Web App Dependencies

Install in `web-app/` folder (if using Next.js):
```bash
npm install axios zustand
```

Or if using React + Vite:
```bash
npm install axios zustand react-router-dom
```

---

## 🗄️ Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create Database:**
```sql
CREATE DATABASE ecommerce_db;
```

3. **Run Migrations:**
```bash
cd backend
npx sequelize-cli db:migrate
```

4. **Seed Database:**
```bash
npx sequelize-cli db:seed:all
```

---

## ▶️ Running the Projects

### Backend (Port 5001)
```bash
cd backend
npm run dev
```

### Mobile App
```bash
cd mobile-app
# For Expo
npm start

# For React Native CLI
npm run android  # or npm run ios
```

### Web App (Port 3000)
```bash
cd web-app
npm run dev
```

---

## 🔗 API Endpoints

Once backend is running, all API endpoints will be available at:
- **Base URL:** `http://localhost:5001/api`

See `API_ENDPOINTS_MAPPING.md` for complete endpoint documentation.

---

## 📝 Next Steps

1. ✅ Read `MASTER_PLAN.md` for complete implementation plan
2. ✅ Follow `IMPLEMENTATION_CHECKLIST.md` to track progress
3. ✅ Refer to `DATABASE_SCHEMA_CONVERSION.md` when creating models
4. ✅ Use `API_ENDPOINTS_MAPPING.md` as reference for endpoints

---

## ⚠️ Important Notes

- **This is a standalone project** - completely separate from any LMS project
- **All code in this folder** - backend, mobile, and web
- **Separate database** - dedicated PostgreSQL database
- **Reference only** - uses existing `Ecommerce` folder only for understanding features

---

**Ready to start coding? Begin with Phase 1: Backend Development!** 🚀

