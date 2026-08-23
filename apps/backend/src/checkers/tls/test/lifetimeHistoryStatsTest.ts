// Test scaffold for lifetimeHistoryStats().
//
// Input is pre-sorted NEWEST-FIRST (current at index 0) — sorting happens in the
// service, not the function.
//
// Contract:
//   empty          → null
//   certs[]        → one per snapshot, current = the index-0 (newest) cert
//   currentValidFrom/To → from index 0
//   avgRenewalLead → mean of (older.valid_to − newer.first_seen_at) in days,
//                    SIGNED (late renewal stays negative), rounded; null if < 2 snapshots
//
// Run: pnpm exec tsx src/checkers/tls/test/lifetimeHistoryStatsTest.ts

import { lifetimeHistoryStats } from "../deriveTls";
import { CertLifetimeStats } from "../tls.types";

let passed = 0;
let failed = 0;
const eq = (name: string, actual: unknown, expected: unknown) => {
  const ok = actual === expected;
  if (ok) {
    passed++;
    console.log(`PASS ${name}`);
  } else {
    failed++;
    console.log(`FAIL ${name}`);
    console.log(`     output  : ${JSON.stringify(actual)}`);
    console.log(`     expected: ${JSON.stringify(expected)}`);
  }
};

const mk = (over: Partial<CertLifetimeStats>): CertLifetimeStats => ({
  fingerprint_sha256: "FP",
  valid_from: new Date("2026-05-16T00:00:00Z"),
  valid_to: new Date("2026-08-14T00:00:00Z"),
  first_seen_at: new Date("2026-05-16T00:00:00Z"),
  ...over,
});

// newest-first
const cur = mk({ fingerprint_sha256: "A1", valid_from: new Date("2026-05-16T00:00:00Z"), valid_to: new Date("2026-08-14T00:00:00Z"), first_seen_at: new Date("2026-05-16T00:00:00Z") });
const prev = mk({ fingerprint_sha256: "77", valid_from: new Date("2026-02-15T00:00:00Z"), valid_to: new Date("2026-05-22T00:00:00Z"), first_seen_at: new Date("2026-02-15T00:00:00Z") });
const old = mk({ fingerprint_sha256: "C2", valid_from: new Date("2025-11-16T00:00:00Z"), valid_to: new Date("2026-02-20T00:00:00Z"), first_seen_at: new Date("2025-11-16T00:00:00Z") });

/* ---------------- 3 snapshots ---------------- */
{
  const r = lifetimeHistoryStats([cur, prev, old])!;
  eq("3 → certs length 3", r.certs.length, 3);
  eq("3 → certs[0] current true", r.certs[0].current, true);
  eq("3 → certs[1] current false", r.certs[1].current, false);
  eq("3 → certs[2] current false", r.certs[2].current, false);
  eq("3 → certs[0] fingerprint", r.certs[0].fingerprint, "A1");
  eq("3 → certs[0] seenAt", r.certs[0].seenAt.getTime(), cur.first_seen_at.getTime());
  eq("3 → currentValidFrom", r.currentValidFrom.getTime(), cur.valid_from.getTime());
  eq("3 → currentValidTo", r.currentValidTo.getTime(), cur.valid_to.getTime());
  // leads: old→prev = Feb20 − Feb15 = 5 ; prev→cur = May22 − May16 = 6 ; avg = 5.5 → 6
  eq("3 → avgRenewalLead 6", r.avgRenewalLead, 6);
}

/* ---------------- 2 snapshots ---------------- */
{
  const r = lifetimeHistoryStats([cur, prev])!;
  // prev.valid_to May22 − cur.first_seen May16 = 6
  eq("2 → avgRenewalLead 6", r.avgRenewalLead, 6);
}

/* ---------------- late renewal (signed, not abs) ---------------- */
{
  const curLate = mk({ fingerprint_sha256: "A1", valid_to: new Date("2026-08-14T00:00:00Z"), first_seen_at: new Date("2026-05-25T00:00:00Z") });
  // prev.valid_to May22 − cur.first_seen May25 = −3
  const r = lifetimeHistoryStats([curLate, prev])!;
  eq("late → avgRenewalLead −3 (signed)", r.avgRenewalLead, -3);
}

/* ---------------- single snapshot ---------------- */
{
  const r = lifetimeHistoryStats([cur])!;
  eq("1 → certs length 1", r.certs.length, 1);
  eq("1 → certs[0] current true", r.certs[0].current, true);
  eq("1 → avgRenewalLead null", r.avgRenewalLead, null);
}

/* ---------------- empty ---------------- */
eq("empty → null", lifetimeHistoryStats([]), null);

console.log(`\n${passed} passed, ${failed} failed`);
