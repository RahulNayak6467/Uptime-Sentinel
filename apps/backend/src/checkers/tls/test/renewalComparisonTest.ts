// Test scaffold for computeRenewalComparison() + compareSan().
//
// Asserts the LOCKED return contract:
//   - < 2 snapshots  -> null
//   - previous/current: issuer, expiresAt (Date), key (keyLabel), fingerprint
//   - changes[]: uniform { field, detail }, one per field:
//       Expiry             -> "Extended by {n} days" / "Shortened by {n} days" / "Unchanged"
//       Issuer             -> "{prev} -> {curr}" (full names) / "Unchanged {issuer}"
//       key and signature  -> "{prev} -> {curr}" / "Unchanged {key}"
//       san coverage       -> includes "{a} added"/"{r} removed" and "{total} names" (total = current SAN count)
//   - snapshots[0] = current, snapshots[1] = previous
//
// Run: pnpm exec tsx src/checkers/tls/test/renewalComparisonTest.ts

import { computeRenewalComparison, compareSan, keyLabel } from "../deriveTls";
import { TlsCertRenewal } from "../tls.types";

/* ---------------- tiny assert harness ---------------- */
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

/* ---------------- fixtures ---------------- */
const mk = (over: Partial<TlsCertRenewal>): TlsCertRenewal => ({
  fingerprint_sha256: "FP:DEFAULT",
  serial_number: "01",
  issuer: "Let's Encrypt R11",
  valid_from: new Date("2026-05-16T00:00:00Z"),
  valid_to: new Date("2026-08-14T00:00:00Z"),
  first_seen_at: new Date("2026-05-16T04:12:00Z"),
  asymmetric_key_type: "ec",
  nist_curve: "prime256v1",
  key_bits: 256,
  san: ["a.io", "b.io"],
  ...over,
});

const ecdsa256 = keyLabel("ec", "prime256v1", 256); // "ECDSA prime256v1 · 256-bit"
const ecdsa384 = keyLabel("ec", "secp384r1", 384);

const detailOf = (r: NonNullable<ReturnType<typeof computeRenewalComparison>>, field: string): string =>
  r.changes.find((c) => c.field === field)?.detail ?? "<<missing>>";

/* ================================================================== */
/* compareSan — Set-based added/removed counts                        */
/* ================================================================== */
{
  const r = compareSan(["a.io", "b.io"], ["a.io", "b.io", "c.io"]); // c added
  eq("SAN added → namesAdded 1", r.namesAdded, 1);
  eq("SAN added → namesRemoved 0", r.namesRemoved, 0);
}
{
  const r = compareSan(["a.io", "b.io", "c.io"], ["a.io", "b.io"]); // c removed
  eq("SAN removed → namesAdded 0", r.namesAdded, 0);
  eq("SAN removed → namesRemoved 1", r.namesRemoved, 1);
}
{
  const r = compareSan(["a.io", "b.io"], ["a.io", "c.io"]); // b→c swap
  eq("SAN swap → namesAdded 1", r.namesAdded, 1);
  eq("SAN swap → namesRemoved 1", r.namesRemoved, 1);
}
{
  const r = compareSan(["a.io", "b.io"], ["a.io", "b.io"]); // identical
  eq("SAN identical → namesAdded 0", r.namesAdded, 0);
  eq("SAN identical → namesRemoved 0", r.namesRemoved, 0);
}

/* ================================================================== */
/* null guards                                                        */
/* ================================================================== */
eq("0 snapshots → null", computeRenewalComparison([]), null);
eq("1 snapshot → null", computeRenewalComparison([mk({})]), null);

/* ================================================================== */
/* mapping + change details: current = [0], previous = [1]           */
/* ================================================================== */
{
  const current = mk({ fingerprint_sha256: "CUR:FP", issuer: "Let's Encrypt R11", san: ["a.io", "b.io", "c.io"] });
  const previous = mk({
    fingerprint_sha256: "PREV:FP",
    issuer: "Let's Encrypt R10",
    valid_to: new Date("2026-05-22T00:00:00Z"), // 84 days before current
    san: ["a.io", "b.io"],
  });
  const r = computeRenewalComparison([current, previous])!;

  eq("map current.issuer", r.current.issuer, "Let's Encrypt R11");
  eq("map previous.issuer", r.previous.issuer, "Let's Encrypt R10");
  eq("map current.fingerprint", r.current.fingerprint, "CUR:FP");
  eq("map previous.fingerprint", r.previous.fingerprint, "PREV:FP");
  eq("map current.key", r.current.key, ecdsa256);
  eq("map previous.key", r.previous.key, ecdsa256);
  eq("detectedAt = current.first_seen_at",
    new Date(r.detectedAt as unknown as string).getTime(), current.first_seen_at.getTime());
  eq("changes has 4 entries", r.changes.length, 4);

  eq("Expiry extended", detailOf(r, "Expiry"), "Extended by 84 days");
  eq("Issuer changed shows full names", detailOf(r, "Issuer"), "Let's Encrypt R10 -> Let's Encrypt R11");
  eq("Key unchanged", detailOf(r, "key and signature"), `Unchanged ${ecdsa256}`);
  eq("SAN 1 added, total = current count 3", detailOf(r, "san coverage"), "1 added 3 names");
}

/* ---------------- Expiry: shortened ---------------- */
{
  const current = mk({ valid_to: new Date("2026-08-14T00:00:00Z") });
  const previous = mk({ valid_to: new Date("2026-09-13T00:00:00Z") }); // current expires 30d earlier
  const r = computeRenewalComparison([current, previous])!;
  eq("Expiry shortened", detailOf(r, "Expiry"), "Shortened by 30 days");
}

/* ---------------- Expiry: unchanged ---------------- */
{
  const current = mk({ valid_to: new Date("2026-08-14T00:00:00Z") });
  const previous = mk({ valid_to: new Date("2026-08-14T00:00:00Z") });
  const r = computeRenewalComparison([current, previous])!;
  eq("Expiry unchanged", detailOf(r, "Expiry"), "Unchanged");
}

/* ---------------- Issuer: unchanged ---------------- */
{
  const current = mk({ issuer: "Let's Encrypt R11" });
  const previous = mk({ issuer: "Let's Encrypt R11" });
  const r = computeRenewalComparison([current, previous])!;
  eq("Issuer unchanged", detailOf(r, "Issuer"), "Unchanged Let's Encrypt R11");
}

/* ---------------- Key: changed (P-256 -> P-384) ---------------- */
{
  const current = mk({ asymmetric_key_type: "ec", nist_curve: "secp384r1", key_bits: 384 });
  const previous = mk({ asymmetric_key_type: "ec", nist_curve: "prime256v1", key_bits: 256 });
  const r = computeRenewalComparison([current, previous])!;
  eq("Key changed shows arrow", detailOf(r, "key and signature"), `${ecdsa256} -> ${ecdsa384}`);
}

/* ---------------- summary ---------------- */
console.log(`\n${passed} passed, ${failed} failed`);
