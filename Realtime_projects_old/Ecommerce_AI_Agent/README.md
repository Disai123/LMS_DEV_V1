# Ecommerce AI Agent (askunicart) - HTML Documentation

This folder contains the complete askunicart AI agent project documentation recreated as static HTML pages.

## 📁 Project Structure

```
Ecommerce_AI_Agent/
├── index.html                    # Landing page (start here!)
├── BRD_phase/                    # Business Requirements Document phase
│   ├── Overview.html
│   └── [Content files...]
├── UI_UX_phase/                  # UI/UX Design phase
├── Architectural_Design_phase/  # System Architecture phase
├── Development Phase/            # Code Development phase
├── Testing_phase/                # Testing & QA phase
├── Deployment Phase/             # Deployment phase
└── shared/                       # Shared assets
    ├── styles.css               # All styles
    └── navigation.js            # Navigation script
```

## 🚀 How to View the Pages

### Method 1: Direct File Opening (Limited Functionality)
Simply double-click on `index.html` or any `Overview.html` file to open in your browser. 
⚠️ Note: Some JavaScript features may not work due to browser security restrictions (CORS).

### Method 2: Using a Local Server (Recommended)

#### Option A: Python HTTP Server (Easiest)

**Windows:**
1. Open PowerShell/Command Prompt and run:
   ```bash
   cd Realtime_projects\Ecommerce_AI_Agent
   python -m http.server 8000
   ```

**Mac/Linux:**
1. Open Terminal and run:
   ```bash
   cd Realtime_projects/Ecommerce_AI_Agent
   python3 -m http.server 8000
   ```

Then open your browser and go to: **http://localhost:8000**

#### Option B: Node.js HTTP Server

1. Install http-server (one time):
   ```bash
   npm install -g http-server
   ```

2. Navigate to the folder and run:
   ```bash
   cd Realtime_projects/Ecommerce_AI_Agent
   http-server -p 8000
   ```

Then open: **http://localhost:8000**

#### Option C: VS Code Live Server

If you use VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📖 Navigation

- **Start Here**: Open `index.html` to see all phases
- **Phase Pages**: Click on any phase card to navigate to that phase
- **Subphase Navigation**: Use the left sidebar to navigate between subphases within a phase
- **Phase Bar**: Use the top navigation bar to switch between phases

## ✨ Features

- ✅ Fully responsive design
- ✅ Dynamic content loading
- ✅ Sidebar navigation
- ✅ Phase progress tracking
- ✅ Replica of original React pages
- ✅ All content extracted from askunicart AI agent source code

## 🤖 About askunicart AI Agent

The askunicart AI agent is an intelligent e-commerce shopping assistant that helps users:
- **Cart Management**: Add, update, and manage shopping cart items
- **Product Discovery**: Search and browse products with natural language
- **Inventory Checking**: Check real-time stock availability
- **Recommendations**: Get personalized product recommendations
- **Natural Conversations**: Interact using natural language queries

## 🔧 Troubleshooting

**Problem**: Content doesn't load / JavaScript errors
- **Solution**: Use a local server (Method 2) instead of opening files directly

**Problem**: Styles don't appear
- **Solution**: Make sure you're viewing through a local server, not file:// protocol

**Problem**: Images/logos don't show
- **Solution**: The logo path expects `/lms_logo.svg` - you may need to add the logo file or update the path

## 📝 Notes

- All pages are static HTML with inline styles
- Navigation between subphases uses JavaScript (requires a web server)
- Content files are loaded dynamically via fetch API
- Compatible with all modern browsers
- Documentation focuses specifically on the askunicart AI agent implementation

## 🎯 Project Phases

1. **BRD Phase**: Business requirements and functional specifications for the AI agent
2. **UI/UX Phase**: Chat interface design and user experience flows
3. **Architectural Design Phase**: System architecture, database design, and AI integration
4. **Development Phase**: Implementation of tool modules, backend, frontend, and AI integration
5. **Testing Phase**: Unit testing, integration testing, chat interface testing, and performance testing
6. **Deployment Phase**: Deployment planning, environment setup, database migration, and final steps

---

**Happy Browsing! 🎉**

