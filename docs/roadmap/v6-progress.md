# V6 — Progress Tracker

> Living checklist of what's implemented vs. pending in **V6 — Analytics
> Dashboard and Real-Time Frontend**. Mark items `✅ Done` as they land.
> Source of truth for scope stays [`v6.md`](v6.md); this file tracks status.

_Last updated: 2026-06-28_

## Core features

| # | Feature | Status | Where it lives / what's missing |
|---|---------|--------|--------------------------------|
| 1 | Dashboard summary (UP/DOWN counts, overall uptime) | ✅ Done | `dashboardoverview` controller/service → `dashboard/overview` page |
| 2 | Per-monitor metrics (24h/7d/30d) | ✅ Done | `individualMonitor` stats endpoints → `dashboard/monitors/[id]` |
| 3 | Response-time series (ECharts) | ✅ Done | `responseTime` endpoint → detail page chart |
| 4 | Next.js dashboard / monitor list / detail pages | ✅ Done | `Overview`, `monitors-page`, `new_monitor` features (TanStack Query) |
| 5 | Paginated overview and monitors-page tables | ✅ Done | Server-side limit/offset pagination + pagination utilities |
| 6 | Paginated incident history | ❌ Not started | Part of incidents page (on hold) |
| 7 | Evaluate polling vs SSE vs WebSockets | ❌ Not started | Decision checkpoint in `v6.md` still open |
| 8 | Implement chosen live transport | ❌ Not started | Blocked on #7 (+ Redis Pub/Sub if needed) |

## Supporting work

| # | Item | Status | Where it lives / what's missing |
|---|------|--------|--------------------------------|
| 1 | SQL aggregation queries (AVG/COUNT/SUM/conditional) | 🟡 Partial | `AVG`, `COUNT`, and conditional filters are implemented; `SUM` remains |
| 2 | Validated limit/offset pagination | ✅ Done | Implemented V6 list APIs use `generatePagePagination.ts` and `offsetValidation.ts` |
| 3 | Credential-aware CORS | ✅ Done | `corsConfigOptions` in `index.ts` |
| 4 | Connection cleanup / reconnect / per-user isolation | ⏸ N/A yet | Only if persistent connection chosen (#8 above) |
| 5 | Docker Compose (Postgres + Redis) | ❌ Not started | No compose file exists |
| 6 | Replace `console.log` with Pino | ❌ Not started | No `pino` dep; 33 files still use `console.log` |

## Incidents page (sequenced last, on hold)

| # | Slice | Status | Where it lives / what's missing |
|---|-------|--------|--------------------------------|
| 1 | Incidents read path → frontend (list + summary stats) | ❌ Not started | `Incidents.routes.ts` `/all` & `/all/stats` are stubs (no handler); page not built |
| 2 | Manual incident updates / status timeline | ❌ Not started | Needs `incident_updates` table + post-update form |

## Carried-forward (pre-V6)

| # | Item | Status | Note |
|---|------|--------|------|
| 1 | `PATCH /monitors/:id` | ✅ Done | `/:id/update` (+ `/:id/pause`, `/:id/resume`) |
| 2 | `DELETE /monitors/:id` | ✅ Done | `/:id/delete` |
| 3 | `GET /auth/me` | ❌ Not started | Carried forward from V2 |

## Post-V6 cleanup (tracked, not blocking)

| # | Item | Status | Note |
|---|------|--------|------|
| 1 | Standardize 401 response strings | ❌ Not started | Tracked cleanup after the V6 feature slices |

## Sequencing note

Per `v6.md`, the remaining order is: real-time decision + transport (Core #7–8)
and supporting work (Docker Compose, Pino) **before** the incidents page, which is
built last.
