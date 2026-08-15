// Test scaffold for emailHelper — generateReasonMessages() + emailAlertMap.
//
// Contract:
//   generateReasonMessages(type, reason):
//     - tls + known cause      -> that cause's sentence
//     - tls + unknown cause    -> generic "The certificate failed validation."
//     - tls + null             -> null (no reason paragraph)
//     - non-tls type           -> null (HTTP/others have no reason paragraph)
//   emailAlertMap: each monitor type has its own { subject, title }.
//
// Run: pnpm exec tsx src/emails/test/emailHelperTest.ts

import { emailAlertMap, generateReasonMessages } from "../emailHelper";

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

/* ---------------- generateReasonMessages: tls known causes ---------------- */
eq("tls expired", generateReasonMessages("tls", "expired"),
  "The certificate has expired and browsers will reject the connection.");
eq("tls revoked", generateReasonMessages("tls", "revoked"),
  "The certificate has been revoked by its issuer.");
eq("tls hostname_mismatch", generateReasonMessages("tls", "hostname_mismatch"),
  "The certificate no longer matches the monitored hostname.");
eq("tls unreachable", generateReasonMessages("tls", "unreachable"),
  "The server could not be reached to complete the TLS handshake.");

/* ---------------- generateReasonMessages: fallback + empty ---------------- */
eq("tls other -> generic", generateReasonMessages("tls", "other"),
  "The certificate failed validation.");
eq("tls unknown cause -> generic", generateReasonMessages("tls", "definitely_not_a_cause"),
  "The certificate failed validation.");
eq("tls null -> null", generateReasonMessages("tls", null), null);

/* ---------------- generateReasonMessages: non-tls has no reason ---------------- */
eq("https + cause -> null", generateReasonMessages("https", "expired"), null);
eq("http + null -> null", generateReasonMessages("http", null), null);

/* ---------------- emailAlertMap: per-type copy ---------------- */
eq("map tls subject", emailAlertMap.get("tls")?.subject, "TLS Certificate");
eq("map https subject", emailAlertMap.get("https")?.subject, "Https Monitor");
eq("map http subject", emailAlertMap.get("http")?.subject, "Http Monitor");

console.log(`\n${passed} passed, ${failed} failed`);
