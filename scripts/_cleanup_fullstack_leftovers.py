"""Targeted leftover cleanup for Antigravity_Ecommerce_Fullstack HTML."""
from pathlib import Path

ROOT = Path(r"d:\lms_copy\LMS_Project\Realtime_projects\Antigravity_Ecommerce_Fullstack")
SKIP = {"Prompt_Library.html", "antigravity_prompts.md"}


def replace_in(path: Path, pairs: list[tuple[str, str]]) -> int:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in pairs:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return 1
    return 0


# --- Final_Steps ---
replace_in(ROOT / "Deployment Phase" / "Final_Steps.html", [
    ("            <div>• order history</div>", "            <div>• Order history</div>"),
    ("            <div>• simple checkout</div>", "            <div>• Simple checkout (no payment gateway)</div>"),
    ("            <div>• Receipt generation</div>", "            <div>• Order confirmation page</div>"),
    ("            <div>• User management</div>", "            <div>• Category management</div>"),
    ("            <div>• Analytics dashboard</div>", "            <div>• Update order status</div>"),
    ("            <div>• Payment security (PCI)</div>", "            <div>• FastAPI JWT authentication</div>"),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">checkout</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">FastAPI</div>'),
    ("Complete Antigravity prompt guide", "Day-by-day prompt document"),
    ("Your live app is on Render. To rebuild or extend E-Commerce Web Application, use the full day-by-day Antigravity prompts—not a separate source download.",
     "Your live app is on Render. Use the day-by-day prompts to rebuild ShopEasy with React, FastAPI, PostgreSQL, and Render."),
    ("Includes every day&apos;s copy-paste prompt from the workshop. Also available under Development → Prompt Library.",
     "Includes every day's copy-paste prompt. Also available under Development → Prompt Library."),
    ("You now have a complete, production-ready E-Commerce application with all the features needed to start selling\n        online.\n        Customize it further, add your products, and launch your business!",
     "You now have a working ShopEasy store: React frontend, FastAPI backend, PostgreSQL, and a live Render URL."),
])

# --- Deployment Planning ---
replace_in(ROOT / "Deployment Phase" / "Deployment_Planning.html", [
    ("        Comprehensive deployment strategy for E-commerce applications covering local development \n        setup and cloud deployment options for production environments.",
     "        Run React and FastAPI locally, then deploy both services and PostgreSQL on Render."),
    ("                <div><strong>Services:</strong> EC2, RDS, S3, CloudFront</div>",
     "                <div><strong>Services:</strong> Web Service (FastAPI), Static Site (React), PostgreSQL</div>"),
    ("                <div><strong>Benefits:</strong> Scalable, reliable, global reach</div>",
     "                <div><strong>Benefits:</strong> One host for frontend, backend, and database</div>"),
    ("                <div><strong>Cost:</strong> Pay-as-you-use, enterprise-grade</div>",
     "                <div><strong>Cost:</strong> Free tier for student projects</div>"),
    ("                <div><strong>Best For:</strong> Production, high-traffic applications</div>",
     "                <div><strong>Best For:</strong> The live ShopEasy demo</div>"),
    ("                <div><strong>Services:</strong> Compute Engine, Cloud SQL, Storage</div>",
     "                <div><strong>Services:</strong> Render dashboard, GitHub auto-deploy</div>"),
    ("                <div><strong>Benefits:</strong> AI/ML integration, global network</div>",
     "                <div><strong>Benefits:</strong> Connect DATABASE_URL and FRONTEND_URL</div>"),
    ("                <div><strong>Cost:</strong> Competitive pricing, free tier</div>",
     "                <div><strong>Cost:</strong> Free PostgreSQL instance for development</div>"),
    ("                <div><strong>Best For:</strong> Data-driven applications, analytics</div>",
     "                <div><strong>Best For:</strong> FastAPI + React student apps</div>"),
    ("""# Install Python 3 and create a virtual environment
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version""",
     """# Install Python 3 and create a virtual environment
python -m venv .venv
# Windows: .venv\\Scripts\\activate
source .venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-jose passlib

# React frontend uses npm only for the UI
# (install Node separately if you need the React build tools)"""),
    ("npm install  # React frontend only", "npm install   # React frontend dependencies"),
    ('JWT_SECRET="your-nextauth-secret"', 'JWT_SECRET="your-fastapi-jwt-secret"'),
    ('DATABASE_URL="sk_test_your_stripe_secret_key"', 'SECRET_KEY="your-app-secret"'),
    ('VITE_API_BASE_URL="pk_test_your_stripe_publishable_key"',
     'VITE_API_BASE_URL="http://localhost:8000"'),
    ("# Start the development server\nnpm run dev",
     "# Start FastAPI, then the React frontend\nuvicorn main:app --reload\nnpm run dev"),
    ("                <div><strong>EC2 Instance:</strong> t3.medium (2 vCPU, 4GB RAM)</div>",
     "                <div><strong>Web Service:</strong> FastAPI on Render</div>"),
    ("                <div><strong>RDS PostgreSQL:</strong> db.t3.micro for development</div>",
     "                <div><strong>PostgreSQL:</strong> Render managed database</div>"),
    ("                <div><strong>S3 Bucket:</strong> For file storage and static assets</div>",
     "                <div><strong>Static Site:</strong> Built React frontend</div>"),
    ("                <div><strong>CloudFront:</strong> CDN for global content delivery</div>",
     "                <div><strong>Env vars:</strong> DATABASE_URL, JWT_SECRET, FRONTEND_URL</div>"),
    ("                <div><strong>Compute Engine:</strong> e2-medium (2 vCPU, 4GB RAM)</div>",
     "                <div><strong>Backend service:</strong> uvicorn start command</div>"),
    ("                <div><strong>Cloud SQL:</strong> PostgreSQL instance</div>",
     "                <div><strong>Database:</strong> Render PostgreSQL</div>"),
    ("                <div><strong>Cloud Storage:</strong> For file storage and backups</div>",
     "                <div><strong>Frontend:</strong> React static build on Render</div>"),
    ("                <div><strong>Cloud CDN:</strong> Global content delivery</div>",
     "                <div><strong>Live URL:</strong> https://ecommerce-frontend-project.onrender.com</div>"),
])

# --- Environment Setup ---
replace_in(ROOT / "Deployment Phase" / "Environment_Setup.html", [
    ("                <li>• CDN integration</li>", "                <li>• HTTPS on Render</li>"),
    ("          <h5 style=\"font-weight: 500; color: #1f2937; margin-bottom: 0.5rem;\">External Services</h5>",
     "          <h5 style=\"font-weight: 500; color: #1f2937; margin-bottom: 0.5rem;\">Frontend and Auth</h5>"),
    ("            <div>PAYMENT_API_KEY=sk_live_...</div>",
     "            <div>FRONTEND_URL=https://ecommerce-frontend-project.onrender.com</div>"),
    ("            <div>EMAIL_SERVICE_URL=https://api.sendgrid.com</div>",
     "            <div>JWT_SECRET=your-fastapi-jwt-secret</div>"),
    ("            <div>CDN_URL=https://cdn.example.com</div>",
     "            <div>VITE_API_BASE_URL=https://your-fastapi-service.onrender.com</div>"),
])

# --- Backend leftover ---
replace_in(ROOT / "Development Phase" / "Backend_Development.html", [
    ('              <code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">/api/admin/dashboard</code> - Admin analytics',
     '              <code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">/api/admin/orders</code> - View and update orders'),
])

# --- Frontend ---
replace_in(ROOT / "Development Phase" / "Frontend_Development.html", [
    ("        Comprehensive frontend implementation using ReactJS, and modern web technologies \n        to create an intuitive and responsive e-commerce user interface.",
     "        React pages call FastAPI. Customers browse, search, manage the cart, check out, and view orders. Admins manage products, categories, and order status."),
    ('            <h5 style="font-weight: 600; color: #1f2937;">Pages Directory (<code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">app/</code>)</h5>',
     '            <h5 style="font-weight: 600; color: #1f2937;">Pages Directory (<code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">src/pages/</code>)</h5>'),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">page.tsx</code> - Homepage with hero section</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Home.jsx</code> - Homepage with product highlights</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">products/page.tsx</code> - Product catalog listing</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Products.jsx</code> - Product catalog and search</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">products/[id]/page.tsx</code> - Individual product details</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ProductDetails.jsx</code> - Product details</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">cart/page.tsx</code> - Shopping cart</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Cart.jsx</code> - Cart quantity and remove</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">checkout/page.tsx</code> - Checkout process</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Checkout.jsx</code> - Delivery details and place order</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">login/page.tsx</code> - User authentication</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Login.jsx</code> - Customer and admin login</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">register/page.tsx</code> - User registration</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Register.jsx</code> - Customer registration</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/page.tsx</code> - Admin dashboard</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Profile.jsx</code> - Customer profile</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/products/page.tsx</code> - Product management</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">Orders.jsx</code> - Order history</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/orders/page.tsx</code> - Order management</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">AdminProducts.jsx</code> - Product CRUD</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">about/page.tsx</code> - About page</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">AdminCategories.jsx</code> - Category CRUD</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">contact/page.tsx</code> - Contact page</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">AdminOrders.jsx</code> - View and update orders</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">layout/header.tsx</code> - Navigation header</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">layout/Header.jsx</code> - Navigation header</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">layout/footer.tsx</code> - Site footer</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">layout/Footer.jsx</code> - Site footer</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">providers/session-provider.tsx</code> - Auth provider</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">context/AuthContext.jsx</code> - JWT session</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/button.tsx</code> - Reusable buttons</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/Button.jsx</code> - Reusable buttons</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/card.tsx</code> - Product cards</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/ProductCard.jsx</code> - Product cards</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/input.tsx</code> - Form inputs</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/Input.jsx</code> - Form inputs</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/badge.tsx</code> - Status badges</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/Badge.jsx</code> - Order status badges</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/label.tsx</code> - Form labels</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">ui/Label.jsx</code> - Form labels</li>"),
    ("                <li>• Payment integration</li>",
     "                <li>• Place-order form (no payment gateway)</li>"),
    ('            <h5 style="font-weight: 600; color: #1f2937;">API Routes Directory (<code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">FastAPI routers /</code>)</h5>',
     '            <h5 style="font-weight: 600; color: #1f2937;">API Client (<code style="background: #ffffff; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">src/api/</code>)</h5>'),
    ("          <p style=\"font-size: 0.875rem; color: #4b5563; margin-bottom: 0.75rem;\">FastAPI routes on the Python backend</p>",
     "          <p style=\"font-size: 0.875rem; color: #4b5563; margin-bottom: 0.75rem;\">React calls FastAPI routers. Routes live on the Python backend, not in the frontend.</p>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">products/route.ts</code> - Product management</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">products.js</code> - GET /api/products</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">cart/route.ts</code> - Shopping cart API</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">cart.js</code> - Cart add, update, remove</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">orders/route.ts</code> - Order processing</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">orders.js</code> - Checkout and order history</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">auth/login/route.ts</code> - Authentication</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">auth.js</code> - Register, login, profile</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/products/route.ts</code> - Admin product management</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">adminProducts.js</code> - Admin product CRUD</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/orders/route.ts</code> - Admin order management</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">adminCategories.js</code> - Admin category CRUD</li>"),
    ("                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">admin/dashboard/route.ts</code> - Admin analytics</li>",
     "                <li>• <code style=\"background: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">adminOrders.js</code> - View orders and update status</li>"),
    ("            <p style=\"font-size: 0.875rem; color: #4b5563;\">Full-stack React framework with App Router, Server Components, and API routes</p>",
     "            <p style=\"font-size: 0.875rem; color: #4b5563;\">React SPA with React Router. Pages call FastAPI over HTTPS.</p>"),
    ('              <h5 style="font-weight: 500; color: #1f2937;">App Router</h5>',
     '              <h5 style="font-weight: 500; color: #1f2937;">React Router</h5>'),
    ("            <p style=\"font-size: 0.875rem; color: #4b5563;\">File-based routing with Server and Client Components</p>",
     "            <p style=\"font-size: 0.875rem; color: #4b5563;\">Client routes for shop, cart, checkout, orders, and admin pages</p>"),
    ("            <p style=\"font-size: 0.875rem; color: #4b5563;\">Type-safe database access and query builder</p>",
     "            <p style=\"font-size: 0.875rem; color: #4b5563;\">Used only on the FastAPI backend. The React app calls HTTP APIs.</p>"),
])

# --- Testing_QA ---
replace_in(ROOT / "Development Phase" / "Testing_QA.html", [
    ('          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Jest & React Testing Library</h5>',
     '          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">pytest and FastAPI TestClient</h5>'),
    ("              <li>• Jest configuration with ReactJS integration</li>",
     "              <li>• pytest for FastAPI route tests</li>"),
    ("              <li>• React Testing Library for component testing</li>",
     "              <li>• TestClient for register, login, cart, and checkout</li>"),
    ("              <li>• JSDOM environment for DOM testing</li>",
     "              <li>• Browser checks for React pages</li>"),
    ("              <li>• Path mapping for clean imports (@/)</li>",
     "              <li>• Isolated test database or transactions</li>"),
    ("              <li>• Setup files for global test configuration</li>",
     "              <li>• conftest.py fixtures for users and products</li>"),
    ('              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">jest.config.js</code> - Jest configuration</li>',
     '              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">pytest.ini</code> - pytest configuration</li>'),
    ('              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">jest.setup.js</code> - Test setup and mocks</li>',
     '              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">conftest.py</code> - Fixtures and test client</li>'),
    ('              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">tsconfig.json</code> - TypeScript configuration</li>',
     '              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">tests/</code> - API and order tests</li>'),
    ('              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">package.json</code> - Test scripts and dependencies</li>',
     '              <li>• <code style="background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">requirements.txt</code> - pytest and test extras</li>'),
    ("              <li>• Payment flow validation</li>",
     "              <li>• Checkout and place-order validation</li>"),
    ("              <li>• Checkout and payment process</li>",
     "              <li>• Checkout and place-order process</li>"),
    ('              <h6 style="font-weight: 600; color: #1f2937;">Payment Flow</h6>',
     '              <h6 style="font-weight: 600; color: #1f2937;">Checkout Flow</h6>'),
    ("              <li>• checkout and order placement testing</li>",
     "              <li>• Delivery details and place-order testing</li>"),
    ("              <li>• Payment method validation</li>",
     "              <li>• Empty cart and stock checks</li>"),
    ("              <li>• Receipt generation</li>",
     "              <li>• Confirmation and order history</li>"),
    ("              <li>• Dashboard analytics</li>",
     "              <li>• Category CRUD</li>"),
    ("              <li>• System configuration</li>",
     "              <li>• Update order status</li>"),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Jest</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">pytest</div>'),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Playwright</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Browser checks</div>'),
    ('          <div style="font-size: 0.75rem; color: #4b5563;">Cross-browser</div>',
     '          <div style="font-size: 0.75rem; color: #4b5563;">Manual UI paths</div>'),
])

# --- Development Conclusion ---
replace_in(ROOT / "Development Phase" / "Conclusion.html", [
    ("              <li>• React components with TypeScript</li>",
     "              <li>• React components with React Router</li>"),
    ("              <li>• Shopping cart with Zustand state management</li>",
     "              <li>• Shopping cart stored in PostgreSQL through FastAPI</li>"),
    ("              <li>• Checkout and payment integration</li>",
     "              <li>• Checkout and place-order pages</li>"),
    ("              <li>• simple checkout and order placement</li>",
     "              <li>• Simple checkout and order placement</li>"),
    ("              <li>• Jest and React Testing Library</li>",
     "              <li>• pytest and FastAPI TestClient</li>"),
    ("              <li>• Payment flow validation</li>",
     "              <li>• Checkout and order tests</li>"),
    ("          <p style=\"font-size: 0.875rem; color: #4b5563;\">Secure checkout with simple checkout and order management\n          </p>",
     "          <p style=\"font-size: 0.875rem; color: #4b5563;\">Simple checkout with delivery details and order history</p>"),
    ("          <p style=\"font-size: 0.875rem; color: #4b5563;\">Comprehensive admin panel for managing products, orders, and\n            users</p>",
     "          <p style=\"font-size: 0.875rem; color: #4b5563;\">Admin panel for products, categories, and order status</p>"),
])

# --- Database Implementation ---
replace_in(ROOT / "Development Phase" / "Database_Implementation.html", [
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">id</code> - Primary key (CUID)</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">id</code> - Primary key (integer)</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">createdAt, updatedAt</code> - Timestamps</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">created_at, updated_at</code> - Timestamps</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">orderNumber</code> - Unique order identifier</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">order_number</code> - Unique order identifier</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">userId</code> - Foreign key to users</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">user_id</code> - Foreign key to users</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">shippingAddress</code> - JSON address data</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">shipping_address</code> - Delivery address</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">productId</code> - Foreign key to products</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">product_id</code> - Foreign key to products</li>"),
    ("                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">UNIQUE(userId, productId)</code> - Composite unique</li>",
     "                <li>• <code style=\"background: #ffffff; padding: 0.125rem 0.25rem; border-radius: 0.25rem;\">UNIQUE(user_id, product_id)</code> - Composite unique</li>"),
    ("                <p style=\"font-size: 0.75rem; color: #4b5563;\">CUID-based unique identifiers for all tables</p>",
     "                <p style=\"font-size: 0.75rem; color: #4b5563;\">Integer primary keys for all tables</p>"),
    ("                <li>• String fields with CUID generation</li>",
     "                <li>• Integer IDs and string fields</li>"),
])

# --- Testing Overview ---
replace_in(ROOT / "Testing_phase" / "Overview_Content.html", [
    ("          <p style=\"font-size: 0.875rem; color: #4b5563;\">simple checkout, payment validation, order processing, and receipts</p>",
     "          <p style=\"font-size: 0.875rem; color: #4b5563;\">Simple checkout, place order, confirmation, and order history</p>"),
    ("          <p style=\"font-size: 0.875rem; color: #4b5563;\">Data protection, authentication security, and payment security</p>",
     "          <p style=\"font-size: 0.875rem; color: #4b5563;\">JWT auth, role checks, and input validation</p>"),
    ('              <h6 style="font-weight: 500; color: #1f2937; margin-bottom: 0.25rem;">Payment Flow Testing</h6>',
     '              <h6 style="font-weight: 500; color: #1f2937; margin-bottom: 0.25rem;">Checkout Flow Testing</h6>'),
    ("              <p style=\"font-size: 0.75rem; color: #4b5563;\">simple checkout, order placement, and error handling</p>",
     "              <p style=\"font-size: 0.75rem; color: #4b5563;\">Simple checkout, order placement, and error handling</p>"),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Jest</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">pytest</div>'),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Playwright</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Browser checks</div>'),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">K6</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Manual load checks</div>'),
    ('          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Payment Success</div>',
     '          <div style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">Order Success</div>'),
    ("          <div style=\"font-size: 0.75rem; color: #4b5563;\">Reliable transactions</div>",
     "          <div style=\"font-size: 0.75rem; color: #4b5563;\">Orders persist after checkout</div>"),
])

# --- Test Planning ---
replace_in(ROOT / "Testing_phase" / "Test_Planning.html", [
    ("                <li>• order history after checkout</li>",
     "                <li>• Order history after checkout</li>"),
    ("                <li>• simple checkout and order placement testing</li>",
     "                <li>• Simple checkout and place-order testing</li>"),
    ("                <li>• Payment method validation</li>",
     "                <li>• Delivery details validation</li>"),
    ("                <li>• Order confirmation and receipts</li>",
     "                <li>• Order confirmation page</li>"),
    ("                <li>• Refund and cancellation processing</li>",
     "                <li>• Empty cart and out-of-stock handling</li>"),
    ("                <li>• Payment security and fraud prevention</li>",
     "                <li>• JWT required before checkout</li>"),
    ("                <div><strong>Steps:</strong> Browse → Add to Cart → Checkout → Payment → Confirmation</div>",
     "                <div><strong>Steps:</strong> Browse → Add to Cart → Checkout → Place Order → Confirmation</div>"),
    ("                <div><strong>Expected:</strong> Order placed successfully, confirmation email sent</div>",
     "                <div><strong>Expected:</strong> Order placed and shown in order history</div>"),
    ("                <div><strong>Steps:</strong> Register → Verify Email → Login → Access Profile</div>",
     "                <div><strong>Steps:</strong> Register → Login → Access Profile</div>"),
    ('          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Payment & Security Tests</h5>',
     '          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Checkout & Security Tests</h5>'),
    ("                <div><strong>Steps:</strong> Add items → Checkout → Enter payment → Process</div>",
     "                <div><strong>Steps:</strong> Add items → Checkout → Enter delivery details → Place order</div>"),
    ("                <div><strong>Expected:</strong> Payment processed, order confirmed</div>",
     "                <div><strong>Expected:</strong> Order created and cart cleared</div>"),
])

# --- Unit Testing ---
replace_in(ROOT / "Testing_phase" / "Unit_Testing.html", [
    ("                <div><strong>Interactions:</strong> Add to cart, add to cart</div>",
     "                <div><strong>Interactions:</strong> Add to cart, open product details</div>"),
    ("                <div><strong>Interactions:</strong> Login, registration, password reset</div>",
     "                <div><strong>Interactions:</strong> Login, registration, profile</div>"),
    ("                Payment Form Component",
     "                Checkout Form Component"),
    ("                <div><strong>Tests:</strong> simple checkout, form validation</div>",
     "                <div><strong>Tests:</strong> Delivery fields and place-order button</div>"),
    ("                <div><strong>Interactions:</strong> Payment method selection, processing</div>",
     "                <div><strong>Interactions:</strong> Submit checkout, show confirmation</div>"),
    ("                <div><strong>Security:</strong> Sensitive data handling</div>",
     "                <div><strong>Security:</strong> JWT required; no card fields</div>"),
    ('          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Order & Payment APIs</h5>',
     '          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Cart & Order APIs</h5>'),
    ("                <div><strong>Edge Cases:</strong> Invalid cart, payment failures</div>",
     "                <div><strong>Edge Cases:</strong> Empty cart, out-of-stock items</div>"),
    ("    const mockAddToCart = jest.fn();",
     "    const mockAddToCart = vi.fn();  # or a simple mock function"),
    ('          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">API Route Testing</h5>',
     '          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">FastAPI Route Testing</h5>'),
])

# --- Integration ---
replace_in(ROOT / "Testing_phase" / "Integration_Testing.html", [
    ("                <div><strong>Flow:</strong> Browse → Add to Cart → Checkout → Payment → Order</div>",
     "                <div><strong>Flow:</strong> Browse → Add to Cart → Checkout → Place Order</div>"),
    ("            <div>• Payment processing flow</div>",
     "            <div>• Checkout and place-order flow</div>"),
    ("            <div>• CDN integration</div>",
     "            <div>• Render frontend talking to FastAPI</div>"),
    ("                <div><strong>Test:</strong> Cart → Order → Payment → Inventory update</div>",
     "                <div><strong>Test:</strong> Cart → Place order → Inventory update</div>"),
    ("                <div><strong>Rollback:</strong> Payment failure recovery</div>",
     "                <div><strong>Rollback:</strong> Failed checkout leaves cart unchanged</div>"),
])

# --- Performance ---
replace_in(ROOT / "Testing_phase" / "Performance_Testing.html", [
    ("                <div><strong>Activities:</strong> Payment processing, order creation</div>",
     "                <div><strong>Activities:</strong> Checkout and order creation</div>"),
    ('          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Payment & Order Performance</h5>',
     '          <h5 style="font-size: 1.125rem; font-weight: 500; color: #1f2937; margin-bottom: 1rem;">Checkout & Order Performance</h5>'),
    ("                <div><strong>Optimization:</strong> Payment optimization, retry logic</div>",
     "                <div><strong>Optimization:</strong> Fast order insert and stock update</div>"),
    ("            <div>• CDN implementation</div>",
     "            <div>• Static React assets on Render</div>"),
    ('              <span style="font-size: 0.875rem; font-weight: 500; color: #10b981;">✅ PCI Compliant</span>',
     '              <span style="font-size: 0.875rem; font-weight: 500; color: #10b981;">✅ No card data collected</span>'),
])

# --- Testing Conclusion ---
replace_in(ROOT / "Testing_phase" / "Conclusion.html", [
    ("                checkout → payment)</span>",
     "                checkout → place order)</span>"),
    ("              <span style=\"font-size: 0.875rem; color: #374151;\">simple checkout and order placement testing with 100% success\n                rate</span>",
     "              <span style=\"font-size: 0.875rem; color: #374151;\">Simple checkout and order placement checks</span>"),
    ("            <div>• order history</div>",
     "            <div>• Order history</div>"),
    ("            <div>• simple checkout</div>",
     "            <div>• Simple checkout</div>"),
    ("            <div>• Payment validation</div>",
     "            <div>• Place-order validation</div>"),
    ("            <div>• Receipt generation</div>",
     "            <div>• Confirmation page</div>"),
])

# --- UI ---
replace_in(ROOT / "UI_UX_phase" / "Navigation_Flow.html", [
    ('                <div style="font-weight: 700; color: #9f1239;">Payment</div>',
     '                <div style="font-weight: 700; color: #9f1239;">Place Order</div>'),
    ('                <div style="font-weight: 700; color: #047857;">Products Management</div>',
     '                <div style="font-weight: 700; color: #047857;">Products</div>'),
    ('                <div style="font-weight: 700; color: #6b21a8;">Orders Management</div>',
     '                <div style="font-weight: 700; color: #6b21a8;">Categories</div>'),
])

replace_in(ROOT / "UI_UX_phase" / "Customer_Pages.html", [
    ("                      <div style=\"background: #3b82f6; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.25rem; font-size: 0.75rem; margin-top: 0.5rem; text-align: center;\">[Continue to Payment]</div>",
     "                      <div style=\"background: #3b82f6; color: #ffffff; padding: 0.5rem 1rem; border-radius: 0.25rem; font-size: 0.75rem; margin-top: 0.5rem; text-align: center;\">[Place Order]</div>"),
])

replace_in(ROOT / "UI_UX_phase" / "Admin_Pages.html", [
    ("        Administrative interface designed for efficient management of products, orders, and system operations.",
     "        Admin screens for products, categories, customer orders, and order status."),
    ("[Admin Logo] [Dashboard] [Products] [Orders] [Logout]",
     "[Admin Logo] [Dashboard] [Products] [Categories] [Orders] [Logout]"),
])

# --- BRD NFR CDN ---
replace_in(ROOT / "BRD_phase" / "Non_Functional_Requirements.html", [
    ('                  <div style="font-weight: 500; color: #059669; margin-bottom: 0.25rem;">CDN Integration</div>',
     '                  <div style="font-weight: 500; color: #059669; margin-bottom: 0.25rem;">Static React Assets</div>'),
])

replace_in(ROOT / "BRD_phase" / "User_Stories.html", [
    ("        <!-- Epic 4: Business Analytics & Management -->",
     "        <!-- Epic 4: Admin Catalog & Orders -->"),
])

replace_in(ROOT / "BRD_phase" / "Functional_Requirements.html", [
    ("        <!-- Epic 4: Business Analytics & Management -->",
     "        <!-- Epic 4: Admin Catalog & Orders -->"),
])

print("Cleanup replacements applied.")
