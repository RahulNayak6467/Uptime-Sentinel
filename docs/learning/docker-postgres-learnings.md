# Docker + Postgres — Containerizing the Local DB (V6)

Session log from moving StatusForge's local Postgres off Homebrew and into a
Docker container, on the way to V6's **basic Docker Compose (Postgres + Redis,
local dev)** — production Docker/CI-CD is deferred to V17.

Split into 3 parts: **(1) containerize Postgres**, **(2) learn what Compose is**,
**(3) write the `docker-compose.yml`**. Parts 1–2 done; Part 3 next.

**Legend** — Severity: Critical · High · Medium · Low. Level: 🟢 Beginner ·
🟡 Intermediate · 🔴 Advanced.

---

## What happened (chronological)

1. **Assessed setup** — native Homebrew **Postgres 18.4** via `brew services`,
   Redis already in a standalone container, `DATABASE_URL` had an **empty
   password** (Homebrew trust auth), db `uptimesentinel`, user `rahulnayak`.
2. **Freed port 5432** — stopped native Postgres so the container takes over the
   same port; `DATABASE_URL` stays `localhost:5432`.
3. **First container crashed** (`Exited (1)`) — PG18 data-dir mount-path change.
4. **Fixed the mount** — removed dead container + stray volumes, re-ran with
   `-v statusforge-pgdata:/var/lib/postgresql`, pinned `postgres:18`. Came up healthy.
5. **Migrations "not working"** — red herring first (`npm` blocked; repo enforces
   **pnpm**), then real error `relation "notification_logs" already exists`.
6. **Diagnosed** — `pgmigrations` empty (0 rows) → chain had **never run from an
   empty DB**; old native tables were ad-hoc created. Two migration files were
   **byte-identical**, colliding on a from-zero run.
7. **Fixed (Option A)** — deleted duplicate `fix-notification-logs.ts`, re-ran
   `pnpm migrate`. Clean: **16 migrations recorded, 8 tables created.**

---

## Mistakes / gotchas hit

| Gotcha | Sev · Level | Prevent / remember |
|---|---|---|
| Mounted Postgres volume at old `/var/lib/postgresql/data` → container `Exited (1)`, image auto-made a conflicting anonymous volume | High · 🟡 | **PG18+ mounts at `/var/lib/postgresql`** (data goes in a version subdir). Verify the data-dir per image tag before writing the volume line |
| Assumed the app's empty native password would carry over | Medium · 🟢 | The `postgres` image **refuses to start without `POSTGRES_PASSWORD`**. Set a real local password and mirror it into `DATABASE_URL` |
| Duplicate migration `fix-notification-logs.ts` = byte-copy of `create-nofifications-logs.ts` → `42P07 already exists` on from-zero run | High · 🟡 | Never keep a "fix" migration that re-`CREATE`s a table; a fix should `ALTER`. Root cause: editing an already-applied migration in place |
| Migration chain never validated from an empty DB (native tables were ad-hoc) | Medium · 🟡 | A migration chain is only trusted once it runs **from zero**. A fresh container is a good forcing function |
| Ran `npm run migrate` → `EBADDEVENGINES` | Low · 🟢 | Repo enforces **pnpm** via `devEngines`; use `pnpm migrate` |
| Didn't pin the image tag (`postgres` = latest) | Low · 🟢 | Pin `postgres:18` to match native major + reproducibility |

---

## Concepts learned

### Images & containers
- You **pull and run** prebuilt images (`docker run`); you only **build**
  (`docker build`) from a Dockerfile. Postgres needs no Dockerfile here.
- **Image size:** `postgres:18` (Debian) ~450–650 MB vs `postgres:18-alpine`
  ~250 MB. Chose Debian for glibc collation consistency with prod + better
  `exec` tooling. Alpine's size win matters for *shipping* images (V17), not local dev.
- **glibc vs musl collation:** can't reuse a data volume across Debian↔Alpine.
  Switching later needs a logical `pg_dump`/restore, not a file-level volume swap.

### Running Postgres in a container
- **Port mapping** `host:container` — two processes can't bind host 5432, so
  native Postgres had to stop first.
- **Named volumes & persistence** — data lives in the volume, not the container.
  `down` keeps it; `down -v` wipes it (the deliberate "reset my DB" switch).
- **Config via env** — `POSTGRES_USER` / `POSTGRES_DB` / `POSTGRES_PASSWORD`
  must line up with `DATABASE_URL`.

### Migrations (node-pg-migrate)
- Applied migrations tracked in the `pgmigrations` table.
- The batch runs in **one transaction** — a mid-batch failure **rolls the whole
  run back**, which is why the DB stayed clean after the crash.

### Docker Compose (Part 2 — concept only so far)
- **Declarative single file** (source of truth in git) vs imperative `docker run`
  living in shell history.
- `docker run` flags map **1:1** onto YAML keys:
  `image`, `environment`, `ports`, `volumes` (+ top-level `volumes:` declaration).
- Compose adds: a shared private network with **service-name DNS**, whole-stack
  `up`/`down`, and `depends_on` ordering.
- Host-run backend still uses `localhost` — only containers **on the Compose
  network** address each other by service name. That boundary matters in V17.
- **Not** for building the app image and **not** production orchestration — local-dev only.

---

## Current state
- ✅ Postgres containerized: `uptime-sentinel-database` (`postgres:18`), volume
  `statusforge-pgdata` at `/var/lib/postgresql`, port 5432.
- ✅ Schema rebuilt: 16 migrations, 8 tables.
- ✅ Redis still standalone (`statusforge-redis`) — folds into Compose in Part 3.
- ⚠️ Uncommitted: deleted `fix-notification-logs.ts`.
- ▶️ **Next — Part 3:** draft `docker-compose.yml` for both services. Carry in:
  mount Postgres at `/var/lib/postgresql`, set the password, declare the named
  volume top-level, fold Redis in (add a volume + `restart`).
