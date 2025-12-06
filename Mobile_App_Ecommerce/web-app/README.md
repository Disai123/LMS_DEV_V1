# E-Commerce Web App

React.js 18 web application for the E-Commerce project.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Start Development Server

```bash
npm run dev
```

App will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Build files will be in `dist/` folder.

## 📁 Project Structure

```
web-app/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── contexts/        # React contexts
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Features

- Product browsing and search
- Shopping cart
- User authentication
- Order management
- Responsive design

