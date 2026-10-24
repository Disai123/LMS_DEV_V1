# Antigravity prompt guide

Source: Antigravity_Ecommerce_24_Day_Task_Wise_Prompts_Final_v2.docx


## Day 1 — SDLC & Basic Web Application Concepts

DAY 1 — SDLC & Basic Web Application Concepts
SDLC Phase: Initiation & Learning
Learning / Prerequisite
Prompt
Teach me the minimum concepts I need before starting this e-commerce project.Explain in simple language:- What SDLC means- What Requirements, Design, Development, Testing, Integration and Deployment mean- What a frontend is- What a backend is- What an API is- What a database is- How ReactJS, FastAPI and PostgreSQL work together- What a Customer flow and Admin flow mean- Why we work one task at a time and test after each taskAlso check that Python, PostgreSQL, a code editor and Git are available.If something is missing, tell me the simplest setup steps.Do not build any feature today.
Checkpoint: I can explain the basic SDLC and the ReactJS → FastAPI → PostgreSQL flow in simple words, and the required tools are ready.

---

## Day 2 — Business Requirements

DAY 2 — Business Requirements
SDLC Phase: Requirements
Prompt
Create BRD.md for this e-commerce application.Customer features:- Register- Login- Browse products- Search products- View product details- Add product to cart- Change quantity- Remove product- Checkout- Place order- View order historyAdmin features:- Login- Add, edit and delete products- Add, edit and delete categories- View customer orders- Update order statusAlso include:- Project goal- Users- Main customer and admin journeys- In scope- Out of scope- Simple success criteriaKeep it simple. Do not add extra features.
Checkpoint: BRD.md is created and clearly describes the project scope and main user journeys.

---

## Day 3 — UI/UX Screens & User Flows

DAY 3 — UI/UX Screens & User Flows
SDLC Phase: Design
Prompt
Create UI_UX.md for the e-commerce application.Customer screens:- Home- Product Listing- Product Details- Cart- Checkout- Order Confirmation- Order History- Login- Register- ProfileAdmin screens:- Admin Dashboard- Product Management- Category Management- Order Management- LoginFor each screen, describe simply:- What the user sees- What the user can do- Where the user goes nextKeep the design clean, simple and easy for a fresher to build. Do not create another design document.
Checkpoint: UI_UX.md covers all required screens and the basic customer/admin navigation.

---

## Day 4 — Application Architecture

DAY 4 — Application Architecture
SDLC Phase: Design
Prompt
Create ARCHITECTURE.md for the application.Use exactly this technology flow:ReactJS Frontend        ↓FastAPI Backend        ↓PostgreSQL DatabaseShow in simple form:- Customer flow- Admin flow- Where authentication is handled- Where product logic is handled- Where cart logic is handled- Where checkout/order logic is handled- Where database access happensAlso list the main API areas needed for:- Register and Login- Profile- Products- Categories- Cart- Checkout- Orders- Admin product/category actions- Admin order statusDo not use Node.js/Express. Keep the architecture simple.
Checkpoint: ARCHITECTURE.md matches the ReactJS + FastAPI + PostgreSQL structure and the required features.

---

## Day 5 — Database & FastAPI Backend Learning

DAY 5 — Database & FastAPI Backend Learning
SDLC Phase: Learning / Backend Preparation
Prompt
Teach me the minimum concepts I need for Week 2 backend work.Explain simply:- What a table, row and column are- What a primary key is- What a foreign key is- How tables are related- What CRUD means- What an API endpoint is- What GET, POST, PUT/PATCH and DELETE mean- How FastAPI receives a request and returns a response- How FastAPI talks to PostgreSQL- What a request body and response meanUse simple examples from our e-commerce tables and features.Do not build new features today.
Checkpoint: I can explain the basic database relationships and how a FastAPI API communicates with PostgreSQL.
---------------------------------------------------------------------------------------------------------------------------------------------------
WEEK 2 — DATABASE & FASTAPI BACKEND
Week 2 Prerequisite: Week 1 must be complete, and PostgreSQL plus the Week 1 database structure must be working. Day 7 is the Week 2 learning day for database and FastAPI concepts. Backend remains FastAPI with Python.

---

## Day 6 — PostgreSQL Database Setup

DAY 6 — PostgreSQL Database Setup
SDLC Phase: Development — Database
Prompt
Set up the PostgreSQL database for the e-commerce application.Create only these tables:- users- categories- products- cart- cart_items- orders- order_itemsMake the relationships correct and simple.Then:- connect FastAPI to PostgreSQL- confirm the connection works- add a simple health check- add a small amount of sample category and product dataDo not create unnecessary tables or fields.
Checkpoint: PostgreSQL is connected, all required tables exist, sample data is available and the FastAPI health check works.

---

## Day 7 — FastAPI Project Structure & Authentication APIs

DAY 7 — FastAPI Project Structure & Authentication APIs
SDLC Phase: Development
Prompt
Prepare the FastAPI backend for feature development and build authentication.Create or update CODING.md with only the simple coding structure we actually use.Then build:- Customer registration- Customer login- Customer logout- Customer profile- Admin loginUse the existing users table and keep the implementation simple.After building, test:Register → Login → Profile → Logoutand verify that an admin can log in.
Checkpoint: FastAPI starts correctly, CODING.md matches the real project, and customer/admin login flows work.

---

## Day 8 — Product & Category APIs

DAY 8 — Product & Category APIs
SDLC Phase: Development
Prompt
Build the product and category APIs in FastAPI using the existing PostgreSQL tables.Customers must be able to:- view products- search products- view product details- view categoriesAdmins must be able to:- add category- edit category- delete category- add product- edit product- delete productUse only the fields already agreed in BRD.md and the database.Test the main API operations before finishing the task.
Checkpoint: Product and category APIs work correctly with the real PostgreSQL data.

---

## Day 9 — Cart APIs

DAY 9 — Cart APIs
SDLC Phase: Development
Prompt
Build the cart APIs in FastAPI.A logged-in customer must be able to:- add a product to the cart- view the cart- increase quantity- decrease quantity- remove a product- view the cart totalUse the existing cart and stock data.Do not allow a quantity greater than available stock.Test the complete cart flow through the API.
Checkpoint: Cart operations work correctly against the real database and stock is respected.

---

## Day 10 — Checkout & Order APIs

DAY 10 — Checkout & Order APIs
SDLC Phase: Development
Prompt
Build the checkout and order APIs in FastAPI.Customer:- start checkout- provide delivery information- place an order- receive order confirmation data- view order history- view order statusWhen an order is placed:- create the order- create its order items- update the cart correctly- update product stock correctlyAdmin:- view customer orders- open an order- update order statusUse the existing database structure. Keep the purchase flow simple.
Checkpoint: The complete purchase flow works through FastAPI: Cart → Checkout → Order → Order History, and admin order status works.
WEEK 3 — REACTJS FRONTEND & INTEGRATION
Week 3 Prerequisite: Week 2 must be complete, and the FastAPI backend plus PostgreSQL must be working. Day 13 is the Week 3 learning day for ReactJS concepts. Frontend remains ReactJS.

---

## Day 11 — ReactJS Frontend Learning

DAY 11 — ReactJS Frontend Learning
SDLC Phase: Learning / Frontend Preparation
Prompt
Teach me the minimum ReactJS concepts I need for Week 3.Explain simply:- What a React component is- What props are- What state is- What events are- What forms are- What React routing is- How one page links to another- How React calls a FastAPI API- What loading, success and error states meanUse examples from our e-commerce screens.Do not build new features today.
Checkpoint: I can explain the basic ReactJS concepts and how ReactJS will communicate with FastAPI.

---

## Day 12 — ReactJS App Setup, Navigation & Authentication Screens

DAY 12 — ReactJS App Setup, Navigation & Authentication Screens
SDLC Phase: Development — Frontend
Prompt
Create the ReactJS frontend using the approved project structure.Build:- Header- Footer- Main navigation- Login page- Register page- Profile page- Basic customer/admin navigationUse UI_UX.md as the guide.Keep the screens simple and make sure navigation works.Do not connect every screen to the backend yet.
Checkpoint: The ReactJS application starts correctly, navigation works and the login/register/profile screens are ready.

---

## Day 13 — Storefront Screens

DAY 13 — Storefront Screens
SDLC Phase: Development — Frontend
Prompt
Build these ReactJS customer screens:Home- website name- categories- available productsProduct Listing- product cards- search box- category filter- price filter- sorting- page navigation when neededProduct Details- product image- product name- description- price- category- stock- add to cart buttonUse simple sample data for screen building. Follow UI_UX.md and keep the layout simple on desktop and mobile.
Checkpoint: Home, Product Listing and Product Details screens are complete and easy to navigate.

---

## Day 14 — Cart, Checkout, Orders & Admin Screens

DAY 14 — Cart, Checkout, Orders & Admin Screens
SDLC Phase: Development — Frontend
Prompt
Build the remaining ReactJS screens.Customer:- Cart- Checkout- Order Confirmation- Order HistoryAdmin:- Dashboard- Product Management- Category Management- Order ManagementUse simple sample data for screen building.Make sure every required screen can be opened and the basic navigation is clear.
Checkpoint: All required customer and admin screens exist and their basic navigation works.

---

## Day 15 — Connect ReactJS to FastAPI

DAY 15 — Connect ReactJS to FastAPI
SDLC Phase: Integration
Prompt
Connect the ReactJS frontend to the real FastAPI backend.Connect:- Register- Login- Profile- Product listing- Product details- Product search and filters- Categories- Cart- Checkout- Orders- Admin product/category/order featuresReplace sample data with real data from FastAPI/PostgreSQL.Test:Register → Login → Browse → Search → Open Product → Add to Cart → Checkout → Place Order → Order HistoryThen test the admin flow.
Checkpoint: The ReactJS frontend is connected to the FastAPI backend and the main customer/admin flows work with real data.
WEEK 4 — DEPLOYMENT, FINAL TESTING & RELEASE
Week 4 Prerequisite: Week 3 must be complete and the complete application must work locally before deployment. Day 19 is the Week 4 learning day for deployment concepts.

---

## Day 16 — Deployment Concepts Learning

DAY 16 — Deployment Concepts Learning
SDLC Phase: Learning / Deployment Preparation
Prompt
Teach me the minimum deployment concepts I need for Week 4.Explain simply:- What deployment means- Why we create a production build for ReactJS- What it means to run FastAPI on a server- Where PostgreSQL is hosted- What an environment variable is- Why frontend and backend URLs matter- What a domain is- How browser → ReactJS → FastAPI → PostgreSQL works after deployment- Why we test the deployed application againUse our e-commerce application as the example.Do not deploy anything today.
Checkpoint: I can explain how the ReactJS frontend, FastAPI backend and PostgreSQL database will work after deployment.

---

## Day 17 — Deployment Plan

DAY 17 — Deployment Plan
SDLC Phase: Deployment / Design
Prompt
Create DEPLOYMENT.md for the e-commerce application in render.Keep it simple and match the actual project.Include:- what needs to be deployed- ReactJS frontend deployment- FastAPI backend deployment- PostgreSQL database connection- required environment/configuration values- frontend URL and backend URL- how to start and restart the application- how to check whether the deployed application is workingDo not create another deployment document.
Checkpoint: DEPLOYMENT.md is complete and matches the actual ReactJS + FastAPI + PostgreSQL project.

---

## Day 18 — Prepare for Deployment

DAY 18 — Prepare for Deployment
SDLC Phase: Deployment
Prompt
Prepare the finished application for deployment.Check:- ReactJS production build works- FastAPI starts correctly for deployment- PostgreSQL connection details are ready- frontend uses the correct backend URL setting- backend uses the correct database setting- test/sample-only code is removed when it is not part of the applicationDelete temporary test/debug scripts and sample files created only for testing.Do not change working business features.
Checkpoint: The application is ready to be deployed and no temporary testing files remain.

---

## Day 19 — Deploy FastAPI & PostgreSQL Connection

DAY 19 — Deploy FastAPI & PostgreSQL Connection
SDLC Phase: Deployment
Prompt
Deploy the FastAPI backend and connect it to PostgreSQL.After deployment, verify:- FastAPI starts- health check works- Login API works- Product API works- Cart API works- Order API works- database data can be read and updated correctlyUse only FastAPI with Python for the backend.Fix deployment issues before continuing.
Checkpoint: The FastAPI backend is running in the deployment environment and can communicate with PostgreSQL.

---

## Day 20 — Deploy ReactJS & Connect the Full Application

DAY 20 — Deploy ReactJS & Connect the Full Application
SDLC Phase: Deployment / Integration
Prompt
Deploy the ReactJS frontend and connect it to the deployed FastAPI backend.Verify in the browser:- Home opens- Register/Login works- Products load- Product details load- Search and filters work- Cart works- Checkout works- Orders work- Admin area worksTest the complete flow:Customer → ReactJS → FastAPI → PostgreSQL → ReactJS responseIf you create temporary deployment/test files only for troubleshooting, delete them after the issue is fixed.
Checkpoint: The ReactJS frontend is live and connected to the deployed FastAPI backend and PostgreSQL data.

---

## Day 21 — Final QA, Cleanup & Release Handover

DAY 21 — Final QA, Cleanup & Release Handover
SDLC Phase: Testing / Release / Final Handover
Prompt
Perform the final end-to-end review of the application.Test the Customer flow:Register → Login → Browse → Search → Product Details → Cart → Checkout → Order HistoryTest the Admin flow:Login → Products → Categories → Orders → Update Order StatusCheck:- ReactJS frontend works- FastAPI backend works- PostgreSQL data is correct- deployed frontend reaches FastAPI- FastAPI reaches PostgreSQL- desktop and mobile layouts are usable- important error and empty messages are understandable- temporary test/debug files are deleted- only these permanent documents remain:  BRD.md  UI_UX.md  ARCHITECTURE.md  CODING.md  TESTING.md  DEPLOYMENT.mdRecord the final PASS/FAIL results in TESTING.md.Update DEPLOYMENT.md only if the final deployment is different from the actual deployment.If everything works, give me:ECOMMERCE APPLICATION COMPLETEThen give me a simple final demonstration checklist.
Checkpoint: The initial e-commerce application is complete, tested, cleaned up and ready for future Single Agent, Multi-Agent and Agentic RAG integration.
MASTER FIX PROMPT — Use Whenever Something Breaks
Something is not working in the current e-commerce task.I am a fresher and I do not understand the technical cause.What I was trying to do:[WRITE WHAT I TRIED]What I expected:[WRITE WHAT SHOULD HAVE HAPPENED]What actually happened:[WRITE WHAT YOU SAW]Error message, if there is one:[PASTE THE REAL ERROR]Please:1. Find the cause yourself.2. Fix only the current issue.3. Do not break features that already work.4. Keep ReactJS as the frontend.5. Keep FastAPI with Python as the backend.6. Keep PostgreSQL as the database.7. Do not create another backend or database.8. Do not create unnecessary documentation.9. If a temporary test/debug file is needed, delete it after testing.10. Explain the problem in very simple language.11. Tell me exactly how to test the fix.12. Re-run the relevant test.13. Stop after the current issue is fixed and wait for my confirmation.
MASTER DAILY CHECKPOINT PROMPT — Use at the End of Each Day
Before I finish today's e-commerce task, check only the work completed today.Tell me:1. What was completed?2. What is working?3. What is not working?4. What should I test manually?5. Did today's work match BRD.md and the current task?6. Did we use ReactJS for the frontend and FastAPI for the backend?7. Did we avoid unnecessary files and documents?8. Were temporary test/debug files removed?9. Is today's Definition of Done satisfied?10. Can I safely move to the next day's task?Use simple language.Do not start tomorrow's task automatically.
IMPORTANT — DO NOT LET ANTIGRAVITY RUN AHEAD
Stop for now.I want to work on one small task at a time.Do not build the next feature.Do not combine multiple days of work.Finish the current task first.Test it.Tell me what I need to verify.Wait for my confirmation before moving to the next task.

---
