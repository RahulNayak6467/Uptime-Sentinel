// Test scaffold for reasonForTlsDown().
//
// Locked contract — single cause per DOWN check, fixed precedence:
//   1. status === "Unreachable"        -> "unreachable"
//   2. no validation object            -> "other"   (DOWN but no cert to attribute)
//   3. !expiry_boundary_check          -> "expired"
//   4. revocationStatus === "revoked"  -> "revoked"
//   5. !check_hostname_match           -> "hostname_mismatch"
//   6. otherwise                       -> "other"   (untrusted / self-signed / not-yet-valid)
//
// Signature: reasonForTlsDown(status, validation, revocationStatus)
// Run: pnpm exec tsx src/workers/statemachine/test/reasonForTlsDownTest.ts

import { reasonForTlsDown } from "../../../checkers/tls/deriveTls";
import { ValidationChecks } from "../../../checkers/tls/tls.types";

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

// A fully-passing validation set; override one field per case to trip a cause.
const ok = (over: Partial<ValidationChecks> = {}): ValidationChecks => ({
  certificate_trust_check: true,
  validity_start_check: true,
  expiry_boundary_check: true,
  check_hostname_match: true,
  self_signed_check: true,
  ...over,
});

/* ---------------- unreachable (no connection) ---------------- */
{
  eq("unreachable: status Unreachable -> unreachable",
    reasonForTlsDown("Unreachable", null, "unknown"), "unreachable");
}

/* ---------------- unreachable outranks any validation state ---------------- */
{
  eq("unreachable: even with validation present -> unreachable",
    reasonForTlsDown("Unreachable", ok({ expiry_boundary_check: false }), "revoked"), "unreachable");
}

/* ---------------- no validation object -> other ---------------- */
{
  eq("no validation: Invalid + null validation -> other",
    reasonForTlsDown("Invalid", null, "unknown"), "other");
}

/* ---------------- expired ---------------- */
{
  eq("expired: expiry_boundary_check false -> expired",
    reasonForTlsDown("Expired", ok({ expiry_boundary_check: false }), "good"), "expired");
}

/* ---------------- revoked ---------------- */
{
  eq("revoked: revocationStatus revoked -> revoked",
    reasonForTlsDown("Invalid", ok(), "revoked"), "revoked");
}

/* ---------------- hostname mismatch ---------------- */
{
  eq("hostname: check_hostname_match false -> hostname_mismatch",
    reasonForTlsDown("Invalid", ok({ check_hostname_match: false }), "good"), "hostname_mismatch");
}

/* ---------------- other: untrusted chain ---------------- */
{
  eq("other: untrusted chain -> other",
    reasonForTlsDown("Invalid", ok({ certificate_trust_check: false }), "good"), "other");
}

/* ---------------- precedence: expired outranks revoked ---------------- */
{
  eq("precedence: expired + revoked -> expired",
    reasonForTlsDown("Expired", ok({ expiry_boundary_check: false }), "revoked"), "expired");
}

/* ---------------- precedence: revoked outranks hostname ---------------- */
{
  eq("precedence: revoked + hostname mismatch -> revoked",
    reasonForTlsDown("Invalid", ok({ check_hostname_match: false }), "revoked"), "revoked");
}

/* ---------------- unknown revocation does not force revoked ---------------- */
{
  eq("soft-fail: hostname mismatch + unknown revocation -> hostname_mismatch",
    reasonForTlsDown("Invalid", ok({ check_hostname_match: false }), "unknown"), "hostname_mismatch");
}

console.log(`\n${passed} passed, ${failed} failed`);
