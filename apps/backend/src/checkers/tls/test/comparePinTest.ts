// Test scaffold for computeComparePin().
//
// Locked contract:
//   status:  null when no pin set; "match"/"broken" from a normalized compare
//   isPinned: whether a pin is CONFIGURED (pinnedFingerPrint != null) — independent of match
//   normalize before compare (strip ":" + uppercase) but return ORIGINAL strings for display
//   lastVerified / autoRepin / fingerprints pass straight through
//
// Signature: computeComparePin(currentFingerPrint, pinnedFingerPrint, lastVerified, autoRepin)
// Run: pnpm exec tsx src/checkers/tls/test/comparePinTest.ts

import { computeComparePin } from "../deriveTls";

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

const FP = "A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90";
const FP_OTHER = "44:93:0C:29:7A:1E:B8:60:D5:3F:9C:22:41:8D:6B:0A";
const FP_LOWER_NOCOLON = "a1b2c3d4e5f60718293a4b5c6d7e8f90"; // == FP once normalized
const t = new Date("2026-08-06T12:00:00Z");

/* ---------------- match ---------------- */
{
  const r = computeComparePin(FP, FP, t, true);
  eq("match → status", r.status, "match");
  eq("match → isPinned true", r.isPinned, true);
  eq("match → pinnedFingerPrint passthrough", r.pinnedFingerPrint, FP);
  eq("match → currentFingerPrint passthrough", r.currentFingerPrint, FP);
  eq("match → autoRepin passthrough", r.autoRepin, true);
  eq("match → lastVerified passthrough", new Date(r.lastVerified as Date).getTime(), t.getTime());
}

/* ---------------- broken (pin set, does not match) ---------------- */
{
  const r = computeComparePin(FP, FP_OTHER, t, true);
  eq("broken → status", r.status, "broken");
  eq("broken → isPinned true (pin IS configured)", r.isPinned, true);
  eq("broken → pinnedFingerPrint passthrough", r.pinnedFingerPrint, FP_OTHER);
}

/* ---------------- unpinned (no pin) ---------------- */
{
  const r = computeComparePin(FP, null, t, false);
  eq("unpinned → status null", r.status, null);
  eq("unpinned → isPinned false", r.isPinned, false);
  eq("unpinned → pinnedFingerPrint null", r.pinnedFingerPrint, null);
  eq("unpinned → autoRepin passthrough", r.autoRepin, false);
}

/* ---------------- normalized match (different format, same value) ---------------- */
{
  const r = computeComparePin(FP, FP_LOWER_NOCOLON, t, true);
  eq("normalized → status match", r.status, "match");
  eq("normalized → isPinned true", r.isPinned, true);
  eq("normalized → pinnedFingerPrint keeps ORIGINAL format", r.pinnedFingerPrint, FP_LOWER_NOCOLON);
  eq("normalized → currentFingerPrint keeps ORIGINAL format", r.currentFingerPrint, FP);
}

console.log(`\n${passed} passed, ${failed} failed`);
