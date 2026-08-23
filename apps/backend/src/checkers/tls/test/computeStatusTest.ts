// Test scaffold for computeStatus().
//
// Locked contract (precedence, top to bottom):
//   1. isExpired            -> "Expired"
//   2. !hostnameCheck | self-signed (subjectCN === issuerCN) | !trusted | revoked -> "Invalid"
//   3. daysRemaining <= warningThresholdDays -> "Expiring"
//   4. otherwise -> "Valid"
//
// Revocation is SOFT-FAIL:
//   "revoked"          -> forces "Invalid"
//   "good" / "unknown" -> do NOT influence status; fall through to the other checks
//   (so "unknown" never upgrades a bad cert to Valid, and "good"/"unknown" never
//    downgrade an otherwise-fine cert to Invalid)
//
// Signature: computeStatus(hostnameCheck, isExpired, subjectCN, issuerCN,
//                          isCertificateTrusted, endDate, warningThresholdDays, revocationStatus)
// Run: pnpm exec tsx src/checkers/tls/test/computeStatusTest.ts

import { computeStatus } from "../deriveTls";

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

const SUBJECT = "example.com";
const ISSUER = "Let's Encrypt R11"; // != subject, so not self-signed
const WARN = 30;
const FAR = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // ~90 days out  -> not expiring
const NEAR = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // ~10 days out -> within warning

/* ---------------- Valid (all clear, revocation good) ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, FAR, WARN, "good");
  eq("valid: all clear + good -> Valid", r, "Valid");
}

/* ---------------- Expiring ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, NEAR, WARN, "good");
  eq("expiring: within warning window -> Expiring", r, "Expiring");
}

/* ---------------- Expired ---------------- */
{
  const r = computeStatus(true, true, SUBJECT, ISSUER, true, FAR, WARN, "good");
  eq("expired: isExpired -> Expired", r, "Expired");
}

/* ---------------- Invalid: hostname mismatch ---------------- */
{
  const r = computeStatus(false, false, SUBJECT, ISSUER, true, FAR, WARN, "good");
  eq("invalid: hostname mismatch -> Invalid", r, "Invalid");
}

/* ---------------- Invalid: untrusted chain ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, false, FAR, WARN, "good");
  eq("invalid: untrusted -> Invalid", r, "Invalid");
}

/* ---------------- Invalid: self-signed (subjectCN === issuerCN) ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, SUBJECT, true, FAR, WARN, "good");
  eq("invalid: self-signed -> Invalid", r, "Invalid");
}

/* ---------------- Revocation: revoked forces Invalid ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, FAR, WARN, "revoked");
  eq("revoked: otherwise-valid cert -> Invalid", r, "Invalid");
}

/* ---------------- Revocation soft-fail: good does NOT downgrade ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, FAR, WARN, "good");
  eq("good: otherwise-valid -> Valid (not Invalid)", r, "Valid");
}

/* ---------------- Revocation soft-fail: unknown does NOT downgrade ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, FAR, WARN, "unknown");
  eq("unknown: otherwise-valid -> Valid (not Invalid)", r, "Valid");
}

/* ---------------- Revocation soft-fail: unknown + expiring stays Expiring ---------------- */
{
  const r = computeStatus(true, false, SUBJECT, ISSUER, true, NEAR, WARN, "unknown");
  eq("unknown: within warning window -> Expiring (not Invalid)", r, "Expiring");
}

/* ---------------- Revocation soft-fail: unknown does NOT upgrade a bad cert ---------------- */
{
  const r = computeStatus(false, false, SUBJECT, ISSUER, true, FAR, WARN, "unknown");
  eq("unknown: hostname mismatch still -> Invalid", r, "Invalid");
}

/* ---------------- Precedence: expired outranks revoked ---------------- */
{
  const r = computeStatus(true, true, SUBJECT, ISSUER, true, FAR, WARN, "revoked");
  eq("precedence: expired + revoked -> Expired", r, "Expired");
}

console.log(`\n${passed} passed, ${failed} failed`);
