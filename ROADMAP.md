# StatusForge — Master Roadmap (Index)

StatusForge is a backend-focused learning project that grows from a URL checker
into a production-oriented API monitoring platform. Each version introduces a
bounded set of features and concepts; unfinished work is carried forward before
new version work begins.

This file is the **index only**. Full per-version detail lives in
`docs/roadmap/vN.md`. Read the index plus the active version's file — do not load
every version to understand scope.

## How to read this roadmap

- `[ ]` not started, `[~]` partial, `[x]` complete.
- Each version file has: **Goal and scope**, **Core features**, **Supporting
  work**, **Concepts learned**, and **Out of scope**.
- **Out of scope** in a version means deferred, not forgotten — see the
  [deferred-work register](#deferred-work-register) below.

### Pulling deferred work forward

A feature scheduled for a later version may be implemented earlier **only if it
is genuinely required for the current version's user experience or correctness**,
not merely convenient. The roadmap is a guide, not a cage.

- Justify it against current-version *need*, not preference. If the later-version
  feature's benefit only materializes under conditions a later version
  introduces (e.g. high volume, retention churn), the deferral is intentional —
  do not pull it forward.
- Prefer the simpler current-version option when it satisfies today's UX, even if
  a more advanced later-version option exists.
- When you do pull something forward, note it in both this register and the
  affected version file so the roadmap stays the source of truth.

Worked example: cursor pagination is parked at V11. It is *not* pulled into V6,
because its wins (large-offset speed, insert-stable pages) only matter at V11's
volume/retention, and it would *remove* the numbered-page UI V6 already uses
(cursors are next/prev only). Offset pagination is the correct V6 choice.

## Current development state

- **Current active version: V6 — Analytics Dashboard and Real-Time Frontend.**
  Detail: [`docs/roadmap/v6.md`](docs/roadmap/v6.md).
- Earlier version checklists remain the source of truth for any unfinished work;
  active work on V6 does not automatically mark every carried-forward item as
  complete.
- Known carried-forward items:
  1. [ ] `PATCH /monitors/:id`
  2. [ ] `DELETE /monitors/:id`
  3. [ ] `GET /auth/me`
- First polished milestone: V5 plus the basic analytics/dashboard portion of V6.

## Planned refactor (post-V6)

After V6 is complete, the project enters a dedicated refactoring phase **before
V7 feature work begins**. As the codebase has grown, the folder structure has
drifted and needs to be reorganized for clarity and maintainability.

- **Scope:** primarily folder and module structure, not behavior. Reorganize the
  **backend** (routes, controllers, services, validators, queues, workers, etc.)
  and the **frontend** (features, components, hooks, utils) into a consistent,
  scalable layout.
- **Goal:** a predictable structure so later versions add features without the
  current folder sprawl. No new product features land in this phase.
- **Constraint:** keep changes behavior-preserving — no functional regressions.
  Existing tests and the happy path must still pass after the reorganization.
- **State management:** evaluate introducing **Zustand** for shared client-side
  UI state (e.g. cross-component selection such as the bulk-action bar) where
  neither TanStack Query (server state) nor local `useState` fits well. Server
  data stays in TanStack Query — Zustand is for client state only, and is adopted
  where there is a concrete shared-state need, not as a blanket layer.

This is a structural milestone, not a version; it runs between V6 and V7.

## Project pillars

- **Backend:** REST APIs, layered architecture, databases, authentication,
  authorization, queues, workers, real-time delivery, and API lifecycle.
- **Cloud:** object storage, containers, CI/CD, environment management,
  deployment, and regional workers.
- **Monitoring:** HTTP, SSL, and DNS checks; uptime and latency; incidents;
  alerts; thresholds; and live dashboards.
- **Security:** JWTs, refresh-token rotation, blacklisting, SSRF protection,
  injection prevention, CORS, rate limiting, RBAC, signatures, and API keys.
- **Reliability:** retries, dead-letter handling, idempotency, graceful shutdown,
  concurrency control, retention, and aggregated metrics.
- **Observability:** structured logs, error tracking, health checks, correlation
  IDs, query/worker monitoring, metrics, traces, and queue visibility.
- **Testing:** unit, integration, and end-to-end tests; dependency mocking; test
  databases; CI; and coverage.

## Version map

| Version | Title | Goal (one line) | Status | Detail |
|---------|-------|-----------------|--------|--------|
| V0 | URL Checker Prototype | One-off `UP`/`DOWN` check for a single URL | Complete | [v0](docs/roadmap/v0.md) |
| V1 | Endpoint Manager | Persist monitors + check history, CRUD, manual checks | Partial | [v1](docs/roadmap/v1.md) |
| V2 | Authenticated Dashboard | Multi-user auth with access/refresh tokens, ownership | Partial | [v2](docs/roadmap/v2.md) |
| V3 | Automatic Monitoring | In-process `node-cron` scheduler for due monitors | Complete* | [v3](docs/roadmap/v3.md) |
| V4 | Queue and Worker | Move checks to BullMQ producer/consumer + token blacklist | Not started | [v4](docs/roadmap/v4.md) |
| V5 | Incidents and Email Alerts | Incident state machine + down/recovery emails | Not started | [v5](docs/roadmap/v5.md) |
| **V6** | **Analytics Dashboard and Real-Time Frontend** | **Analytics APIs + Next.js dashboard + chosen live transport** | **In progress** | [v6](docs/roadmap/v6.md) |
| V7 | Custom Rules and Extended Check Types | User-defined health rules + SSL/DNS checks | Not started | [v7](docs/roadmap/v7.md) |
| V8 | Public Status Pages, Exports, and S3 | Public status pages + CSV/screenshot exports on S3 | Not started | [v8](docs/roadmap/v8.md) |
| V9 | Teams and Workspaces | Tenant-isolated workspaces + RBAC | Not started | [v9](docs/roadmap/v9.md) |
| V10 | Security Hardening and API Versioning | SSRF protection, rate limits, Helmet, `/v1` + OpenAPI | Not started | [v10](docs/roadmap/v10.md) |
| V11 | Scaling and Performance | Indexes, cursor pagination, retention, caching, aggregates | Not started | [v11](docs/roadmap/v11.md) |
| V12 | Multi-Region Monitoring | Regional workers + `UP`/`DOWN`/`DEGRADED` aggregation | Not started | [v12](docs/roadmap/v12.md) |
| V13 | Integrations | Slack/Discord/signed-webhook alert channels | Not started | [v13](docs/roadmap/v13.md) |
| V14 | Billing and Plans | Stripe subscriptions + plan entitlements | Not started | [v14](docs/roadmap/v14.md) |
| V15 | Application Observability | Pino logs, correlation IDs, Sentry, health checks | Not started | [v15](docs/roadmap/v15.md) |
| V16 | Comprehensive Testing | Unit/integration tests, fixtures, CI quality gates | Not started | [v16](docs/roadmap/v16.md) |
| V17 | Docker, CI/CD, and Production Deployment | Containers, pipelines, managed deps, zero-downtime | Not started | [v17](docs/roadmap/v17.md) |
| V18 | Production Monitoring and Dogfooding | Prometheus/Grafana/Loki/OTel, SLOs, runbooks | Not started | [v18](docs/roadmap/v18.md) |

\* V3 complete with carried-forward V1/V2 gaps.

## Deferred-work register

Concerns that are **deliberately scheduled for a later version**. Before flagging
any of these as missing during code review or planning, check this table first.

- A concern listed here is **not a defect** in the current version. Note it at
  most once as "tracked for V<n>", then move on.
- Only raise a deferred item early if it actively breaks **current-version
  correctness** (e.g. a missing unique constraint allowing duplicate rows is a
  correctness bug, not deferred performance work).

| Concern | Lands in | Notes |
|---------|----------|-------|
| Redis-backed access-token blacklist / revocation | V4 | Auth works without it pre-V4 |
| Queues, workers, multi-process execution | V4 | Checks run in-process until V4 |
| Database schema migrations (replace ad-hoc table creation) | V4 | |
| Incident state machine + email alerts | V5 | |
| Basic Sentry initialization | V5 | Full error tracking in V15 |
| API pagination on list endpoints (limit/offset) | V6 | Cursor pagination later in V11 |
| Credential-aware CORS for frontend origin | V6 | Strict CORS hardening in V10 |
| Basic Pino logger (replace `console.log`) | V6 | Full structured logging in V15 |
| Basic Docker Compose (Postgres + Redis, local dev) | V6 | Production Docker/CI-CD in V17 |
| Failed-reminder backoff | post-V6 | A failed send no longer advances `last_alert_sent_at`, so reminders retry every check cycle while email delivery is broken; add backoff/cap so a persistent email outage doesn't spam send attempts |
| Configurable health rules / thresholds | V7 | |
| SSL certificate checks | V7 | |
| DNS record checks + change detection | V7 | |
| Public status pages | V8 | |
| S3 object storage, CSV exports, screenshots | V8 | |
| Teams / workspaces / RBAC / multi-tenant roles | V9 | |
| SSRF protection (private/link-local/metadata IPs) | V10 | |
| Rate limiting (route-specific) | V10 | Public-route rate limiting noted in V8 |
| Helmet, request/response size limits | V10 | |
| API versioning (`/v1`), OpenAPI/Swagger, deprecation | V10 | |
| **Database indexing / query optimization** | **V11** | **Performance is explicitly post-V6** |
| Cursor pagination for high-volume lists | V11 | |
| Check retention + nightly cleanup | V11 | |
| Pre-aggregated tables + cached dashboard summaries | V11 | |
| N+1 elimination, `EXPLAIN ANALYZE`, query tuning | V11 | Optimize only with measured evidence |
| Multi-region checks + `DEGRADED` state | V12 | |
| Slack/Discord/webhook integrations + HMAC | V13 | |
| Billing, Stripe, plan limits/entitlements | V14 | |
| Full structured logging, correlation IDs, health checks | V15 | |
| Comprehensive automated tests + CI quality gates | V16 | Useful per-feature tests still expected earlier |
| Production Docker images, CI/CD, deployment | V17 | |
| Prometheus/Grafana/Loki/OpenTelemetry, SLOs, runbooks | V18 | |

## Review scoping rule

Before raising a finding, check the deferred-work register above.

- If the concern is scheduled for a later version, do **not** report it as a
  defect. You may note it once as: "Tracked for V11 (indexing) — no action this
  version."
- Only flag deferred work early if it actively breaks current-version
  correctness.
- Keep implementation work within the current active version's scope.

## Off-roadmap suggestions

This roadmap is a guide, not a ceiling. Useful features or improvements that are
not listed in any version are welcome as **proposals** — for example, an
escalation alert when a monitor stays down, added alongside V5 incidents.

StatusForge is a backend learning project: the developer implements their own
concepts, and AI assists with review, test cases, and improving existing code.
Suggestions follow that same spirit — they propose, they do not take over the
implementation.

- Suggest only genuinely valuable ideas that fit the **current active version's
  theme**. Keep them few and high-signal.
- Label them clearly (e.g. "Suggestion (off-roadmap)") with a one-line rationale
  and tradeoff, separate from required in-scope work.
- They are proposals only — do not implement until the developer agrees, and even
  then default to teaching/reviewing rather than writing the full feature unless
  explicitly asked.
- When an off-roadmap idea is accepted, record it in the relevant
  `docs/roadmap/vN.md` file so this roadmap stays the source of truth.

## Build milestones

### Milestone 1 — Resume-worthy MVP

V0–V6: REST API, PostgreSQL, authentication, scheduling, BullMQ/Redis, incident
detection, email alerts, analytics, frontend, a deliberately selected real-time
transport, basic Docker/Compose, Pino, and Sentry.

### Milestone 2 — Production-grade backend

V7, V8, V10, V11, and V16: custom checks, SSL/DNS, S3 and exports, security,
API lifecycle, database performance, retention, caching, comprehensive tests,
and CI.

### Milestone 3 — Full product

V9 and V13–V17: workspaces/RBAC, integrations, billing, observability,
containerization, CI/CD, and production deployment.

### Milestone 4 — Long-term advanced work

V12 and V18: multi-region checks, geographic failure states, Prometheus,
Grafana, Loki, OpenTelemetry, SLOs, runbooks, and dogfooding.
