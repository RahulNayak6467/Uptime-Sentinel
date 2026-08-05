# V7 — TLS Master Checklist

> Part of the [StatusForge roadmap](../../ROADMAP.md). Reconciles the original
> 23-item TLS task list with later enrichments (raised snapshot cap, `tls_state`,
> security-grade derivations, per-region cards). Items marked **★** are additions
> beyond the original 23-row scope.

**Status:** In progress — 5 of 32 done.

## Checklist

| # | Bucket | Item | Status | Depends on / notes |
|---|---|---|---|---|
| 1 | Schema | Monitor `type` column + backfill `'http'` | ✅ Done | `ssl`→`tls` migrated; no `ssl` rows existed |
| 2 | Schema | `tls_config` columns (warning_threshold_days, expiry_alert_thresholds) | ✅ Done | Migrated |
| 3 | Schema | `tls_cert_snapshots` table | ✅ Done | Migrated; `chain jsonb` kept |
| 4 | Schema | `tls_checks` table (per-check + timing) | ✅ Done | Migrated |
| ★5 | Schema | **`tls_state` table** (OCSP/CRL/CT/protocol-scan, 1:1, overwrite) | ❌ Left | Columns not yet listed — **GATE** |
| ★6 | Schema | **Raise snapshot cap** (cap-2 → bounded ~10–20) | ❌ Left | Unblocks #13, #14 |
| ★7 | Decision | **monitor_type semantics** (add-on vs. standalone non-HTTP) | ❌ Left | Gates #16 worker dispatch |
| 8 | Persistence | Store check results + handshake timing → `tls_checks` | ❌ Left | Needs #7, #16 |
| 9 | Persistence | Append cert snapshot on fingerprint/serial change (+prune) | ❌ Left | Needs #6, #16 |
| ★10 | Backend | **`tlsFetcher` result envelope** (`status`/`certificate`/`error`) | ❌ Left | Fix 4 tsc errors; prereq for #16, #23 |
| 11 | Derive | Fingerprint pinning — `comparePin` | ❌ Left | Pin is a setting, not a snapshot field |
| 12 | Derive | Renewal comparison — `compareRenewal` | ❌ Left | |
| 13 | Derive | Snapshot & renewal history — `lifetimeHistoryStats` | ❌ Left | Needs #6 |
| 14 | Derive | Handshake trend / avg / p95 | 🟡 Partial | DNS/TCP/TLS **phase split done + wired** (`computeConnectionLatency`); avg/p95 trend needs `tls_checks` |
| 14b | Derive | **Chain of trust** (`chainOfTrust`/`buildChainOfTrust`) | ✅ Done + wired | Recurse sent chain, named status-only root; 2026-08-05 |
| 14c | Derive | **Protocol & cipher matrix** (per-version suite/status/rating + ALPN) | ✅ Done + wired | `probeProtocols` returns rating; frontend mock updated; 2026-08-05 |
| ★15 | Derive | **`computeSecurityGrade`, `parseMustStaple`, revocation shaper** | ✅ Done + wired | + `keyLabel` EC-bits + `cipherSummary`; all Group A wired into `tlsFetcher`. `classifyWeakCiphers` **dropped** (`rating` covers it) |
| 16 | Pipeline | Worker dispatch by monitor type → `tlsFetcher` on interval | ❌ Left | **Gated on #5, #7, #10** |
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
| 29 | Tests | Derive unit tests (test tables → real assertions) | ❌ Left | |
| 30 | Tests | Checker integration tests (envelope + persistence) | ❌ Left | |
| ★31 | Tests | **DB integration tests** for TLS SQL queries | ❌ Left | Discuss after monitors review |
| 32 | Deferred | Cipher-order finding (two-connection probe) | ⏸️ Deferred | High effort, moot on TLS 1.3 |

## Summary

- **Done:** base schema (1–4) + frontend redesign (24) + **all no-persistence derive**
  (grade, must-staple, revocation shaper, chain of trust, protocol matrix, handshake
  phase-split, keyLabel/cipherSummary) — **all wired into `tlsFetcher`**.
- **All derivation that can run without persistence is complete (2026-08-05).**
- **No-schema runway left:** only 2 backend cleanups — **#10 fix build + result
  envelope** (tsc errors, remove console.logs) and **dedupe `checkConnections`**
  double-probe. Plus frontend presentation glue (grade summary/chips, chain fill
  bars, SAN "+N more", protocol summary headline). Everything else needs schema.
- **Extreme-hard / off-track (both already deferred, not in scope):** multi-region
  per-region card (→V12, needs distributed probe infra); CT **unexpected-issuance**
  monitoring (needs an external CT-log follower). No other extreme item is hiding
  as in-scope.
- **Cut/avoided (do not re-suggest):** HSTS + HTTP→HTTPS redirect (validation card),
  `classifyWeakCiphers`, downgrade-24h / renegotiation / session-resumption footers.

## Critical path

```
#7 monitor_type decision  ┐
#5 tls_state design       ┼──▶ #16 worker dispatch ──▶ #8/#9 persistence ──▶ #23 API ──▶ #25 frontend wiring
#10 tlsFetcher envelope   ┘
```

Everything downstream is blocked until #5, #7, and #10 are resolved. **#7 is the
cheapest and unblocks the most** — it is a design decision, not code.

## Schema column decisions (finalized 2026-08-05)

Driven by a card-by-card store-vs-derive walk of `certificates-monitor.tsx`.
Column names **and data types / CHECKs / defaults LOCKED** for all 5 tables
(2026-08-05). Migrations not yet written. Snapshot cap raised 2 → **10** (prune
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
