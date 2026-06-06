# AWS Deployment Guide — LMS Project (gnanamai.com)

End-to-end guide: EC2 (Reserved Instance) + RDS PostgreSQL + Nginx + PM2 + SSL + domain.

**Stack in this repo**

- **Frontend:** React + Vite → static files in `frontend/dist`
- **Backend:** Node.js + Express on port `5000`
- **Database:** PostgreSQL (Sequelize)
- **Realtime:** Socket.io (chat, hackathons)
- **Files:** AWS S3 (already in backend)

---

## 1. Can you deploy both on AWS? (Your question answered)


| Option              | What it is                                                                      | Good for this LMS?                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Recommended** | **One EC2:** Nginx serves frontend + proxies `/api` and Socket.io to Node (PM2) | **Yes — best fit.** Same domain, simple SSL, Socket.io works, matches `api.js` using `/api` in production.                                            |
| **B**               | **EC2 backend** + **S3/CloudFront frontend**                                    | Possible, but you need `api.gnanamai.com`, CORS, Google OAuth extra origins, and Socket.io must point to API subdomain (extra frontend code changes). |
| **C**               | Two EC2 instances (frontend + backend)                                          | Overkill for most LMS traffic; more cost and ops.                                                                                                     |


**Recommendation:** Use **Option A** — single **t3.medium Reserved Instance** with Nginx + PM2. Use **RDS** for PostgreSQL (do not run Postgres on the same EC2 in production if you can avoid it). Keep using **S3** for uploads (already configured in backend).

**Reserved vs On-Demand:** In AWS Console → EC2 → **Reserved Instances** → purchase **1-year or 3-year Standard** for **t3.medium** in your region (e.g. `ap-south-1`). You still **launch** an On-Demand instance, then the reservation **discounts** matching instance usage. Alternatively use **Savings Plans (Compute)** for flexibility.

---

## 2. Target architecture

```
                    Internet
                        |
                        v
              Route 53 (gnanamai.com)
                        |
                        v
              Elastic IP -> EC2 t3.medium
                        |
        +---------------+----------------+
        |                                |
   Nginx :443                         PM2 (Node)
   - /  -> frontend/dist              port 5000
   - /api -> proxy backend             Express + Socket.io
   - /socket.io -> proxy backend
                        |
                        v
              RDS PostgreSQL (private subnet)
                        |
              S3 bucket (uploads / projects)
```

**DNS (simple setup)**

- `gnanamai.com` → A record → EC2 Elastic IP  
- `www.gnanamai.com` → CNAME → `gnanamai.com` (optional)

**Optional later:** `api.gnanamai.com` only if you split frontend to S3.

---

## 3. AWS resources checklist


| Resource                           | Purpose                                         |
| ---------------------------------- | ----------------------------------------------- |
| EC2 `t3.medium`                    | App server (Nginx + Node + built frontend)      |
| Elastic IP                         | Stable IP for DNS                               |
| RDS `db.t3.micro` or `db.t3.small` | PostgreSQL                                      |
| S3 bucket                          | File storage (existing)                         |
| Route 53 hosted zone               | Domain `gnanamai.com`                           |
| Security groups                    | 22 (your IP), 80, 443 public; RDS only from EC2 |
| IAM role (optional)                | EC2 → S3 without hardcoding keys                |


---

## 4. Step-by-step deployment

### Phase 1 — Domain (Route 53)

1. Open **Route 53** → **Hosted zones** → **Create hosted zone** → `gnanamai.com`.
2. Copy the **4 NS records** Route 53 gives you.
3. At your **domain registrar** (where you bought gnanamai.com), set **nameservers** to those 4 NS values.
4. Wait for DNS propagation (often 15 minutes–48 hours).

You will create the **A record** after EC2 has an Elastic IP (Phase 3).

---

### Phase 2 — RDS PostgreSQL

1. **RDS** → **Create database** → **PostgreSQL** (15.x).
2. Template: **Free tier** or **Production** (your choice).
3. **DB instance class:** `db.t3.micro` (start) or `db.t3.small`.
4. **Master username / password:** save securely.
5. **VPC:** default or custom (same VPC as EC2).
6. **Public access:** **No** (recommended).
7. **VPC security group:** create new → allow **inbound 5432** only from **EC2 security group** (add rule after EC2 exists).
8. **Initial database name:** `lms_db` (or match your `.env`).
9. Create DB → note **Endpoint** (e.g. `lms-db.xxxx.ap-south-1.rds.amazonaws.com`).

**Run migrations from EC2 later** (after app is cloned):

```bash
cd /var/www/lms/backend
npm install
npm run db:migrate
# optional: npm run db:create-admin
```

---

### Phase 3 — EC2 instance (Reserved-friendly)

#### 3.1 Purchase reservation (billing)

1. **Billing** → **Reserved Instances** or **Savings Plans**.
2. Choose **EC2 Instance Standard Reserved** → **t3.medium** → **1 year** → pay upfront or partial.
3. Region must match where you launch the instance (e.g. `ap-south-1` Mumbai).

#### 3.2 Launch instance

1. **EC2** → **Launch instance**.
2. **Name:** `lms-production`
3. **AMI:** Ubuntu Server 22.04 LTS
4. **Instance type:** `t3.medium` (2 vCPU, 4 GiB RAM)
5. **Key pair:** create/download `.pem` (e.g. `gnanamai-lms.pem`)
6. **Network:** same VPC as RDS; **Auto-assign public IP:** Enable (or use only Elastic IP)
7. **Security group** (create `lms-sg`):


| Type  | Port | Source                           |
| ----- | ---- | -------------------------------- |
| SSH   | 22   | **Your IP only** (not 0.0.0.0/0) |
| HTTP  | 80   | 0.0.0.0/0                        |
| HTTPS | 443  | 0.0.0.0/0                        |


1. **Storage:** 30–50 GB gp3
2. Launch

#### 3.3 Elastic IP

1. **EC2** → **Elastic IPs** → **Allocate** → **Associate** with `lms-production`.
2. **Route 53** → hosted zone `gnanamai.com` → **Create record**:
  - Name: blank (apex) or `www`
  - Type: **A**
  - Value: **Elastic IP**
  - TTL: 300

---

### Phase 4 — Connect and install base software

From your laptop (PowerShell):

```powershell
ssh -i "C:\path\to\gnanamai-lms.pem" ubuntu@<ELASTIC_IP>
```

On the server:

```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx

# PM2
sudo npm install -g pm2

node -v   # v20.x
npm -v
nginx -v
```

---

### Phase 5 — Deploy application code

```bash
sudo mkdir -p /var/www/lms
sudo chown -R ubuntu:ubuntu /var/www/lms
cd /var/www/lms
```

**Option A — Git (recommended)**

```bash
git clone <your-repo-url> .
# or clone only LMS_Project subfolder as needed
```

**Option B — SCP from Windows**

```powershell
scp -i "gnanamai-lms.pem" -r D:\lms_copy\LMS_Project\backend ubuntu@<ELASTIC_IP>:/var/www/lms/backend
scp -i "gnanamai-lms.pem" -r D:\lms_copy\LMS_Project\frontend ubuntu@<ELASTIC_IP>:/var/www/lms/frontend
```

**Realtime projects folder** (if you use embedded projects):

```bash
# On server, e.g. upload Realtime_projects to:
sudo mkdir -p /var/www/realtime-projects
sudo chown -R ubuntu:ubuntu /var/www/realtime-projects
```

---

### Phase 6 — Backend environment

```bash
cd /var/www/lms/backend
cp .env.example .env   # if exists; else create .env manually
nano .env
```

**Production `.env` template** (adjust values):

```env
NODE_ENV=production
PORT=5000

# URLs — use HTTPS after SSL
FRONTEND_URL=https://gnanamai.com
API_URL=https://gnanamai.com

# PostgreSQL (RDS)
DB_HOST=lms-db.xxxxx.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_strong_password
DB_DATABASE=lms_db

# JWT — generate new secrets (do not use dev defaults)
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_REFRESH_SECRET=<another random hex>
JWT_EXPIRE=7d

# Google OAuth — update in Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://gnanamai.com/api/auth/google/callback

# AWS S3 (existing)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your-bucket-name

# Realtime projects path on server
REALTIME_PROJECTS_PATH=/var/www/realtime-projects
```

```bash
npm install --omit=dev
npm run db:migrate
# npm run db:create-admin   # if you have admin seed script
```

---

### Phase 7 — Frontend build

On server (or build locally and upload `dist` only):

```bash
cd /var/www/lms/frontend
nano .env.production
```

```env
# For Option A (same domain + Nginx /api proxy), api.js uses /api in PROD.
# Still set VITE_API_URL for components that call backend directly (images, sockets, etc.)
VITE_API_URL=https://gnanamai.com
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_POSTHOG_ENABLED=false
```

```bash
npm install
npm run build
# Output: /var/www/lms/frontend/dist
```

---

### Phase 8 — PM2 (backend process manager)

Create `/var/www/lms/backend/ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'lms-api',
    cwd: '/var/www/lms/backend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    max_memory_restart: '800M',
    error_file: '/var/www/lms/logs/err.log',
    out_file: '/var/www/lms/logs/out.log',
    merge_logs: true,
    time: true
  }]
};
```

```bash
mkdir -p /var/www/lms/logs
cd /var/www/lms/backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# Run the command PM2 prints (sudo env PATH=...)
pm2 status
curl http://127.0.0.1:5000/health
```

**Useful PM2 commands**

```bash
pm2 logs lms-api
pm2 restart lms-api
pm2 stop lms-api
```

---

### Phase 9 — Nginx (frontend + API + WebSocket)

Create `/etc/nginx/sites-available/gnanamai.com`:

```nginx
server {
    listen 80;
    server_name gnanamai.com www.gnanamai.com;

    # Certbot will add HTTPS block; for now redirect after SSL step
    root /var/www/lms/frontend/dist;
    index index.html;

    client_max_body_size 100M;

    # Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }

    # Health check (optional direct)
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
    }

    # Socket.io (required for chat / realtime)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -sf /etc/nginx/sites-available/gnanamai.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### Phase 10 — SSL (HTTPS) with Let's Encrypt

```bash
sudo certbot --nginx -d gnanamai.com -d www.gnanamai.com
```

Certbot updates Nginx for HTTPS. Renewals are automatic.

**Update backend `.env` after SSL:**

```env
FRONTEND_URL=https://gnanamai.com
API_URL=https://gnanamai.com
GOOGLE_CALLBACK_URL=https://gnanamai.com/api/auth/google/callback
```

```bash
pm2 restart lms-api
```

---

### Phase 11 — Google OAuth (production)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → your OAuth client:

**Authorized JavaScript origins**

- `https://gnanamai.com`
- `https://www.gnanamai.com`

**Authorized redirect URIs**

- `https://gnanamai.com/api/auth/google/callback`

Match `GOOGLE_CLIENT_ID` in backend `.env` and frontend `VITE_GOOGLE_CLIENT_ID`.

---

### Phase 12 — Socket.io fix (important)

`frontend/src/contexts/SocketContext.jsx` currently uses `REACT_APP_API_URL` (Create React App), but this project uses **Vite**. For production on one domain, use:

```javascript
const socketUrl = import.meta.env.PROD
  ? window.location.origin
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const newSocket = io(socketUrl, {
  auth: { token },
  transports: ['websocket', 'polling'],
});
```

Rebuild frontend after this change:

```bash
cd /var/www/lms/frontend && npm run build
sudo systemctl reload nginx
```

---

## 5. Alternative: Backend on EC2 + Frontend on S3 + CloudFront

Use only if you accept extra setup.


| Piece     | Where                                           |
| --------- | ----------------------------------------------- |
| Frontend  | S3 bucket + CloudFront → `https://gnanamai.com` |
| Backend   | EC2 + Nginx → `https://api.gnanamai.com`        |
| Socket.io | `https://api.gnanamai.com`                      |
| DB        | RDS                                             |


**Extra steps**

1. Build with `VITE_API_URL=https://api.gnanamai.com`
2. S3 static website / CloudFront → `dist`
3. CloudFront error pages: 403/404 → `/index.html` (SPA)
4. Backend CORS: set `FRONTEND_URL=https://gnanamai.com`
5. Nginx on API server only (no static frontend)
6. Fix SocketContext to use `https://api.gnanamai.com`
7. Google OAuth: add both domains

**Why we still recommend all-on-EC2:** fewer moving parts, one SSL cert path, Socket.io and `/api` proxy already match your `api.js` production config (`/api` relative URL).

---

## 6. Post-deploy verification


| Check     | URL / command                                               |
| --------- | ----------------------------------------------------------- |
| Health    | `https://gnanamai.com/health`                               |
| Frontend  | `https://gnanamai.com` loads login                          |
| API       | Browser DevTools → Network → calls to `/api/...` return 200 |
| WebSocket | DevTools → WS → `wss://gnanamai.com/socket.io/` connected   |
| DB        | `pm2 logs` — no Sequelize connection errors                 |
| OAuth     | Google login completes redirect to `/auth/callback`         |


```bash
# On server
pm2 logs lms-api --lines 100
sudo tail -f /var/log/nginx/error.log
```

---

## 7. Updates / redeploy workflow

```bash
cd /var/www/lms
git pull   # or re-upload files

cd backend && npm install --omit=dev && pm2 restart lms-api
cd ../frontend && npm install && npm run build
sudo systemctl reload nginx
```

---

## 8. Security hardening (recommended)

- SSH key only; disable password login
- `ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable`
- RDS not publicly accessible
- Strong `JWT_SECRET` / `JWT_REFRESH_SECRET`
- Restrict SSH (port 22) to your IP in security group
- Enable RDS automated backups (7+ days)
- Optional: AWS WAF on CloudFront if using S3 frontend

---

## 9. Cost rough estimate (ap-south-1, monthly)


| Item                               | Approximate          |
| ---------------------------------- | -------------------- |
| EC2 t3.medium Reserved (1yr)       | ~$25–35/mo effective |
| EC2 t3.medium On-Demand (if no RI) | ~$30–38/mo           |
| RDS db.t3.micro                    | ~$15–20/mo           |
| Elastic IP (attached)              | Free                 |
| S3 + transfer                      | Usage-based          |
| Route 53 hosted zone               | ~$0.50/mo            |


---

## 10. Quick reference — file paths on server


| Path                                        | Purpose                |
| ------------------------------------------- | ---------------------- |
| `/var/www/lms/backend`                      | Node API               |
| `/var/www/lms/frontend/dist`                | Nginx static root      |
| `/var/www/lms/backend/.env`                 | Secrets                |
| `/var/www/lms/backend/ecosystem.config.cjs` | PM2 config             |
| `/etc/nginx/sites-available/gnanamai.com`   | Nginx vhost            |
| `/var/www/realtime-projects`                | Realtime project files |


---

## 11. Troubleshooting


| Problem                        | Fix                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------- |
| 502 Bad Gateway                | `pm2 status` — is `lms-api` running? `curl localhost:5000/health`                |
| API 404                        | Nginx `location /api/` must proxy to port 5000; backend routes use `/api` prefix |
| CORS errors                    | Set `FRONTEND_URL=https://gnanamai.com` exactly                                  |
| Socket disconnects             | Nginx `/socket.io/` upgrade headers; fix SocketContext URL                       |
| DB connection timeout          | RDS security group allows EC2 SG on 5432; correct `DB_HOST`                      |
| Google OAuth redirect mismatch | Callback must match Google Console exactly                                       |
| Blank page after refresh       | `try_files ... /index.html` in Nginx                                             |
| Env changes not applied        | Backend: `pm2 restart`; Frontend: **rebuild** `npm run build`                    |


---

## Summary answer


| Question                   | Answer                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Deploy both on AWS?        | **Yes** — one EC2 with Nginx + PM2 is the best fit for this LMS.                                       |
| Backend EC2 + frontend S3? | **Yes, possible** — use `api.gnanamai.com` + CloudFront; more config for CORS, OAuth, and Socket.io.   |
| Medium instance reserved?  | **Yes** — launch **t3.medium**, purchase **Reserved Instance** or **Savings Plan** in the same region. |
| Domain gnanamai.com        | Route 53 A record → Elastic IP → Nginx → Certbot HTTPS                                                 |


For questions specific to your repo env vars, also see [DEPLOYMENT_CONFIG.md](./DEPLOYMENT_CONFIG.md) and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).