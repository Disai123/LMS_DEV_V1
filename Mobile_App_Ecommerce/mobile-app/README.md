# E-Commerce Mobile App

React Native mobile application for the E-Commerce project.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```env
API_URL=http://localhost:5001/api
```

### 3. Start Development Server

```bash
# For Expo
npm start

# For iOS
npm run ios

# For Android
npm run android
```

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── screens/         # Screen components
│   ├── components/      # Reusable components
│   ├── navigation/      # Navigation setup
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   └── utils/           # Utility functions
├── assets/              # Static assets
├── android/             # Android native code
├── ios/                 # iOS native code
├── App.js               # Main app component
└── index.js             # Entry point
```

## 📝 Features

- Product browsing and search
- Shopping cart
- User authentication
- Order management
- Cross-platform (iOS & Android)

