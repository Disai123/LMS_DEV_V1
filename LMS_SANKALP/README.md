# LMS_SANKALP

Course-only replica of the GNANAM AI LMS (`LMS_Project`), scoped to:

**Admin:** course creation → chapters → tests → publish → student oversight  
**Student:** browse → enroll → chapters → tests → certificate  
**Notifications:** enrollment, progress, test, and certificate events (REST + Socket.io)

Uses **SQLite** locally. Data can be pulled once from the live GNANAMAI **PostgreSQL** database.

The backend is **lean** — only course-flow runtime code plus `db:init`, `db:pull`, and `create-admin-user`. No hackathon/project/pricing migration scripts from the main app.

---

## Folder structure

```
LMS_SANKALP/
  backend/     Express API on port 5001
  frontend/    React (Vite) on port 3001
```

Runs alongside `LMS_Project` without port conflicts.

---

## Setup

### 1. Backend

```powershell
cd d:\lms_copy\LMS_SANKALP\backend
copy .env.example .env
```

Edit `.env`:

- Set `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Set `SOURCE_DB_*` to your GNANAMAI PostgreSQL credentials (same as `LMS_Project/backend/.env`)

```powershell
npm install
npm run db:init
npm run db:pull
npm run dev
```

- `db:init` — creates SQLite schema at `backend/database.sqlite`
- `db:pull` — copies users, courses, enrollments, tests, certificates, notifications (course flow only) from PostgreSQL

**Optional:** copy uploaded media from the main app:

```powershell
xcopy /E /I d:\lms_copy\LMS_Project\backend\uploads d:\lms_copy\LMS_SANKALP\backend\uploads
```

**Create a fresh admin** (if not pulled from source DB):

```powershell
npm run db:create-admin
```

### 2. Frontend

```powershell
cd d:\lms_copy\LMS_SANKALP\frontend
npm install
npm run dev
```

Open: **http://localhost:3001**

---

## What's included vs excluded

| Included | Excluded |
|----------|----------|
| Auth (login, register, reset password, Google OAuth if configured) | Realtime projects |
| Admin dashboard, course/chapter/test CRUD | Hackathons |
| Student course consumption & test taking | Internships |
| Certificates (course type) | Pricing / subscriptions |
| Notifications (bell + page) | RBAC / scoring |

---

## Default ports

| Service | Port |
|---------|------|
| Backend API | 5001 |
| Frontend | 3001 |
| GNANAMAI (original) | 5000 / 3000 |

---

## Re-pull data from PostgreSQL

```powershell
cd d:\lms_copy\LMS_SANKALP\backend
npm run db:pull
```

This recreates the SQLite file and re-imports filtered course-flow data.

---

## Python demo reset

Trim the SQLite database to a single Python course with only the admin and sample student:

```powershell
cd d:\lms_copy\LMS_SANKALP\backend
npm run db:reset-demo
```

This keeps **course id 3** (Python), **admin@aishani.com**, and **sandhya@gmail.com**. All other courses and users are removed.

**Demo credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aishani.com | admin123 |
| Student | sandhya@gmail.com | *(existing password from source DB)* |

Optional env overrides in `.env`: `DEMO_PYTHON_COURSE_ID`, `DEMO_ADMIN_EMAIL`, `DEMO_STUDENT_EMAIL`.

---

## Branding

UI matches GNANAM AI design. Text branding is **SANKALP**. Replace `frontend/public/lms_logo.svg` with your client logo when ready.
