# StatusForge Version Roadmap

This file defines the project versions and the scope of each version.

The goal is to build the project incrementally without jumping into advanced features too early.

---

## Current Target

First polished target:

```txt
V5 + Basic V6
```

This is the first resume-worthy version.

It should include:

- authentication
- endpoint CRUD
- manual checks
- automatic checks
- Redis/BullMQ worker
- PostgreSQL check history
- latest status snapshot
- incidents
- down/recovery email alerts
- basic uptime/latency dashboard

---

# V0 — URL Checker Prototype

## Goal

Prove the core monitoring logic.

## Scope

Build a simple backend that accepts a URL, checks it, and returns whether it is UP or DOWN.

## Features

- `GET /health`
- `POST /check-url`
- Accept URL in request body
- Validate URL
- Send HTTP GET request to URL
- Measure response time
- Return:
  - status: `UP` or `DOWN`
  - status code
  - response time
  - error message if failed

## Handles

- valid URL
- missing URL
- invalid URL
- `200` response
- `404` response
- `500` response
- timeout
- network error

## Tech / Concepts

- Node.js
- Express
- TypeScript
- Zod
- `fetch`
- `AbortSignal.timeout`
- async/await
- try/catch
- HTTP status codes

## Out of Scope

- database
- authentication
- Redis
- BullMQ
- workers
- incidents
- email alerts
- frontend

---

# V1 — Endpoint Manager

## Goal

Allow users to save endpoints and manually check them.

## Scope

Add endpoint CRUD and database-backed check history.

## Features

- Create endpoint
- Get all endpoints
- Get one endpoint
- Update endpoint
- Delete endpoint
- Manually check endpoint by ID
- Store every check result
- Store latest status snapshot on endpoint

## Routes

- `POST /endpoints`
- `GET /endpoints`
- `GET /endpoints/:id`
- `PATCH /endpoints/:id`
- `DELETE /endpoints/:id`
- `POST /endpoints/:id/check`
- `GET /endpoints/:id/checks`

## Database Models

- `Endpoint`
- `Check`

## Important Design

`Check` stores history.

`Endpoint` stores latest snapshot:

- `currentStatus`
- `lastStatusCode`
- `lastResponseTime`
- `lastCheckedAt`

## Tech / Concepts

- PostgreSQL
- Prisma
- migrations
- one-to-many relation
- CRUD
- route/controller/service structure
- basic database querying
- latest snapshot pattern

## Out of Scope

- authentication
- user-specific endpoints
- automatic checks
- Redis/BullMQ
- incidents
- email alerts

---

# V2 — Authenticated Dashboard

## Goal

Make the app multi-user.

## Scope

Add users, login, protected routes, and ownership checks.

## Features

- Register
- Login
- JWT authentication
- Password hashing
- Protected routes
- User-specific endpoints
- User-specific check history
- Basic dashboard data

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Existing endpoint routes become protected.

## Database Models

- `User`
- `Endpoint`
- `Check`

## Important Rule

When user ownership matters, query using both resource ID and user ID.

Example:

```ts
await prisma.endpoint.findFirst({
  where: {
    id: endpointId,
    userId: currentUser.id,
  },
});
```

## Tech / Concepts

- JWT
- bcrypt
- auth middleware
- protected routes
- ownership checks
- authorization
- `401` vs `403`
- user-specific database queries

## Out of Scope

- automatic checks
- Redis/BullMQ
- incidents
- email alerts
- public status pages

---

# V3 — Automatic Monitoring

## Goal

Automatically check endpoints based on their configured interval.

## Scope

Add scheduling logic so endpoints are checked without manual action.

## Features

- Add `interval`
- Add `nextCheckAt`
- Add `isPaused`, optional
- Scheduler runs every minute
- Scheduler finds due endpoints
- Scheduler checks due endpoints
- Scheduler updates `nextCheckAt`

## Scheduler Logic

```txt
Every minute:
  find endpoints where nextCheckAt <= now
  skip paused endpoints
  check endpoint
  save check result
  update latest status
  update nextCheckAt
```

## Tech / Concepts

- node-cron
- scheduled jobs
- date/time handling
- `nextCheckAt`
- periodic background logic
- due endpoint query

## Out of Scope

- Redis/BullMQ queue
- separate worker process
- incidents
- email alerts
- advanced retry system

---

# V4 — Queue + Worker

## Goal

Move endpoint checks out of the main API server.

## Scope

Use Redis and BullMQ so checks run in a background worker.

## Features

- Add Redis
- Add BullMQ
- Create check queue
- Create worker process
- Scheduler enqueues check jobs
- Worker processes check jobs
- Worker saves check results
- Worker updates latest endpoint status
- Add basic retries
- Add basic failed job handling
- Add worker concurrency

## Architecture

```txt
API Server / Scheduler
  ↓
BullMQ Queue
  ↓
Worker
  ↓
External Endpoint
  ↓
PostgreSQL
```

## Tech / Concepts

- Redis
- BullMQ
- queue
- job
- worker
- producer/consumer pattern
- retries
- backoff
- concurrency
- separate process

## Out of Scope

- incidents
- email alerts
- advanced observability
- Bull Board, unless needed for debugging

---

# V5 — Incidents + Email Alerts

## Goal

Make the app product-like and resume-worthy.

## Scope

Detect continuous downtime incidents and send email alerts.

## Features

- Create incident when endpoint goes DOWN
- Resolve incident when endpoint comes back UP
- Send DOWN email alert
- Send RECOVERY email alert
- Avoid duplicate incidents
- Avoid repeated email spam
- Store incident history
- Optionally store notification logs

## Database Models

- `Incident`
- `NotificationLog`, optional

## Incident Logic

```txt
If check is DOWN and no active incident exists:
  create incident
  send down alert

If check is DOWN and active incident already exists:
  do nothing

If check is UP and active incident exists:
  resolve incident
  send recovery alert

If check is UP and no active incident exists:
  do nothing
```

## Tech / Concepts

- incident lifecycle
- state transitions
- email service
- alert deduplication
- recovery detection
- transactions
- notification logs
- worker-side business logic

## Out of Scope

- custom monitoring rules
- public status pages
- billing
- multi-region monitoring
- advanced scaling

---

# Basic V6 — Analytics

## Goal

Show useful uptime and latency metrics.

## Scope

Add basic dashboard analytics from check history.

## Features

- Uptime percentage
- Average response time
- Response-time chart
- Recent checks
- Recent incidents
- Current UP/DOWN count
- Endpoint detail metrics

## Suggested Routes

- `GET /dashboard/summary`
- `GET /endpoints/:id/metrics?range=24h`
- `GET /endpoints/:id/checks?limit=50`
- `GET /endpoints/:id/incidents`

## Tech / Concepts

- aggregation
- time-window queries
- average latency
- uptime calculation
- chart data APIs
- pagination/limits
- query optimization basics

## Out of Scope

- advanced analytics
- P95/P99 unless explicitly added
- caching
- complex reporting

---

# V7 — Custom Monitoring Rules

## Goal

Let users define what “healthy” means.

## Scope

Make endpoint health checks configurable.

## Features

- Expected status code
- Allowed status range
- Custom timeout
- Failure threshold
- Recovery threshold
- Pause/resume endpoint
- Optional response body keyword check
- Optional custom headers

## Example Rules

```txt
Expected status code: 200
Timeout: 3000ms
Alert after: 3 consecutive failures
Recover after: 2 consecutive successes
```

## Tech / Concepts

- configurable backend logic
- rule evaluation
- custom validation
- false-positive reduction
- failure counters
- recovery counters
- safer request configuration

## Out of Scope

- full synthetic testing
- complex browser checks
- authenticated browser flows

---

# V8 — Public Status Pages

## Goal

Add SaaS/product feel by allowing public service status pages.

## Scope

Users can create a public page showing endpoint/service status.

## Features

- Create public status page
- Custom slug
- Add endpoints/services to status page
- Show current status
- Show recent incidents
- Show uptime summary
- Optional maintenance messages

## Example

```txt
/status/tripweaver
```

## Tech / Concepts

- public/private data separation
- slug routing
- public read-only pages
- status page modeling
- incident visibility
- service grouping

## Out of Scope

- custom domains
- subscriber notifications
- advanced branding
- paid plans

---

# V9 — Teams + Workspaces

## Goal

Turn the app into a team-based SaaS.

## Scope

Add organizations/workspaces and role-based access.

## Features

- Create workspace
- Invite members
- Roles:
  - owner
  - admin
  - member
  - viewer
- Shared endpoints
- Team-level alert settings
- Optional audit logs

## Database Models

- `Workspace`
- `WorkspaceMember`
- `Invite`
- `Role`
- `AuditLog`, optional

## Tech / Concepts

- multi-tenancy
- RBAC
- many-to-many relations
- invites
- authorization design
- audit logs

## Out of Scope

- billing
- enterprise SSO
- advanced compliance

---

# V10 — Security Hardening

## Goal

Make user-submitted URL monitoring safer.

## Scope

Protect the app from abuse and SSRF risks.

## Features

- Allow only `http` and `https`
- Block localhost
- Block private IP ranges
- Block metadata service IPs
- Validate redirects
- Limit redirects
- Limit response body size
- Set strict timeouts
- Rate limit manual checks
- Rate limit endpoint creation
- Validate custom headers if V7 exists

## Risks Addressed

- SSRF
- internal network probing
- localhost access
- redirect abuse
- large response abuse
- excessive check abuse

## Tech / Concepts

- SSRF protection
- URL validation
- DNS/IP checks
- private IP ranges
- rate limiting
- abuse prevention
- threat modeling

## Out of Scope

- perfect enterprise-grade security
- WAF
- advanced bot detection

---

# V11 — Scaling + Performance

## Goal

Handle more endpoints and larger check history.

## Scope

Improve database performance, worker throughput, and data retention.

## Features

- Add indexes based on query patterns
- Add pagination
- Add check retention policy
- Add aggregated metrics
- Add worker concurrency control
- Add batch scheduling
- Optimize dashboard queries
- Avoid N+1 queries
- Add cleanup jobs

## Useful Indexes

```prisma
@@index([userId])
@@index([endpointId, checkedAt])
@@index([nextCheckAt])
@@index([endpointId, resolvedAt])
```

## Tech / Concepts

- indexes
- pagination
- retention policy
- aggregation
- query optimization
- worker concurrency
- batching
- database growth management

## Out of Scope

- multi-region monitoring
- Kubernetes
- complex distributed systems

---

# V12 — Multi-Region Monitoring

## Goal

Check APIs from different geographic regions.

## Scope

Run workers in multiple regions and compare regional health/latency.

## Features

- Region-specific workers
- Region-specific check results
- Regional latency comparison
- Regional outage detection
- Region-based alerting

## Example

```txt
US region: UP, 120ms
India region: UP, 310ms
EU region: DOWN
```

## Tech / Concepts

- distributed workers
- regional infrastructure
- latency by geography
- multi-region coordination
- regional outage detection

## Out of Scope

- first production release
- beginner MVP
- billing

---

# V13 — Integrations

## Goal

Send alerts to external tools.

## Scope

Add third-party alert channels.

## Features

- Slack alerts
- Discord alerts
- Telegram alerts
- Webhook alerts
- Optional PagerDuty/Opsgenie-style integration
- Notification channel settings

## Tech / Concepts

- webhooks
- third-party APIs
- retryable notifications
- idempotency
- external failure handling
- integration secrets

## Out of Scope

- OAuth integrations unless explicitly needed
- marketplace-style integrations

---

# V14 — Billing + Plans

## Goal

Make the app commercially structured.

## Scope

Add plans, limits, and subscriptions.

## Features

- Free plan
- Pro plan
- Team plan
- Endpoint limits
- Check interval limits
- History retention limits
- Billing provider integration
- Plan upgrade/downgrade
- Billing portal

## Example Plans

```txt
Free:
5 endpoints
5-minute checks
7-day history

Pro:
50 endpoints
1-minute checks
90-day history

Team:
500 endpoints
workspace support
status pages
```

## Tech / Concepts

- billing provider
- subscriptions
- webhooks
- entitlements
- usage limits
- plan enforcement

## Out of Scope

- complex tax handling
- enterprise contracts

---

# V15 — Observability

## Goal

Make the monitoring platform itself debuggable and monitorable.

## Scope

Add logs, error tracking, queue monitoring, and internal health checks.

## Features

- Structured logs
- Request logs
- Worker logs
- Error tracking
- Bull Board
- Queue health
- Worker health
- Internal health endpoint
- Basic metrics
- Slow query visibility

## Useful Events

- `endpoint_check_started`
- `endpoint_check_completed`
- `endpoint_check_failed`
- `incident_created`
- `incident_resolved`
- `email_alert_sent`
- `email_alert_failed`
- `job_failed`

## Tech / Concepts

- observability
- structured logging
- error tracking
- queue monitoring
- worker health
- debugging production systems
- internal service health

## Out of Scope

- full enterprise observability stack
- complex OpenTelemetry setup unless explicitly added later

---

# Recommended Build Order

## First Release

```txt
V0 → V1 → V2 → V3 → V4 → V5 → Basic V6
```

This is the first strong resume-worthy release.

## Later Product/Backend Depth

```txt
Selected V7 → V10 → V11 → V15
```

This turns the app into a production-inspired backend project.

## Optional SaaS/Product Expansion

```txt
V8 → V9 → V13 → V14
```

This makes the app feel more like a real SaaS product.

## Advanced Long-Term Expansion

```txt
V12
```

Multi-region monitoring should be treated as advanced and long-term.
