// Manual test scaffold for the computeSecurityGrade helpers.
//
// computeSecurityGrade() itself makes a network call (checkConnections(host)), so
// instead of hitting the network we test the pure helper it feeds into
// (computeProtocolSupport) with HARDCODED protocol arrays. All other helpers are
// pure. Run with: pnpm exec ts-node src/checkers/tls/test/securityGradeTest.ts
//
// Expected values below reflect the INTENDED design. Where actual != expected,
// it's a bug the test surfaces (see the notes at the bottom of the file).

import {
  computeGrade,
  computeCertificateStrength,
  computeKeyStrength,
  computeSignatureStrength,
  computeProtocolSupport,
  computeSecurityGrade,
} from "../deriveTls";
import { ValidationChecks, TlsAcceptedConnections } from "../tls.types";

const allPass: ValidationChecks = {
  certificate_trust_check: true,
  validity_start_check: true,
  expiry_boundary_check: true,
  check_hostname_match: true,
  self_signed_check: true,
};

/* ---------------- computeGrade (score -> letter) ---------------- */
console.log("grade 100", computeGrade(100), "expected A+");
console.log("grade 95 ", computeGrade(95), "expected A+");
console.log("grade 94 ", computeGrade(94), "expected A");
console.log("grade 85 ", computeGrade(85), "expected A");
console.log("grade 84 ", computeGrade(84), "expected B");
console.log("grade 70 ", computeGrade(70), "expected B");
console.log("grade 69 ", computeGrade(69), "expected C");
console.log("grade 55 ", computeGrade(55), "expected C");
console.log("grade 54 ", computeGrade(54), "expected D");
console.log("grade 40 ", computeGrade(40), "expected D");
console.log("grade 39 ", computeGrade(39), "expected F");
console.log("grade 0  ", computeGrade(0), "expected F");

/* ---------------- computeCertificateStrength (5 x 20) ---------------- */
console.log("cert all-pass ", computeCertificateStrength(allPass), "expected 100");
console.log("cert 1-fail   ", computeCertificateStrength({ ...allPass, certificate_trust_check: false }), "expected 80");
console.log("cert 2-fail   ", computeCertificateStrength({ ...allPass, certificate_trust_check: false, check_hostname_match: false }), "expected 60");
console.log("cert all-fail ", computeCertificateStrength({
  certificate_trust_check: false, validity_start_check: false, expiry_boundary_check: false,
  check_hostname_match: false, self_signed_check: false,
}), "expected 0");

/* ---------------- computeKeyStrength ---------------- */
// inferKeyType() returns LOWERCASE ('ec' | 'rsa' | 'ed25519'), so these are the real inputs.
console.log("key ed25519 ", computeKeyStrength("Pass", "ed25519", undefined), "expected {100,Pass}");
console.log("key ec-256  ", computeKeyStrength("Pass", "ec", 256), "expected {100,Pass}");
console.log("key ec-128  ", computeKeyStrength("Fail", "ec", 128), "expected {20,Fail}");
console.log("key rsa-3072", computeKeyStrength("Pass", "rsa", 3072), "expected {100,Pass}");
console.log("key rsa-2048", computeKeyStrength("Warn", "rsa", 2048), "expected {60,Warn}");
console.log("key rsa-1024", computeKeyStrength("Fail", "rsa", 1024), "expected {20,Fail}");
console.log("key no-bits ", computeKeyStrength("Warn", "rsa", undefined), "expected {50,Warn}");
console.log("key null    ", computeKeyStrength("Warn", null, undefined), "expected {50,Warn}");

/* ---------------- computeSignatureStrength ---------------- */
console.log("sig sha256    ", computeSignatureStrength("sha256WithRSAEncryption"), "expected {90,Pass}");
console.log("sig SHA384-up ", computeSignatureStrength("ecdsa-with-SHA384"), "expected {100,Pass}");
console.log("sig sha1-low  ", computeSignatureStrength("sha1WithRSAEncryption"), "expected {0,Fail}");
console.log("sig SHA1-up   ", computeSignatureStrength("RSA-SHA1"), "expected {0,Fail}");
console.log("sig missing   ", computeSignatureStrength(undefined), "expected {50,Warn}");

/* ---------------- computeProtocolSupport (hardcoded, no network) ---------------- */
const mk = (rows: [TlsAcceptedConnections["name"], boolean][]): TlsAcceptedConnections[] =>
  rows.map(([name, enabled]) => ({ name, enabled }));

console.log("proto modern-only",
  computeProtocolSupport(mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", false], ["TLSv1", false]])),
  "expected 100");
console.log("proto TLS1.1 on  ",
  computeProtocolSupport(mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", true], ["TLSv1", false]])),
  "expected 70 (TLS1.1 = -30)");
console.log("proto TLS1.0 on  ",
  computeProtocolSupport(mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", false], ["TLSv1", true]])),
  "expected 50 (TLS1.0 = -50)");
console.log("proto both-legacy",
  computeProtocolSupport(mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", true], ["TLSv1", true]])),
  "expected 50 (worst = TLS1.0 -50)");
console.log("proto no-modern  ",
  computeProtocolSupport(mk([["TLSv1.3", false], ["TLSv1.2", false], ["TLSv1.1", false], ["TLSv1", false]])),
  "expected 0 (neither 1.2 nor 1.3)");

/* ================================================================== */
/* computeSecurityGrade — WHOLE FUNCTION (aggregation + weighting)      */
/* Now synchronous: takes the offered-protocol array instead of a host. */
/* Expected values use the INTENDED (correct) helper outputs; the inline */
/* math shows the aggregation so you can verify weighting even while the */
/* helper bugs are unfixed.                                              */
/* ================================================================== */

const allFail: ValidationChecks = {
  certificate_trust_check: false, validity_start_check: false, expiry_boundary_check: false,
  check_hostname_match: false, self_signed_check: false,
};
const modernOnly = mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", false], ["TLSv1", false]]);
const tls11On = mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", true], ["TLSv1", false]]);
const bothLegacy = mk([["TLSv1.3", true], ["TLSv1.2", true], ["TLSv1.1", true], ["TLSv1", true]]);

// Case 1 — perfect: cert 100, sig 100, proto 100, key 100
// certScore = 100*0.8 + 100*0.2 = 100 ; overall = (100+100+100+100)/4 = 100
console.log("\ngrade CASE1 perfect",
  computeSecurityGrade(allPass, "ecdsa-with-sha384", modernOnly, "ec", "prime256v1", 256),
  "expected overall 100, grade A+");

// Case 2 — mixed: cert 100, sig 90, proto 70, key 60
// certScore = 100*0.8 + 90*0.2 = 98 ; overall = round((98+70+90+60)/4=79.5) = 80
console.log("grade CASE2 mixed  ",
  computeSecurityGrade(allPass, "sha256WithRSAEncryption", tls11On, "rsa", undefined, 2048),
  "expected overall 80, grade B");

// Case 3 — one validation fail (surfaces no-cap): cert base 80, sig 100, proto 100, key 100
// certScore = 80*0.8 + 100*0.2 = 84 ; overall = (84+100+100+100)/4 = 96
console.log("grade CASE3 1-fail ",
  computeSecurityGrade({ ...allPass, certificate_trust_check: false }, "ecdsa-with-sha384", modernOnly, "ec", "prime256v1", 256),
  "expected overall 96, grade A+ (note: invalid cert still A+ — no hard cap)");

// Case 4 — worst: cert 0, sig 0, proto 50, key 20
// certScore = 0 ; overall = round((0+50+0+20)/4=17.5) = 18
console.log("grade CASE4 worst  ",
  computeSecurityGrade(allFail, "RSA-sha1", bothLegacy, "rsa", undefined, 1024),
  "expected overall 18, grade F");
