// Test scaffold for computeCaa() — DNS CAA policy lookup.
//
// The resolver is injected (4th arg) so we test the shaping/branching logic with
// fake records and fake DNS errors, no real network.
//
// Locked contract:
//   Pass    → a CAA record is present (issuers named OR explicit deny-all)
//   Warn    → no record (ENODATA / ENOTFOUND) → any CA may issue
//   Unknown → lookup failed (timeout / SERVFAIL) → cannot determine
//   allowedIssuers = issue + issuewild, ";" filtered out
//   iodef          = all iodef values
//   caaPresent disambiguates deny-all (true) vs no-record (false)
//
// Run: pnpm exec tsx src/checkers/tls/test/caaResolverTest.ts

import { computeCaa } from "../caaResolver";
import type { CaaRecord } from "node:dns";

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

// fake lookups
const returns = (records: CaaRecord[]) => async () => records;
const throws = (code: string) => async () => {
  const err = new Error(code) as NodeJS.ErrnoException;
  err.code = code;
  throw err;
};

const TIMEOUT = 10000;

/* ---------------- Pass: issuers named ---------------- */
{
  const records: CaaRecord[] = [
    { critical: 0, issue: "letsencrypt.org" },
    { critical: 0, issue: "digicert.com" },
    { critical: 0, iodef: "mailto:security@statusforge.io" },
  ];
  const r = await computeCaa("statusforge.io", TIMEOUT, returns(records));
  eq("issuers → status Pass", r.status, "Pass");
  eq("issuers → caaPresent true", r.caaPresent, true);
  eq("issuers → allowedIssuers", r.allowedIssuers, ["letsencrypt.org", "digicert.com"]);
  eq("issuers → iodef", r.iodef, ["mailto:security@statusforge.io"]);
}

/* ---------------- issuewild counts as an issuer ---------------- */
{
  const records: CaaRecord[] = [
    { critical: 0, issue: "letsencrypt.org" },
    { critical: 0, issuewild: "digicert.com" },
  ];
  const r = await computeCaa("x.io", TIMEOUT, returns(records));
  eq("issuewild → included in allowedIssuers", r.allowedIssuers, ["letsencrypt.org", "digicert.com"]);
}

/* ---------------- multiple iodef collected ---------------- */
{
  const records: CaaRecord[] = [
    { critical: 0, issue: "letsencrypt.org" },
    { critical: 0, iodef: "mailto:a@x.io" },
    { critical: 0, iodef: "https://x.io/report" },
  ];
  const r = await computeCaa("x.io", TIMEOUT, returns(records));
  eq("multiple iodef → all collected", r.iodef, ["mailto:a@x.io", "https://x.io/report"]);
}

/* ---------------- Pass: deny-all (issue ";") ---------------- */
{
  const records: CaaRecord[] = [{ critical: 0, issue: ";" }];
  const r = await computeCaa("locked.io", TIMEOUT, returns(records));
  eq("deny-all → status Pass", r.status, "Pass");
  eq("deny-all → caaPresent true", r.caaPresent, true);
  eq("deny-all → ';' filtered out (empty issuers)", r.allowedIssuers, []);
}

/* ---------------- Warn: no record (ENODATA) ---------------- */
{
  const r = await computeCaa("no-caa.io", TIMEOUT, throws("ENODATA"));
  eq("ENODATA → status Warn", r.status, "Warn");
  eq("ENODATA → caaPresent false", r.caaPresent, false);
  eq("ENODATA → empty issuers", r.allowedIssuers, []);
  eq("ENODATA → empty iodef", r.iodef, []);
}

/* ---------------- Warn: host not found (ENOTFOUND) ---------------- */
{
  const r = await computeCaa("nope.invalid", TIMEOUT, throws("ENOTFOUND"));
  eq("ENOTFOUND → status Warn", r.status, "Warn");
  eq("ENOTFOUND → caaPresent false", r.caaPresent, false);
}

/* ---------------- Unknown: lookup failed (SERVFAIL) ---------------- */
{
  const r = await computeCaa("flaky.io", TIMEOUT, throws("ESERVFAIL"));
  eq("ESERVFAIL → status Unknown", r.status, "Unknown");
  eq("ESERVFAIL → caaPresent false", r.caaPresent, false);
}

/* ---------------- Unknown: timeout ---------------- */
{
  const r = await computeCaa("slow.io", TIMEOUT, throws("caa_timeout"));
  eq("timeout → status Unknown", r.status, "Unknown");
}

console.log(`\n${passed} passed, ${failed} failed`);
