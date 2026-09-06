# StatusForge — Frontend

The Next.js dashboard for [StatusForge](../../README.md), a full-stack API &
website monitoring platform. It renders the authenticated dashboard — overview,
monitors, individual monitor detail, analytics, incidents, and settings — and
receives live status updates over Server-Sent Events.

> This is one app in a pnpm monorepo. For full-stack setup (Postgres, Redis,
> migrations, the API, and the worker), start with the [root README](../../README.md).

---

## Tech stack

- **Next.js 16** (App Router) + **React 19**, TypeScript
- **Tailwind CSS v4**, **Radix UI** / **shadcn**, **next-themes** (dark mode)
- **TanStack Query** (server state) + **TanStack Table** (data grids)
- **Apache ECharts** (`echarts-for-react`) for charts
- **react-hook-form** + **Zod** for forms and validation
- **motion** for animation; `lucide-react` icons; `sonner` toasts

---

## Getting started

From the repo root (recommended — runs the API + worker + frontend together):

```bash
pnpm install
pnpm dev
```

Or run just the frontend:

```bash
pnpm --filter @statusforge/frontend dev
```

The app serves at [http://localhost:3000](http://localhost:3000). It expects the
backend API to be running (default `http://localhost:5000`) — set the env vars
below so requests and the SSE stream resolve.

---

## Environment variables

Create `apps/frontend/.env.local`. Only `NEXT_PUBLIC_*` variables are exposed to
the browser.

| Variable                   | Purpose                                                     |
| -------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_FETCH_URL`    | Base URL of the backend API used by the fetch client       |
| `NEXT_PUBLIC_API_URL`      | Backend base URL for public references                     |
| `NEXT_PUBLIC_SSE_ENDPOINT` | SSE stream endpoint on the backend (live updates)          |
| `NEXT_PUBLIC_EMAIL`        | Display/contact email shown in the UI                      |

> Auth uses HTTP-only cookies set by the backend. The API client
> (`lib/api.ts`) sends `credentials: "include"` and transparently refreshes an
> expired access token via `/auth/refresh`, so the frontend never reads tokens
> directly.

---

## Scripts

| Command         | Description               |
| --------------- | ------------------------- |
| `pnpm dev`      | Dev server on `:3000`     |
| `pnpm build`    | Production build          |
| `pnpm start`    | Serve the production build |
| `pnpm lint`     | ESLint                    |

---

## Project structure

```
apps/frontend/
├── app/                        # App Router
│   ├── (auth)/                 # login, register (public)
│   ├── (protected)/            # dashboard/* — session-gated layouts
│   │   └── dashboard/          # overview, monitors, monitors/[id], analytics,
│   │                           # incidents, settings, newmonitor, …
│   ├── verify-email/           # OTP email verification
│   ├── landing-page*/, design-lab/, test/   # marketing + design experiments
│   └── layout.tsx              # root providers (theme, query, toaster)
├── features/                   # feature modules (see below)
├── components/                 # shared UI
│   ├── ui/                     # shadcn primitives
│   ├── sidebar/                # dashboard shell + navigation
│   ├── sse/                    # live-update client
│   ├── empty-states/, loading/, monitor-stats*/
│   └── query-provider, theme-provider, page-error, …
├── lib/
│   ├── api.ts                  # fetch client (cookies + 401 refresh)
│   ├── api-error.ts            # typed API error
│   └── utils.ts
└── proxy.ts                    # Next 16 edge route protection for /dashboard/*
```

### Feature modules (`features/`)

| Module              | Responsibility                                              |
| ------------------- | ---------------------------------------------------------- |
| `auth`              | Login/register forms, `useMe` session hook                 |
| `Overview`          | Dashboard overview / at-a-glance status                    |
| `monitors-page`     | Monitors table + individual monitor detail (charts, checks, TLS, incidents) |
| `new_monitor`       | Create-monitor flow (HTTP + TLS forms, notification setup) |
| `analytics`         | Cross-monitor analytics (ECharts)                          |
| `incidents`         | Incident list and timeline                                 |
| `integrations`      | Email alerts / connection hub                              |
| `settings`          | Account, monitoring defaults, and notification settings    |
| `landing-page*`     | Marketing/landing page experiments                         |

---

## How data flows

- **Server state** is owned by **TanStack Query** — hooks call `apiFetch` from
  `lib/api.ts`, which attaches cookies and retries once through `/auth/refresh`
  on a `401`. Do not fetch server data into local React state.
- **Live updates** arrive over **SSE** (`components/sse` + `NEXT_PUBLIC_SSE_ENDPOINT`);
  the client refetches affected queries rather than persisting a stream.
- **Route protection** is layered: `proxy.ts` redirects unauthenticated
  `/dashboard/*` requests to `/login` at the edge (before render), and
  `app/(protected)/layout.tsx` validates the session via `useMe()` for a real
  check.
- **Forms** use `react-hook-form` + Zod resolvers; schemas live alongside their
  feature.

---

## Conventions

- Feature-first organization: page-specific UI, hooks, schemas, and data live
  under `features/<name>/`; only genuinely shared UI goes in `components/`.
- Some out-of-scope UI (e.g. VPS, coming-soon alert channels, future settings
  sections) is **commented out, not deleted**, so it can be restored for its
  target version — see the root [`ROADMAP.md`](../../ROADMAP.md).
- Dark mode via `next-themes`; styling with Tailwind v4 + shadcn primitives.
