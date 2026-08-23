// Test scaffold for the `signals` block of computeSecurityGrade().
//
// The signals are independent of the grade math, so grade-relevant params are
// held at fixed valid values and only the signal inputs are varied. Three
// signals are pass-throughs (forwardSecrecy / ocspStapled / mustStaple); two are
// derived (tlsVersionPreferred = protocol is TLSv1.3, strongKey = key level Pass).
//
// Run: pnpm exec ts-node src/checkers/tls/test/securityGradeSignalsTest.ts

import { computeSecurityGrade } from "../deriveTls";
import { ValidationChecks, TlsAcceptedConnections } from "../tls.types";
import type { SecureVersion } from "node:tls";

/* ---------------- tiny assert harness ---------------- */
let passed = 0;
let failed = 0;
const eq = (name: string, actual: unknown, expected: unknown) => {
  const ok = actual === expected;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name} → ${actual} (expected ${expected})`);
};

/* ---------------- grade-irrelevant fixtures ---------------- */
const allPass: ValidationChecks = {
  certificate_trust_check: true,
  validity_start_check: true,
  expiry_boundary_check: true,
  check_hostname_match: true,
  self_signed_check: true,
};
const modernOnly: TlsAcceptedConnections[] = [
  { name: "TLSv1.3", enabled: true, cipherSuite: "TLS_AES_256_GCM_SHA384", rating: "Pass" },
  { name: "TLSv1.2", enabled: true, cipherSuite: "ECDHE-ECDSA-AES128-GCM-SHA256", rating: "Pass" },
  { name: "TLSv1.1", enabled: false, cipherSuite: null, rating: "Pass" },
  { name: "TLSv1", enabled: false, cipherSuite: null, rating: "Pass" },
];

type SigOpts = {
  keyType?: string | null;
  nist?: string | undefined;
  bits?: number | undefined;
  fs: boolean;
  ms: boolean;
  ocsp: boolean;
  ver: SecureVersion | null;
};

// Returns the whole result so tests can also read `scores` for the invariant check.
const gradeOf = (o: SigOpts) =>
  computeSecurityGrade(
    allPass,
    "ecdsa-with-sha384",
    modernOnly,
    o.keyType === undefined ? "ec" : o.keyType,
    o.nist === undefined ? "prime256v1" : o.nist,
    o.bits === undefined ? 256 : o.bits,
    o.fs,
    o.ms,
    o.ver,
    o.ocsp,
  );
const signalsOf = (o: SigOpts) => gradeOf(o).signals;

const strongKey = { keyType: "ec", nist: "prime256v1", bits: 256 };

/* ================================================================== */
/* Group A — pass-through booleans map straight through               */
/* ================================================================== */
{
  const s = signalsOf({ ...strongKey, fs: true, ms: true, ocsp: true, ver: "TLSv1.3" });
  eq("A1 forwardSecrecy true", s.forwardSecrecySignal, true);
  eq("A1 ocspStapled true", s.ocspStapledSignal, true);
  eq("A1 mustStaple true", s.mustStapleSignal, true);
}
{
  const s = signalsOf({ ...strongKey, fs: false, ms: false, ocsp: false, ver: "TLSv1.3" });
  eq("A2 forwardSecrecy false", s.forwardSecrecySignal, false);
  eq("A2 ocspStapled false", s.ocspStapledSignal, false);
  eq("A2 mustStaple false", s.mustStapleSignal, false);
}
// Cross-wiring guard: three distinct values, none should leak into another.
{
  const s = signalsOf({ ...strongKey, fs: true, ms: false, ocsp: true, ver: "TLSv1.3" });
  eq("A3 forwardSecrecy stays true", s.forwardSecrecySignal, true);
  eq("A3 mustStaple stays false", s.mustStapleSignal, false);
  eq("A3 ocspStapled stays true", s.ocspStapledSignal, true);
}
{
  const s = signalsOf({ ...strongKey, fs: false, ms: true, ocsp: false, ver: "TLSv1.3" });
  eq("A4 forwardSecrecy stays false", s.forwardSecrecySignal, false);
  eq("A4 mustStaple stays true", s.mustStapleSignal, true);
  eq("A4 ocspStapled stays false", s.ocspStapledSignal, false);
}

/* ================================================================== */
/* Group B — tlsVersionPreferred is true ONLY for TLSv1.3             */
/* ================================================================== */
const baseBool = { ...strongKey, fs: true, ms: true, ocsp: true } as const;
eq("B1 ver TLSv1.3", signalsOf({ ...baseBool, ver: "TLSv1.3" }).tlsVersionPrefferedSignal, true);
eq("B2 ver TLSv1.2", signalsOf({ ...baseBool, ver: "TLSv1.2" }).tlsVersionPrefferedSignal, false);
eq("B3 ver TLSv1.1", signalsOf({ ...baseBool, ver: "TLSv1.1" }).tlsVersionPrefferedSignal, false);
eq("B4 ver TLSv1", signalsOf({ ...baseBool, ver: "TLSv1" }).tlsVersionPrefferedSignal, false);
eq("B5 ver null", signalsOf({ ...baseBool, ver: null }).tlsVersionPrefferedSignal, false);

/* ================================================================== */
/* Group C — strongKey true ONLY when key level is Pass              */
/* ================================================================== */
const boolsOnly = { fs: true, ms: true, ocsp: true, ver: "TLSv1.3" as SecureVersion };
eq("C1 ec-256 Pass", signalsOf({ ...boolsOnly, keyType: "ec", nist: "prime256v1", bits: 256 }).strongKeySignal, true);
eq("C2 rsa-3072 Pass", signalsOf({ ...boolsOnly, keyType: "rsa", nist: undefined, bits: 3072 }).strongKeySignal, true);
eq("C3 ed25519 Pass", signalsOf({ ...boolsOnly, keyType: "ed25519", nist: undefined, bits: undefined }).strongKeySignal, true);
eq("C4 rsa-2048 Warn", signalsOf({ ...boolsOnly, keyType: "rsa", nist: undefined, bits: 2048 }).strongKeySignal, false);
eq("C5 ec-128 Fail", signalsOf({ ...boolsOnly, keyType: "ec", nist: "prime256v1", bits: 128 }).strongKeySignal, false);
eq("C6 rsa-no-bits Warn", signalsOf({ ...boolsOnly, keyType: "rsa", nist: undefined, bits: undefined }).strongKeySignal, false);
eq("C7 null-key Warn", signalsOf({ ...boolsOnly, keyType: null, nist: undefined, bits: undefined }).strongKeySignal, false);

/* ================================================================== */
/* Group D — invariant: strongKeySignal true  <=>  KEY_STRENGTH_SCORE 100 */
/* ================================================================== */
{
  const g = gradeOf({ ...boolsOnly, keyType: "ec", nist: "prime256v1", bits: 256 });
  const keyScore = g.scores.find((x) => x.label === "KEY_STRENGTH_SCORE")?.value;
  eq("D1 strong key => score 100", g.signals.strongKeySignal && keyScore === 100, true);
}
{
  const g = gradeOf({ ...boolsOnly, keyType: "rsa", nist: undefined, bits: 2048 });
  const keyScore = g.scores.find((x) => x.label === "KEY_STRENGTH_SCORE")?.value;
  eq("D2 non-strong key => score != 100", g.signals.strongKeySignal === false && keyScore !== 100, true);
}

/* ---------------- summary ---------------- */
console.log(`\n${passed} passed, ${failed} failed`);
