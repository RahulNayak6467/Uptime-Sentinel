# StatusForge

A full-stack API & website monitoring platform. StatusForge lets you register
public HTTP endpoints and TLS certificates, checks them automatically on a
schedule, records uptime and latency history, opens and resolves incidents when
something goes down or recovers, and sends email alerts — all surfaced through a
real-time Next.js dashboard.

> **Status:** actively developed, backend-focused **learning project**. It is
> built in bounded versions; the current active version is **V6 — Analytics
> Dashboard & Real-Time Frontend**. See [`ROADMAP.md`](ROADMAP.md) for the full
> version map and scope.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API overview](#api-overview)
- [Monitoring pipeline](#monitoring-pipeline)
- [Roadmap](#roadmap)
- [Conventions](#conventions)

---

## Features

**Implemented**

- **Authentication** — register, email verification (OTP), login, logout, and
  `GET /auth/me`. JWT access/refresh tokens in HTTP-only cookies with refresh
  rotation; passwords hashed with bcrypt.
- **Monitors** — create, list, view, edit, pause/resume, and delete monitors;
  run an on-demand manual check. Per-monitor ownership.
- **Automatic monitoring** — a cron scheduler enqueues due monitors onto BullMQ;
  workers run the checks off the request path. Split into a **fast lane**
  (HTTP/TCP, seconds–minutes) and a **slow lane** (TLS/DNS, hours).
- **Check types**
  - **HTTP/HTTPS** — availability, status codes, and latency, stored as check
    history.
  - **TLS certificates** — certificate chain, expiry, hostname, revocation
    (OCSP), Certificate Transparency, weak-config detection, renewal tracking,
    plus per-certificate snapshots and a TLS event log.
  - _DNS and TCP checkers are in progress (V7)._
- **Incidents** — an incident state machine opens a DOWN incident on failure and
  resolves it on recovery, with per-incident update timeline and titles.
- **Alerts** — down and recovery email notifications via Resend, delivered by a
  dedicated alert worker with a notification log.
- **Real-time dashboard** — Next.js App Router UI with an overview, monitors
  table + individual monitor pages, analytics (ECharts), incidents, and settings;
  live updates over **Server-Sent Events**. Server-side route protection for
  `/dashboard/*` plus a client-side session guard.
- **Operational tooling** — Pino structured logging, Sentry error reporting, a
  `/health` endpoint, and a Bull Board queue dashboard (`/admin/queues`, basic
  auth).

**Parked / upcoming** — VPS host telemetry and coming-soon alert channels
(Slack/Webhook/SMS/Discord) exist as UI placeholders but are intentionally
commented out; public status pages, exports, integrations, security hardening,
and multi-region monitoring are scheduled for later versions (see the roadmap).

---

## Tech stack

**Backend**
- Node.js + Express 5, TypeScript (ESM), `tsx` for dev
- PostgreSQL via raw `pg` (parameterized SQL, no ORM); `node-pg-migrate` migrations
- Redis (`ioredis`) + BullMQ for queues/workers; `node-cron` for scheduling
- Zod validation, JWT (`jsonwebtoken`), `bcrypt`
- `@peculiar/x509` + `easy-ocsp` for TLS/cert inspection
- Resend (email), Pino (logging), Sentry (errors), Bull Board (queue UI)

**Frontend**
- Next.js 16 (App Router) + React 19, TypeScript
- Tailwind CSS v4, Radix UI / shadcn, `next-themes` (dark mode)
- TanStack Query (server state) + TanStack Table
- Apache ECharts (`echarts-for-react`), `react-hook-form` + Zod

**Infrastructure**
- pnpm workspaces (monorepo)
- Docker Compose for local PostgreSQL + Redis

---

## Architecture

StatusForge is a pnpm monorepo with two apps that share the same Postgres/Redis
backing services.

```
                         ┌──────────────────────────┐
   Browser ──────────────▶  Next.js frontend (3000)  │
        ▲   SSE / fetch   └────────────┬─────────────┘
        │                              │ REST + SSE (credentials: cookies)
        │                 ┌────────────▼─────────────┐
        │  live updates   │   Express API (5000)      │
        └─────────────────┤  routes → controllers →   │
                          │  services → SQL           │
                          └───┬───────────────┬───────┘
                     enqueue  │               │  read/write
                       ┌──────▼──────┐   ┌────▼─────────┐
   node-cron scheduler │ Redis/BullMQ│   │  PostgreSQL  │
   (fast + slow lanes) │   queues    │   │              │
                       └──────┬──────┘   └────▲─────────┘
                       consume│                │ persist checks,
                       ┌──────▼──────┐         │ incidents, alerts
                       │  Workers    ├─────────┘
                       │ http · tls  │
                       │ alerts · …  │
                       └─────────────┘
```

The API process and the worker process are started separately (`dev:backend`
and `dev:worker`) so scheduling/enqueue and check execution are decoupled.

---

## Repository layout

```
StatusForge/
├── apps/
│   ├── backend/
│   │   ├── migrations/            # node-pg-migrate SQL migrations
│   │   └── src/
│   │       ├── index.ts           # Express app + cron scheduler bootstrap
│   │       ├── worker.ts          # BullMQ worker process entrypoint
│   │       ├── modules/           # auth, users, monitor-checks, tls-checks
│   │       ├── checkers/          # https · tls · dns · tcp · vps probes
│   │       ├── scheduler/         # cron fast/slow lane scheduling
│   │       ├── queue/ · workers/  # BullMQ producers + consumers, state machine
│   │       ├── sse/               # Server-Sent Events transport
│   │       ├── emails/ · db/ · redis/ · config/ · shared/ · routes/
│   └── frontend/
│       ├── app/                   # App Router: (auth), (protected)/dashboard, …
│       ├── features/              # feature modules (monitors, settings, …)
│       ├── components/ · lib/
│       └── proxy.ts               # Next 16 edge route protection
├── docs/roadmap/                  # per-version detail (v0…v18)
├── docker-compose.yml             # local Postgres + Redis
├── ROADMAP.md                     # version map + deferred-work register
└── CLAUDE.md                      # project + contributor guidance
```

---

## Prerequisites

- **Node.js** 20+ (22/24 recommended)
- **pnpm** 11+ (`corepack enable`, or the repo's `devEngines` will auto-download)
- **Docker** (for local Postgres + Redis via Compose), or your own Postgres 18
  and Redis 7
- A **Resend** API key (email alerts) and a **Sentry** DSN (error reporting) —
  both are required by the backend at startup

---

## Getting started

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Start Postgres + Redis (local dev)
#    Fill in POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB in a root .env first.
cp .env.example .env
docker compose up -d

# 3. Configure app env (see "Environment variables" below)
#    apps/backend/.env  and  apps/frontend/.env.local

# 4. Run database migrations
pnpm --filter @statusforge/backend migrate

# 5. Run everything (API + frontend in parallel)
pnpm dev
#    …or run pieces individually in separate terminals:
pnpm dev:backend    # Express API on :5000
pnpm dev:worker     # BullMQ worker (runs the actual checks)
pnpm dev:frontend   # Next.js on :3000
```

> The **worker must be running** for automatic checks, incidents, and alerts to
> happen — the API process only schedules/enqueues work. Open the queue
> dashboard at `http://localhost:5000/admin/queues` (Bull Board, basic auth).

---

## Environment variables

### Root `.env` (consumed by Docker Compose)

| Variable            | Purpose                          |
| ------------------- | -------------------------------- |
| `POSTGRES_USER`     | Postgres superuser for the container |
| `POSTGRES_PASSWORD` | Postgres password                |
| `POSTGRES_DB`       | Database name                    |

### `apps/backend/.env`

| Variable                            | Required | Notes                                            |
| ----------------------------------- | :------: | ------------------------------------------------ |
| `NODE_ENV`                          |    no    | `development` by default                         |
| `PORT`                              |    no    | API port (default `3000`; project uses `5000`)   |
| `DATABASE_URL`                      |  **yes** | `postgresql://user:pass@localhost:5432/db`       |
| `POSTGRESQL_PORT`                   |    no    | default `5432`                                   |
| `REDIS_HOST` / `REDIS_PORT`         |    no    | default `localhost` / `6379`                     |
| `JWT_SECRET`                        |  **yes** | access-token signing secret (long & random)      |
| `JWT_REFRESH_SECRET`                |  **yes** | refresh-token signing secret                     |
| `RESEND_API_KEY`                    |  **yes** | email delivery                                   |
| `SENTRY_DSN`                        |  **yes** | error reporting                                  |
| `FRONTEND_URL`                      |    no    | CORS origin (default `http://localhost:3000`)    |
| `BULL_BOARD_USER` / `..._PASSWORD`  |    no    | queue dashboard basic auth (default `admin`/`secret`) |
| `PINO_LOG_LEVEL`                    |    no    | default `info`                                   |
| `TLS_MONITORING_PORT`               |    no    | default `443`                                    |

> Token lifetimes (15-min access, 7-day refresh) are constants in
> `apps/backend/src/modules/auth/auth-config.ts`, not env vars.

### `apps/frontend/.env.local`

| Variable                  | Purpose                                                    |
| ------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_FETCH_URL`   | Base URL of the backend API (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_API_URL`     | Backend base URL (public references)                      |
| `NEXT_PUBLIC_SSE_ENDPOINT`| SSE stream endpoint on the backend                         |
| `NEXT_PUBLIC_EMAIL`       | Display/contact email shown in the UI                     |

---

## Scripts

**Root (pnpm workspace)**

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm dev`          | Run all `apps/*` dev servers in parallel          |
| `pnpm dev:backend`  | Express API only                                  |
| `pnpm dev:worker`   | BullMQ worker process only                        |
| `pnpm dev:frontend` | Next.js dev server only                           |

**Backend** (`pnpm --filter @statusforge/backend <script>`)

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `dev` / `worker`   | Watch-mode API / worker (`tsx watch`)        |
| `build` / `start`  | Bundle with `tsup` / run built output        |
| `migrate`          | Apply migrations (`node-pg-migrate up`)      |
| `migrate:down`     | Roll back the last migration                 |
| `migrate:create`   | Scaffold a new migration                     |
| `typecheck`        | `tsc --noEmit` (watch)                        |

**Frontend** (`pnpm --filter @statusforge/frontend <script>`)

| Command | Description               |
| ------- | ------------------------- |
| `dev`   | Next.js dev server (:3000)|
| `build` | Production build          |
| `start` | Serve production build    |
| `lint`  | ESLint                    |

---

## API overview

All routes are mounted under the API root (`apps/backend/src/routes/index.ts`).
Authenticated routes require the access-token cookie; cross-origin requests must
send credentials.

| Area        | Representative endpoints                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| Health      | `GET /health`                                                                           |
| Auth        | `POST /users` (register), `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`, email-verification + resend-OTP |
| Monitors    | `POST /monitors`, `GET /monitors/:monitorId/info`, `PATCH /monitors/:monitorId/update`, `PATCH /monitors/:monitorId/status`, `DELETE /monitors/:id/delete`, `POST /monitors/:id/check` |
| Checks/stats| `GET /monitors/:monitorId/checks`, `.../stats`, `.../response-time`, `.../edit-options` |
| TLS         | `GET /monitors/:monitorId/tls`, `.../tls/history`, `.../tls/handshake-latency`          |
| Incidents   | `GET /incidents`, `GET /monitors/:id/incidents`, `GET /incidents/:incidentId`, incident-update create/patch |
| Dashboard   | `GET /dashboard/overview`, dashboard stats & timeline                                   |
| Real-time   | SSE stream (see `apps/backend/src/sse`)                                                 |
| Ops         | `GET /admin/queues` (Bull Board, basic auth)                                            |

See the module route files under `apps/backend/src/modules/**/routes/` for exact
paths and payloads.

---

## Monitoring pipeline

1. **Schedule** — `node-cron` runs a fast lane (HTTP/TCP) and a slow lane
   (TLS/DNS) that find monitors due for a check and enqueue jobs onto BullMQ.
2. **Check** — the worker process consumes jobs and runs the matching probe
   (`checkers/https`, `checkers/tls`, …), measuring status and latency.
3. **Persist** — results are written to check-history tables (`url_checks`,
   `tls_checks`, cert snapshots, …).
4. **State machine** — the workers' incident state machine opens a DOWN incident
   on failure and resolves it on recovery, appending to the incident timeline.
5. **Alert** — incident transitions enqueue email jobs; the alert worker sends
   down/recovery emails via Resend and records them in the notification log.
6. **Deliver** — the frontend reads current state over REST and receives live
   updates over SSE.

---

## Roadmap

StatusForge grows in bounded versions (V0–V18). Highlights of what exists today:
V1–V5 endpoint management, auth, automatic monitoring, queues/workers, and
incidents + email alerts; **V6** (current) analytics dashboard and real-time
frontend; **V7** TLS is complete with DNS/TCP in progress.

[`ROADMAP.md`](ROADMAP.md) is the authoritative source for version scope, status,
the version map, and the deferred-work register. Per-version detail lives in
[`docs/roadmap/`](docs/roadmap).

---

## Conventions

- **Layered backend:** routes → controllers → services → SQL, with Zod
  validation and a shared `AppError` error model.
- **Raw parameterized SQL** — no ORM; migrations via `node-pg-migrate`.
- **Server state** lives in TanStack Query; client-only UI state may use Zustand.
- This is a **learning project** — correctness, clean architecture, and
  incremental delivery are prioritized over feature breadth. Contributor and
  assistant guidance lives in [`CLAUDE.md`](CLAUDE.md).
