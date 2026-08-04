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
