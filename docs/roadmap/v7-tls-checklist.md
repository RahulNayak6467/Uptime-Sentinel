# V7 — TLS Master Checklist

> Part of the [StatusForge roadmap](../../ROADMAP.md). Reconciles the original
> 23-item TLS task list with later enrichments (raised snapshot cap, `tls_state`,
> security-grade derivations, per-region cards). Items marked **★** are additions
> beyond the original 23-row scope.

**Status:** In progress — 13 of 32 done (+ ★15b/c/d). **Pure-derive layer COMPLETE
(2026-08-07)** and **#10 COMPLETE (2026-08-08)** — envelope + `checkConnections`
double-probe dedupe both done. **The entire no-schema backend runway is finished.**
All remaining work is pipeline/persistence + 2 service SQL queries. All 5 tables
migrated + applied 2026-08-05.

**#8/#9 persistence WRITTEN + type-clean (2026-08-10).** Reviewed function-by-function;
all runtime + logic bugs found in that review are fixed and `tsc` is clean across the
backend. **Two things remain before #8/#9 are DONE:** (a) prune-to-10 in `insertToSnapshot`
(parked), (b) DB-harness verification of the things tsc can't prove — `ON CONFLICT`
upsert, jsonb/array round-trip, event writes, mid-txn rollback. Then → #16.

## Checklist

| # | Bucket | Item | Status | Depends on / notes |
|---|---|---|---|---|
| 1 | Schema | Monitor `type` column + backfill `'http'` | ✅ Done | `ssl`→`tls` migrated; no `ssl` rows existed |
| 2 | Schema | `tls_config` columns (warning_threshold_days, expiry_alert_thresholds) | ✅ Done | Migrated |
| 3 | Schema | `tls_cert_snapshots` table | ✅ Done | Migrated; `chain jsonb` kept |
| 4 | Schema | `tls_checks` table (per-check + timing) | ✅ Done | Migrated |
| ★5 | Schema | **`tls_state` table** (protocol-scan/OCSP/CAA, 1:1, overwrite) | ✅ Done | 15 cols, migrated 2026-08-05 |
| ★6 | Schema | **Raise snapshot cap** (cap-2 → **10**) | ✅ Done | cap=10; prune-to-10 written in #9 + verified (12→10) 2026-08-12 |
| ★7 | Decision | **monitor_type semantics** → **standalone** (`type='tls'` → tlsFetcher only) | ✅ Decided | 2026-08-05; shared monitor table keeps inert HTTP cols for tls rows |
| 8 | Persistence | Store check results + handshake timing → `tls_checks` | ✅ Done + verified (2026-08-12) | `insertToDB` (tls_checks + tls_state upsert + monitor status map). **Verified end-to-end against the real DB** via the pipeline: happy-path writes, upsert (state=1 on re-run), jsonb/array round-trips, down-path (check row + DOWN, no cert rows, still commits), atomicity/rollback all pass |
| 9 | Persistence | Append cert snapshot on fingerprint/serial change (+prune) | ✅ Done + verified (2026-08-12) | Snapshot append-on-fingerprint-change + prune-to-10 + `first_snapshot`/`renewed`/`protocol_change` events. **Verified:** no-dup on unchanged cert, renewal (fingerprint tamper), protocol_change (uses last-non-null protocol so null→value isn't a false change), prune keeps 10. `first_snapshot`-only on first check |
| ★10 | Backend | **`tlsFetcher` result envelope** (`status`/`certificate`/`error`) | ✅ Done | Envelope (commit 15a7d43; 0 tsc / 0 console.logs) **+ double-probe deduped 2026-08-08**: `checkDeprecatedProtocol`/`protocolAndCipherScan` now take the single `offeredProtocols` scan (no re-probe) — `checkConnections` runs once/check (tlsFetcher:210). Dead imports removed |
| 11 | Derive | Fingerprint pinning — `comparePin` | ✅ Done + tested | `computeComparePin` (status/isPinned/normalize) 2026-08-07; auto-repin write deferred to #9/#11 |
| 12 | Derive | Renewal comparison — `computeRenewalComparison` | ✅ Done + tested | + `compareSan` 2026-08-06; runs once ≥2 snapshots persist |
| 13 | Derive | Snapshot & renewal history — `lifetimeHistoryStats` | ✅ Done + tested | 2026-08-07; runs once snapshots persist |
| 14 | Derive | Handshake trend / avg / p95 | 🟡 Partial | phase split done + wired (`computeConnectionLatency`); **avg/p95/trend = service SQL, not a fn** (`AVG`/`percentile_cont`/`date_trunc`; DB tests) |
| 14b | Derive | **Chain of trust** (`chainOfTrust`/`buildChainOfTrust`) | ✅ Done + wired | Recurse sent chain, named status-only root; 2026-08-05 |
| 14c | Derive | **Protocol & cipher matrix** (per-version suite/status/rating + ALPN) | ✅ Done + wired | `probeProtocols` returns rating; frontend mock updated; 2026-08-05 |
| ★15 | Derive | **`computeSecurityGrade`, `parseMustStaple`, revocation shaper** | ✅ Done + wired | + `keyLabel` EC-bits + `cipherSummary`; all Group A wired. `classifyWeakCiphers` **dropped**. **`signals` block done + tested 2026-08-06** |
| ★15b | Derive | **CAA policy lookup — `computeCaa`** | ✅ Done + tested | 2026-08-07, injectable resolver; persist to `tls_state` pending — amend `caa_iodef → TEXT[]` |
| ★15c | Derive | **Certificate history builder — `computeCertificateHistory`** (+ `computeTone`) | ✅ Done + tested | 2026-08-07; runs once `tls_events` persist; per-type metadata locked at #17 |
| ★15d | Derive | **Connection & schedule — `connectionInfo`** | ✅ Done + tested | 2026-08-06 (return + field mapping fix) |
| 16 | Pipeline | Worker dispatch by monitor type → `tlsFetcher` on interval | 🟡 In progress (2026-08-12) | **Dispatch already works** — `scheduler/index.ts` routes `tls`→`tlsQueue`→standalone `tlsWorker`→`insertToDB` (verified). Remaining = cleanup: (1) new **slow-lane scheduler** (`*/5`, `WHERE monitor_type='tls'`), (2) strip TLS from fast scheduler (avoid double-dispatch), (3) **remove `next_check_at` advance from `updateTlsMonitor`** (scheduler owns it — kills double-advance), (4) per-worker `redis.duplicate()` + drop console.log. Shared queue/worker factory still deferred until DNS/TCP exist |
| 17 | Pipeline | Threshold state machine → open/close TLS incidents | ❌ Left | |
| 18 | Alerting | Expiry alerts (fire at `expiry_alert_thresholds`) | ❌ Left | |
| 19 | Alerting | Failure alerts (expired/untrusted/hostname-mismatch/revoked) | ❌ Left | |
| 20 | Alerting | Recovery alerts (cert valid again) | ❌ Left | |
| 21 | API | Zod config schema (validate create/edit) | ❌ Left | |
| 22 | API | Create/edit endpoints (monitor form → TLS config) | ❌ Left | |
| 23 | API | GET TLS detail endpoint (envelope + history + config) | ❌ Left | Needs #10 |
| 24 | Frontend | `certificates-monitor.tsx` redesign + conventions | ✅ Done | Mock data, real TLS tab |
| 25 | Frontend | Wire mock → real data (replace `mockTlsCertificate`) | ❌ Left | Needs #23 |
| 26 | Frontend | Status pill + gauge → bind to `computeStatus` | ❌ Left | |
| 27 | Frontend | SAN "+N more" capped-chip display | ❌ Left | Backend already sends all SANs |
| ★28 | Frontend | **Per-region cert card** (blurred coming-soon) | ⏸️ V12 | Not removed; multi-region infra |
| 29 | Tests | Derive unit tests (test tables → real assertions) | 🟡 Partial | Scaffolds written + green for all pure-derive fns done this session (signals, renewal, comparePin, CAA, lifetime, history, connectionInfo); remainder as fns land |
| 30 | Tests | Checker integration tests (envelope + persistence) | ❌ Left | uses the DB harness — see "DB integration test harness" section |
| ★31 | Tests | **DB integration tests** for TLS SQL queries | ❌ Left | test-DB + migrations + seed factories + txn-rollback; see "DB integration test harness" section. Stand up when #8/#9 start |
| 32 | Deferred | Cipher-order finding (two-connection probe) | ⏸️ Deferred | High effort, moot on TLS 1.3 |

## Summary

- **Done:** base schema (1–4) + frontend redesign (24) + **all no-persistence derive**
  (grade, must-staple, revocation shaper, chain of trust, protocol matrix, handshake
  phase-split, keyLabel/cipherSummary) — **all wired into `tlsFetcher`**.
- **All derivation that can run without persistence is complete (2026-08-05).**
- **No-schema runway: DONE (2026-08-08).** #10 result envelope shipped and the
  `checkConnections` double-probe is deduped — `computeSecurityGrade`,
  `protocolAndCipherScan`, and `checkDeprecatedProtocol` all consume the single
  `offeredProtocols` scan. Only optional frontend presentation glue remains no-schema
  (grade summary/chips, chain fill bars, SAN "+N more", protocol summary headline).
  Everything else needs schema.
- **Extreme-hard / off-track (both already deferred, not in scope):** multi-region
  per-region card (→V12, needs distributed probe infra); CT **unexpected-issuance**
  monitoring (needs an external CT-log follower). No other extreme item is hiding
  as in-scope.
- **Cut/avoided (do not re-suggest):** HSTS + HTTP→HTTPS redirect (validation card),
  `classifyWeakCiphers`, downgrade-24h / renegotiation / session-resumption footers.

## Critical path

```
#7 monitor_type decision  ✅ ┐
#5 tls_state design       ✅ ┼──▶ #8/#9 persistence ──▶ #16 worker dispatch ──▶ #23 API ──▶ #25 frontend wiring
#10 tlsFetcher envelope   ✅ ┘
```

**All three critical-path prereqs (#5, #7, #10) are resolved (2026-08-08) and the
no-schema runway is finished.** **Order changed 2026-08-09:** build + DB-test the
persistence writes (#8/#9) as standalone functions **first**, then **#16 worker
dispatch** wires them into the slow-lane scheduler. HTTP-columns-nullable migration ✅.
Backend-first order applies.

## Schema column decisions (finalized 2026-08-05)

Driven by a card-by-card store-vs-derive walk of `certificates-monitor.tsx`.
Column names **and data types / CHECKs / defaults LOCKED** for all 5 tables
(2026-08-05). **Migrations written + applied 2026-08-05** (5 files in
`apps/backend/migrations/`; verified against the DB). Snapshot cap raised 2 → **10** (prune
is worker logic, not schema).

**Non-obvious type decisions (so the migration writer has them):**
- `tls_checks.negotiated_protocol` + `grade` are **nullable** — both only exist on
  a successful handshake; on a connection error `computeSecurityGrade` never runs
  (verified in `tlsFetcher`). CHECK sets: protocol ∈ {TLSv1.3,TLSv1.2,TLSv1.1,
  TLSv1,SSLv3} (exact Node `getProtocol()` casing); grade ∈ {A+,A,B,C,D,F}.
- `tls_config`: `auto_repin BOOL NOT NULL DEFAULT true`; `min_tls_version TEXT NOT
  NULL DEFAULT 'TLSv1.2'` CHECK ∈ {TLSv1,TLSv1.1,TLSv1.2,TLSv1.3} (no SSLv3);
  `enabled_alerts TEXT[] NOT NULL DEFAULT '{expiring,expired_or_invalid,
  hostname_mismatch,renewal,revocation,weak_config,recovery}'` (pin_broken off by
  default; keys validated app-side via Zod, no DB CHECK on contents); `port INT
  NOT NULL DEFAULT 443` CHECK 1–65535.
- `tls_cert_snapshots`: `must_staple BOOL NOT NULL DEFAULT false`; `ocsp_responder
  TEXT` null; `ct_logs TEXT[] NOT NULL DEFAULT '{}'` stores **raw base64 SCT log
  IDs** — resolved to names at the **API layer** via existing `getCtLogMap`, not
  the frontend.
- `tls_state`: has a paired CHECK `((revocation_status='unknown') =
  (revocation_source IS NULL))`; `caa_present BOOL` disambiguates empty
  `caa_allowed_issuers` (no CAA record vs. permits-none). Full DDL agreed.
- `tls_events`: `monitor_id` is **NOT unique** (append-only log). **Index
  `(monitor_id, occurred_at DESC)`** for the timeline read. `occurred_at` =
  detection time (bounded by check interval — same as incidents/alerts).

- **`tls_checks`** (+5, 1 rename): `dns_time_ms`, `tcp_time_ms`,
  `handshake_time_ms`→`tls_handshake_time_ms`, `negotiated_protocol`, `grade`.
- **`tls_config`** (+6): `pinned_fingerprint`, `pinned_at`, `auto_repin`,
  `min_tls_version`, `enabled_alerts`, `port` (explicit, default 443 — not
  URL-parsed).
- **`tls_cert_snapshots`** (+3): `must_staple`, `ocsp_responder`, `ct_logs`
  (cert-derived, stored because the read path has no cert PEM — see
  [[read-time-data-availability-gap]]).
- **`tls_state`** (NEW, 1:1 overwrite, worker-written): `id`, `monitor_id`,
  `protocol_scan`, `alpn`, `revocation_status`, `revocation_source`,
  `ocsp_next_update`, `revoked_at`, `ocsp_stapled`, `ocsp_staple_produced_at`,
  `caa_allowed_issuers`, `caa_iodef`, `scanned_at`, `updated_at`.
- **`tls_events`** (NEW, append-only, **single source of truth** for history):
  `id`, `monitor_id`, `type`, `occurred_at`, `metadata JSONB`. Enum `type`:
  `first_snapshot` / `renewed` / `protocol_change` / `went_down` / `recovered`
  (grade_change dropped — carried as optional `grade_from`/`grade_to` clause in
  `renewed`/`protocol_change` metadata). Description = code-side template map
  filled from `metadata`; never store the rendered string. Invariant:
  `went_down`/`recovered` write to `tls_events` **and** incidents in the **same
  transaction**. Retention: keep all.

**Coverage verified:** full re-scan of the TLS card — every field maps. `port`
was the only missing field; now added. Per-region card is V12. TCP/DNS monitors
are separate, undesigned schema (later V7 sessions).

## Functions to write

Surfaced during the 2026-08-05 store/derive card walk. Complements the numbered
rows above (some already have a #; the OCSP/CAA probes, validation assembler, FS,
and history-event builder previously had no home here).

**Already written + wired** (do not rewrite): `computeSecurityGrade`,
`chainOfTrust`/`buildChainOfTrust`, `probeProtocols`, `parseMustStaple`,
`computeConnectionLatency`, revocation shaper, `keyLabel`, `cipherSummary`.

### Schema-blocked — need stored rows first

| Function | Blocked on | Card |
|----------|-----------|------|
| `compareRenewal` (#12) | ≥2 snapshots (#6 cap) | Renewal comparison |
| `comparePin` (#11) | `tls_config.pinned_*` | Fingerprint pin |
| `lifetimeHistoryStats` (#13) | raised cap (#6) | Certificate lifetime |
| Handshake p95 / avg / trend (#14) | `tls_checks` rows | Handshake / summary |
| Renewal-detect + append + prune (#9) | snapshot cap (#6) | drives history — see [[tls-renewal-detection-logic]] |
| Grade-change / history-event builder | `tls_checks.grade`, snapshots | Certificate history |

### `tls_state` + new network probe

| Function | Needs |
|----------|-------|
| OCSP query (revocation status + next-update) | `tls_state` OCSP block + OCSP responder call |
| CAA DNS lookup (enforced issuers + iodef) | `tls_state` CAA block + DNS call |

### Pure derive — no schema, writeable anytime

| Function | Card |
|----------|------|
| Forward-secrecy from negotiated cipher suite | Protocol & cipher |
| Validation assembler (5 checks → shape) | Validation (part of #10 envelope) |
| SCT / CT-log parse from embedded SCTs | Revocation |
| Security-grade summary-string builder (frontend) | Security grade |
| `daysRemaining` + `renewals` count | Summary |

## Frontend card ↔ derive-function status (finalized 2026-08-06)

Card-by-card scan of `certificates-monitor.tsx` (the **only** TLS card surface;
dns/tcp/multi-region are separate monitor types). Heading column = the visible
`TlsPanelHeader` title so it's findable in the UI.

**Scope of this table: BACKEND only.** `% done` and "What's missing" track the
derive/persistence work that feeds the card. Frontend rendering/wiring (replace
`mockTlsCertificate`, compose sentences, render chips) is **not** counted here —
it gets a separate frontend table once all backend work is done.

| Card heading (UI) | Component | What's missing | Function(s) to derive | % done |
|---|---|---|---|---|
| "Certificate valid" (status + grade banner) | `TlsStatusSummary` | last-scan time *(renewals + p95 = service SQL, no fn)* | — | 85% |
| "Certificate lifetime" | `TlsLifetimeCard` | — (backend done + tested 2026-08-07; runs once snapshots persist) | ✅ `lifetimeHistoryStats` done + tested | 85% |
| "Handshake" | `TlsHandshakeCard` | — | — | 100% |
| "Handshake latency" | `TlsHandshakeLatencyCard` | SQL query + persistence *(service SQL, no fn)* | ❌ **Not a function** — SQL: `AVG`, `MAX`, **`percentile_cont(ARRAY[0.5,0.75,0.9,0.95,0.99,0.999])`** (full ladder — card now shows a PercentileStrip, updated 2026-08-07), `date_trunc`+`GROUP BY` per window; optional JS gap-fill. DB integration tests | 40% |
| "Security grade" | `TlsSecurityGradeCard` | — (backend done) | ✅ `signals` block done + tested (2026-08-06) | 100% |
| "Leaf certificate" | `TlsLeafCard` | — (backend done; Raw button **dropped** 2026-08-06) | — (all fields assembled in `tlsFetcher`) | 100% |
| "Chain of trust" | `TlsChainCard` | — | — | 100% |
| "Protocol & cipher support" | `TlsProtocolCipherCard` | — | — | 100% |
| "Certificate served per region" | `TlsRegionCard` | deferred V12 (multi-region infra) | — | out of scope |
| "Validation" | `TlsValidationCard` | — | — | 100% |
| "Revocation, CT & issuance policy" | `TlsRevocationCard` | persistence only *(OCSP/CRL/SCT/CAA all derived; unexpected-issuance = deferred CT follower)* | ✅ `computeCaa` done + tested 2026-08-07 | 85% |
| "Certificate history" | `TlsHistoryCard` | — (backend done + tested 2026-08-07; runs once `tls_events` persist) | ✅ `computeCertificateHistory` (+ `computeTone`) done + tested | 85% |
| "Latest renewal comparison" | `TlsRenewalComparisonCard` | — (backend done + tested 2026-08-06; runs once ≥2 snapshots persist) | ✅ `computeRenewalComparison` + `compareSan` done + tested | 100% |
| "Fingerprint pin" | `TlsPinningCard` | auto-repin write (deferred to #9/#11 worker) | ✅ `computeComparePin` (status) done + tested 2026-08-06 | 85% |
| "Connection & schedule" | `TlsConfigCard` | — (backend done + tested 2026-08-06) | ✅ `connectionInfo` fixed (return + field mapping) + tested | 100% |
| "Alert rules" | `TlsAlertRulesCard` | reads config, not derive | none (needs config API) | presentation |

### Functions still to derive (consolidated)

| Function | Serves card | Blocked on |
|---|---|---|
| ~~`lifetimeHistoryStats`~~ | Certificate lifetime | ✅ **Done + tested 2026-08-07**; runs once snapshots persist |
| ~~avg / p95 / trend~~ | Handshake latency, banner | ❌ **Not a function** — service SQL (`AVG` / `percentile_cont(0.95)` / `date_trunc`+`GROUP BY` per window over `tls_checks`); optional JS gap-fill; DB integration tests |
| ~~`comparePin` (status)~~ | Fingerprint pin | ✅ **Done + tested 2026-08-06** (`computeComparePin`); auto-repin write deferred to #9/#11 |
| ~~renewals counter~~ | Certificate valid (banner) | ❌ **Not a function** — service SQL `COUNT(*) WHERE type='renewed' AND occurred_at >= now-windowDays` (default 365d) over `tls_events` |
| ~~history-event builder~~ | Certificate history | ✅ **Done + tested 2026-08-07** (`computeCertificateHistory` + `computeTone`); runs once `tls_events` persist. Per-type `metadata` shapes locked at write-side (#17) |
| ~~OCSP query probe~~ | Revocation | ✅ **Already written** (`getOcspStatus`, `ocspParset.ts`) — persist to `tls_state` still pending |
| ~~CAA DNS lookup~~ | Revocation | ✅ **Done + tested 2026-08-07** (`computeCaa`, injectable resolver); persist to `tls_state` pending — amend `caa_iodef → TEXT[]` |
| ~~SCT / CT-log parse~~ | Revocation | ✅ **Already written** (`parseSCTExtensions` + `getCtLogMap`) — persist pending |
| ~~grade summary / chip flags~~ | Security grade + banner | ✅ **Done + tested 2026-08-06** (`signals` block in `computeSecurityGrade`) |
| ~~fix `connectionInfo`~~ | Connection & schedule | ✅ **Done + tested 2026-08-06** (return + field mapping + casing) |

**Deferred (not counted as missing functions):** per-region card (V12),
"unexpected issuance" CT-log follower. **Leaf "Raw" fetch: DROPPED 2026-08-06** —
no PEM endpoint; remove the Raw button during frontend wiring.

**Drift corrected from earlier rows:** `computeRenewalComparison` (#12) and
`getForwardSecrecy` are **already written** — reclassify from ❌ to written
(renewal comparison is runtime-blocked on ≥2 snapshots, not missing).

### Overall

- Derive functions **~64% complete** across the 14 scored cards (region +
  alert-rules excluded).
- Fully backed (100%): Handshake, Chain of trust, Protocol & cipher support,
  Validation. Leaf is 95% (only the Raw button).
- Writeable now, no schema: SCT/CT parse, grade summary/chip flags,
  `connectionInfo` fix — so "no-persistence derive" is **~90%, not 100%**.
- Everything else is persistence-gated on the snapshot cap (#6), `tls_checks`,
  `tls_state`, and `tls_events`.

## Working agreement — test-per-function

For every derive function from the "still to derive" list, in order:

1. **Dev writes the function.**
2. **Claude writes the test file** for it — Arrange-Act-Assert cases covering the
   happy path, boundaries, empty/error inputs, and important side effects. Tests
   assert correct behavior only; no spoilers on which case fails until the dev
   asks (see [[test-first-no-spoilers]]).
3. **Run the tests. All cases must pass** before moving on.
4. Only then start the **next function**. Do not batch-write functions ahead of
   their tests.

## DB integration test harness (sketch — for #30/#31)

Pure functions are unit-tested with in-memory fixtures (no DB). **SQL queries and
persistence writes must be tested against a real Postgres** — mocking the DB tests
the mock, not `percentile_cont`/`date_trunc`/`WHERE`/transaction behavior.

**Setup**
- **Separate test Postgres** (reuse the containerized PG18; a dedicated `*_test`
  database, or Testcontainers for an ephemeral one per run).
- **Run the same migrations** on it so the schema matches prod exactly.

**Isolation between tests**
- **Transaction rollback per test** (preferred): `BEGIN` before, `ROLLBACK` after →
  every test starts clean, no cleanup, fast. (Fallback: `TRUNCATE` between tests.)

**Seed factories** (same idea as the `mk()` unit fixtures, but they INSERT rows):
- `seedMonitor({ type: "tls" })` → returns monitor id
- `seedTlsChecks(monitorId, [{ handshakeMs, at }, ...])`
- `seedTlsEvents(monitorId, [{ type, at }, ...])`
- `seedSnapshots(monitorId, [{ fingerprint, valid_from, valid_to, first_seen_at }, ...])`
Defaults sensible, overridable per test → you insert KNOWN rows so you know the
expected answer.

**Assert against hand-computed values**
- **Percentile ladder:** seed handshake times `[80,84,90,128]` → run query → assert
  `p50/p95/max/avg` equal the hand math; edge cases: empty window → nulls, single
  row → p50 = that value.
- **Renewals count:** seed `tls_events` with timestamps straddling the 365d window →
  assert count; test inclusive boundary + empty.

**Persistence writes (#8/#9):** call the write fn, then query the table back and
assert — "append snapshot only on fingerprint change", "prune keeps exactly 10",
"went_down/recovered write to `tls_events` AND incidents in the same transaction".

**Order:** stand this up when persistence (#8/#9) starts — the write fns and the
2 SQL queries are its first customers.

## Pipeline / worker architecture (decided 2026-08-07)

Design decisions for #16 (worker dispatch) and the create flow. Existing infra:
3 queue/worker pairs — `email-verification` (OTP), `alert-email` (incident alerts),
`monitor-checks` (monitoring, `urlCheckWorker`, concurrency 10, lockDuration 30s,
attempts 1). Scheduler cron `*/30 * * * * *` (30s) enqueues due monitors.

**Queue granularity — PER-TYPE (chosen).** One queue per monitor type
(`http-checks`, `tcp-checks`, `tls-checks`, `dns-checks`), not profile-grouped and
NOT per-monitor (per-monitor = anti-pattern: blocking-connection + Redis-key
explosion; model is **few queues, many jobs**, `monitor_id` in payload). Chosen for
per-type failure isolation, debugging, logging, and independent scaling as the
codebase grows.
- **Avoid 4× boilerplate:** build lanes from a shared `createCheckQueue(config)` +
  `createCheckWorker(config)` factory; lanes differ only in queue name, processor
  (fetcher), concurrency, lockDuration, interval bounds, retry/limiter.

**Two schedulers by profile.** Fast lane (HTTP+TCP, min interval 1 min) keeps the
**30s** cron. Slow lane (TLS+DNS, hours-scale) gets a **coarse cron (2–5 min)** — a
30s tick wastefully re-scans hour-scale monitors ~120×/hr; jitter of a few minutes
is irrelevant for certs/DNS. Rule: tick ≪ smallest interval served.

**Interval options — slow lane (TLS, DNS):** `1h / 3h / 6h / 12h / 24h`, default
**12h**, floor **1h**. TCP stays FAST lane (1–60 min like HTTP) — it's uptime-style.
Rationale: certs renew ~90d, DNS rarely changes; even 24h interval adds ≤24h latency
vs day-scale expiry thresholds.

**Worker scaling model.** Checks are I/O-bound → **1 worker process per lane, scale
via `concurrency`** (not process count). Slow lane: low concurrency (3–5) so we don't
hammer OCSP/CAA. More worker *processes* only for CPU saturation (checks aren't
CPU-heavy) or HA — BullMQ competing-consumers makes that a deploy change, no rewrite.
Workers already run in a **separate process from the API** (correct — background work
must not block request handling). CPU-bound work would need its own process; I/O-bound
does not.

## TLS create-form field map + schema decision (2026-08-07)

New-monitor: TLS/TCP/DNS selection **opened** (`comingSoon` removed in
`new_monitor/data.ts`); "SSL Cert" → **"TLS Cert"** (data.ts, types.ts, monitors-page
columns badge, edit-monitor-modal tab; SSLv3 protocol name kept as-is).

**TLS create form fields:**
- **Common (→ `monitor`):** name, host (→ `url`, bare hostname), interval_seconds
  (hours-scale), monitor_type=`tls`, connection timeout (→ `request_timeout_ms`),
  failure_threshold, recovery_threshold.
- **TLS-specific (→ `tls_config`):** port (443), min_tls_version (TLSv1.2),
  warning_threshold_days (30), expiry_alert_thresholds ({1,7,14,30}). Fingerprint
  pin/auto_repin **deferred to the detail page** (pin after observing the live cert).
  **`enabled_alerts` NOT in the create form** — uses its DB default (7 rules); alert
  management belongs on the edit/settings page (TBD). **Interval options = hours-scale**
  (`tlsCheckIntervals` 1h/3h/6h/12h/24h) in the design.
- **NOT sent** (HTTP-only): statusCodes, httpMethod, requestBody/type, contentType,
  responseTimeThresholdMS.

**DB coverage:** all TLS fields have columns. Host reuses `monitor.url` (no dedicated
`host` column — bare hostname). Port in `tls_config.port`. Timeout reuses
`request_timeout_ms`.

**Schema decision — HTTP columns NULLABLE ✅ DONE (migration written 2026-08-08,
`1786130525765_change-monitor-table-datatype.ts`):** `http_method`, `content_type`,
`request_body_type`, `status_code`, `response_time_threshold_ms` had `NOT NULL` on the
shared `monitor` table → a TLS insert would violate NOT NULL. Fixed via **one migration
dropping NOT NULL** on those 5 (`up` = `DROP NOT NULL`, `down` = `SET NOT NULL`) — honest
"N/A for non-HTTP" over fake inert values. **Rejected:** (a) inject inert defaults, (b) separate TLS table (TLS
already isolated in `tls_config`), (c) extract `http_config` now — that's ~11 files /
68 refs (create+update writes → txn, ~4 read queries → JOIN, worker, 3 type files) +
a data backfill on working V1–V6 code; **deferred as tech-debt**, do when the monitor
schema is next touched.

**Order:** backend-first — #21 Zod discriminated-union schema (contract) → #22
create/edit endpoints → pipeline → frontend form last conforms to the contract.
Frontend TLS form *design* built ahead as a reference for the payload shape.
