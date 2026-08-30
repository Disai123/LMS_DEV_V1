# Google Sign-In Setup Guide

This guide explains how to turn on **Sign in with Google** / **Register with Google** for SANKALP LMS.

SANKALP uses the **Passport redirect flow**: the user clicks **Continue with Google**, is sent to Google’s consent screen, then returns to your app via the backend callback URL.

---

## What you need

1. A Google account
2. Access to [Google Cloud Console](https://console.cloud.google.com/)
3. Ability to edit `backend/.env` on the server / your machine

You do **not** need `VITE_GOOGLE_CLIENT_ID` on the frontend for this flow — only backend credentials.

---

## Step 1 — Create a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Name it something like **SANKALP LMS**.

---

## Step 2 — Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (for general users) or **Internal** (Google Workspace only).
3. Fill in:
   - **App name:** SANKALP LMS
   - **User support email:** your email
   - **Developer contact:** your email
4. Save and continue through Scopes (defaults are fine).
5. While the app is in **Testing** mode, add your own Gmail address under **Test users**.
6. Click **Save**.

---

## Step 3 — Create an OAuth Client ID

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
4. Name: `SANKALP LMS Web`.

### Authorized redirect URIs (required)

| Environment | Redirect URI |
|-------------|--------------|
| Local dev | `http://localhost:5001/api/auth/google/callback` |
| Production | `https://sankalp.gnanamai.com/api/auth/google/callback` |

With Nginx, the public API is on the same domain as the frontend (`/api` → backend). Use the **public HTTPS URL**, not internal ports like `:8006`.

5. Click **Create**.
6. Copy the **Client ID** and **Client Secret**.

---

## Step 4 — Put credentials in `backend/.env`

### Local development

```env
FRONTEND_URL=http://localhost:3001

GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

### Production

```env
FRONTEND_URL=https://sankalp.gnanamai.com

GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_CALLBACK_URL=https://sankalp.gnanamai.com/api/auth/google/callback
```

Restart the backend after changing `.env`.

---

## How the redirect flow works

```text
User clicks "Continue with Google" on Login/Register
        │
        ▼
GET /api/auth/google          (backend starts Passport OAuth)
        │
        ▼
Google consent screen
        │
        ▼
GET /api/auth/google/callback (backend exchanges code, creates JWT)
        │
        ▼
Redirect to FRONTEND_URL/auth/callback?token=...&refresh=...
        │
        ▼
Frontend stores tokens → student or admin dashboard
```

---

## Step 5 — Test Google Sign-In

### Login

1. Open `http://localhost:3001/login` (or `https://sankalp.gnanamai.com/login`).
2. Click the **Google Sign-In** tab.
3. Click **Continue with Google**.
4. Choose a Google account.
5. You should land on the student dashboard (or admin if that email is already an admin).

### Register

1. Open `/register`.
2. Click **Register with Google**.
3. Same flow — new emails create a student account.

---

## Common problems

| Problem | Fix |
|---------|-----|
| “Google sign-in is not configured on this server” | Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env` and restart |
| `redirect_uri_mismatch` from Google | `GOOGLE_CALLBACK_URL` must exactly match an **Authorized redirect URI** in Google Cloud Console |
| Works locally but not on production | Use `https://sankalp.gnanamai.com/api/auth/google/callback` (not `http://` or raw IP) |
| Lands on login with `?error=auth_failed` | Check backend logs; verify `FRONTEND_URL` matches your live frontend domain |
| Access blocked: app is in testing | Add the user’s Gmail under OAuth consent **Test users**, or publish the app |

---

## Notes for administrators

- New Google sign-ups are always created as **students**.
- Email/password login still works alongside Google Sign-In.
- `GOOGLE_CLIENT_SECRET` must stay on the server only — never put it in the frontend.

---

## Quick checklist

- [ ] OAuth consent screen configured
- [ ] Web OAuth client created
- [ ] Redirect URI added for dev and/or prod
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL` set in backend `.env`
- [ ] Backend restarted
- [ ] Login → Google Sign-In → Continue with Google works
- [ ] Register → Register with Google works
