"""Rewrite Fullstack student HTML to match React + FastAPI + PostgreSQL + Render."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"d:\lms_copy\LMS_Project\Realtime_projects\Antigravity_Ecommerce_Fullstack")
SKIP_NAMES = {"Prompt_Library.html", "antigravity_prompts.md", "project.json"}
PROMPT_RE = re.compile(r'(<div class="antigravity-phase-prompt"[\s\S]*?</div>)')

GLOBAL = [
    ("ShopNova", "ShopEasy"),
    ("NextAuth.js", "FastAPI JWT"),
    ("NextAuth", "FastAPI JWT"),
    ("Prisma ORM", "SQLAlchemy"),
    ("Prisma client", "SQLAlchemy session"),
    ("Prisma Schema", "SQLAlchemy Models"),
    ("Prisma schema", "SQLAlchemy models"),
    ("Prisma CLI", "Alembic"),
    ("npx prisma generate", "alembic upgrade head"),
    ("npx prisma db push", "alembic upgrade head"),
    ("npx prisma db seed", "python seed.py"),
    ("prisma/schema.prisma", "models.py"),
    ("Prisma", "SQLAlchemy"),
    ("Next.js 14+ with App Router architecture", "ReactJS with React Router"),
    ("Next.js 14+ with App Router", "ReactJS with React Router"),
    ("Next.js 14+", "ReactJS"),
    ("Next.js API routes for serverless functions", "FastAPI routes for backend services"),
    ("Next.js API routes for backend functionality", "FastAPI routes on the Python backend"),
    ("Next.js API routes", "FastAPI routes"),
    ("Next.js API", "FastAPI"),
    ("Next.js App Router", "React Router"),
    ("Next.js Frontend & API Gateway", "ReactJS frontend"),
    ("Client sends request to Next.js API", "The React app sends a request to FastAPI"),
    ("using Next.js App Router", "using React Router"),
    ("React & Next.js", "ReactJS"),
    ("React.js, Next.js,", "ReactJS,"),
    ("Full-Stack Framework", "Python web framework"),
    ("Next.js", "ReactJS"),
    ("Stripe payment integration testing", "simple checkout and order placement testing"),
    ("Stripe payment integration", "simple checkout"),
    ("Stripe integration testing", "checkout and order placement testing"),
    ("Stripe integration for payments", "simple checkout and order placement"),
    ("Stripe Integration", "Simple Checkout"),
    ("Stripe integration", "simple checkout"),
    ("Stripe payment processing under load", "checkout and order placement under load"),
    ("Stripe payment processing", "order placement"),
    ("PCI DSS compliance via Stripe", "No card data is stored; checkout stays in-app"),
    ("Tokenized payment processing", "In-app order placement without a payment gateway"),
    ("Payment processing with Stripe", "Simple checkout and place-order flow"),
    ("Secure checkout with Stripe integration and order management", "Simple checkout, place order, and order history"),
    ("lib/stripe.ts", "routers/checkout.py"),
    ("Stripe webhook handling", "order creation and stock update"),
    ("Stripe webhook", "order confirmation"),
    ("Stripe", "checkout"),
    ("Cypress for E2E testing", "browser checks for end-to-end flows"),
    ("Cypress for user journey testing", "manual browser checks for user journeys"),
    ("Cypress & Playwright", "pytest and browser checks"),
    ("Jest & Cypress", "pytest"),
    ("Cypress", "browser checks"),
    ("Wishlist and favorites management", "order history after checkout"),
    ("Wishlist functionality", "order history"),
    ("wishlist toggle", "add to cart"),
    ("Wishlist (User-Product Favorites)", "Cart (saved items before checkout)"),
    ("Wishlist", "Cart"),
    ("Redis-based rate limiting", "in-app request limits on FastAPI"),
    ("Redis for session data", "JWT tokens stored by the React app"),
    ("Redis caching layer", "PostgreSQL indexes for product search"),
    ("Multi-layer caching with Redis and browser", "PostgreSQL indexes and browser cache for product pages"),
    ("Redis integration", "PostgreSQL query indexes"),
    ("Redis", "PostgreSQL"),
    ("AWS/GCP", "Render"),
    ("AWS Deployment", "Render Deployment"),
    ("AWS Services Setup", "Render Services Setup"),
    ("GCP Services Setup", "Render Database Setup"),
    ("Google Cloud Platform", "Render Hosting"),
    ("Deployed on Vercel with external service integrations", "Deployed on Render with FastAPI and PostgreSQL"),
    ("Global content delivery via Vercel CDN", "Static React build served from Render"),
    ("Vercel CDN", "Render static hosting"),
    ("Vercel", "Render"),
    ("Neon", "Render PostgreSQL"),
    ("Node.js API server and business logic implementation", "FastAPI backend and business logic"),
    ("Node.js, PostgreSQL, Git", "Python, PostgreSQL, Git, and a React build toolchain"),
    ("Node.js & npm Installation", "Python and React tooling"),
    ("# Install Node.js (LTS version)", "# Install Python 3 and create a virtual environment"),
    ("npm install -g prisma", "pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic"),
    ("npm install", "npm install  # React frontend only"),
    ("NEXTAUTH_SECRET", "JWT_SECRET"),
    ("NEXTAUTH_URL", "FRONTEND_URL"),
    ("STRIPE_SECRET_KEY", "DATABASE_URL"),
    ("STRIPE_PUBLISHABLE_KEY", "VITE_API_BASE_URL"),
    ("app/api/", "FastAPI routers /"),
    ("auth/[...nextauth]", "auth/login"),
    ("[...nextauth]", "login"),
    ("Jest configuration with Next.js integration", "pytest configuration for FastAPI tests"),
    ("Playwright for cross-browser testing", "manual browser checks on Chrome and Edge"),
    ("Payment Integration", "Simple Checkout"),
    ("Payment Processing", "Order Placement"),
    ("payment processing", "order placement"),
    ("Payment Security", "Checkout Safety"),
    ("the the e-commerce", "the e-commerce"),
]


def apply_replacements(text: str, pairs: list[tuple[str, str]]) -> str:
    parts = PROMPT_RE.split(text)
    out = []
    for part in parts:
        if part.startswith('<div class="antigravity-phase-prompt"'):
            out.append(part)
            continue
        for old, new in pairs:
            part = part.replace(old, new)
        out.append(part)
    return "".join(out)


def walk_html(root: Path):
    for path in root.rglob("*.html"):
        if path.name in SKIP_NAMES:
            continue
        if "shared" in path.parts or "skills" in path.parts:
            continue
        yield path


def main():
    changed = []
    for path in walk_html(ROOT):
        original = path.read_text(encoding="utf-8")
        updated = apply_replacements(original, GLOBAL)
        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append(str(path.relative_to(ROOT)))
    print("Updated", len(changed), "files")
    for name in changed:
        print(name)


if __name__ == "__main__":
    main()
