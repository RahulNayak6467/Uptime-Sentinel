// Test scaffold for computeCertificateHistory().
//
// Contract:
//   empty       → []
//   each row    → { id, type, occurred_at, tone, metadata } passed through
//   tone        → renewed/recovered = positive, went_down = negative,
//                 protocol_change/first_snapshot = neutral
//   order       → preserved (input already newest-first from the service)
//   occurred_at → same instant preserved (Date or ISO string both accepted)
//
// Run: pnpm exec tsx src/checkers/tls/test/certificateHistoryTest.ts

import { computeCertificateHistory } from "../deriveTls";
import { CertHistoryInfo } from "../tls.types";

let passed = 0;
let failed = 0;
const eq = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
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

const events: CertHistoryInfo[] = [
  { id: "e1", type: "renewed",         occurred_at: new Date("2026-05-16T04:12:00Z"), metadata: { fingerprint: "A1:85:02:C7", serial: "04" } },
  { id: "e2", type: "recovered",       occurred_at: new Date("2026-04-21T02:10:00Z"), metadata: {} },
  { id: "e3", type: "protocol_change", occurred_at: new Date("2026-04-02T11:26:00Z"), metadata: { grade_from: "A", grade_to: "A+" } },
  { id: "e4", type: "went_down",       occurred_at: new Date("2026-03-20T08:00:00Z"), metadata: { reason: "expired" } },
  { id: "e5", type: "first_snapshot",  occurred_at: new Date("2025-08-19T00:03:00Z"), metadata: {} },
];

/* ---------------- empty ---------------- */
{
  const r = computeCertificateHistory([]);
  eq("empty → is array", Array.isArray(r), true);
  eq("empty → length 0", Array.isArray(r) ? r.length : -1, 0);
}

/* ---------------- returns array, right length ---------------- */
{
  const r = computeCertificateHistory(events) as any;
  eq("non-empty → is array", Array.isArray(r), true);
  eq("non-empty → length 5", Array.isArray(r) ? r.length : -1, 5);
}

/* ---------------- pass-through (row 0) ---------------- */
{
  const r = computeCertificateHistory(events) as any;
  eq("row0 id", r?.[0]?.id, "e1");
  eq("row0 type", r?.[0]?.type, "renewed");
  eq("row0 metadata", r?.[0]?.metadata, { fingerprint: "A1:85:02:C7", serial: "04" });
  eq("row0 occurred_at instant", new Date(r?.[0]?.occurred_at).getTime(), events[0].occurred_at.getTime());
}

/* ---------------- tone map (all 5 types) ---------------- */
{
  const r = computeCertificateHistory(events) as any;
  eq("renewed → positive", r?.[0]?.tone, "positive");
  eq("recovered → positive", r?.[1]?.tone, "positive");
  eq("protocol_change → neutral", r?.[2]?.tone, "neutral");
  eq("went_down → negative", r?.[3]?.tone, "negative");
  eq("first_snapshot → neutral", r?.[4]?.tone, "neutral");
}

/* ---------------- order preserved ---------------- */
{
  const r = computeCertificateHistory(events) as any;
  eq("order row0 = e1", r?.[0]?.id, "e1");
  eq("order row2 = e3", r?.[2]?.id, "e3");
  eq("order row4 = e5", r?.[4]?.id, "e5");
}

console.log(`\n${passed} passed, ${failed} failed`);
