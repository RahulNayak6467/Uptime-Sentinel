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
| 14 | Derive | Handshake trend / avg / p95 | ❌ Left | Aggregate over `tls_checks` |
| ★15 | Derive | **`computeSecurityGrade`, `parseMustStaple`, revocation shaper** | ✅ Done | Group A complete + tests; `keyLabel` EC-bits + `cipherSummary` also done. `classifyWeakCiphers` **dropped** (misleading on negotiated-only data → rides with #2 matrix) |
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

- **Done:** 6 of 32 (base schema + frontend redesign + all Group A derive fns)
- **Left:** 24
- **Deferred / V12:** 2 (cipher-order, per-region)
- **Group A derive complete** (2026-08-03): computeSecurityGrade, parseMustStaple,
  revocation shaper, keyLabel/cipherSummary. Only no-persistence derive fn left is
  #6 chain-of-trust (dev revisiting exclude-root first). Rest gated on #5/#7 schema.

## Critical path

```
#7 monitor_type decision  ┐
#5 tls_state design       ┼──▶ #16 worker dispatch ──▶ #8/#9 persistence ──▶ #23 API ──▶ #25 frontend wiring
#10 tlsFetcher envelope   ┘
```

Everything downstream is blocked until #5, #7, and #10 are resolved. **#7 is the
cheapest and unblocks the most** — it is a design decision, not code.
