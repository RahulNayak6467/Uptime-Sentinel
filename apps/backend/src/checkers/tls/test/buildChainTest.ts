// Tests for buildChainOfTrust — verifies the WRAPPER it adds on top of chainOfTrust:
// root {name,inTrustStore,status}, verified, pathValidation, hostnameMatch,
// certsSent, bytesSent. (The links array itself is covered by certChainInspect.ts.)
//
// Each case deep-compares a "wrapper summary" against the intended contract.
// Root-name rule (intended): the TOP sent cert's issuer.CN (== last link's issuer.CN),
// which works whether or not the root was sent.
//
// Run: pnpm exec ts-node src/checkers/tls/test/buildChainTest.ts

import { isDeepStrictEqual } from "node:util";
import { buildChainOfTrust } from "../deriveTls";

const cert = (subjectCN: string, issuerCN: string, issuerCertificate?: any): any => ({
  subject: { CN: subjectCN },
  issuer: { CN: issuerCN, O: issuerCN },
  valid_from: "Jan  1 00:00:00 2026 GMT",
  valid_to: "Dec 31 23:59:59 2026 GMT",
  fingerprint256: `FP:${subjectCN}`,
  serialNumber: `SN:${subjectCN}`,
  ...(issuerCertificate ? { issuerCertificate } : {}),
});

// Compare only the wrapper fields + links length (links content tested elsewhere).
const wrap = (c: any) => ({
  rootName: c.root.name,
  inTrustStore: c.root.inTrustStore,
  status: c.root.status,
  verified: c.verified,
  pathValidation: c.pathValidation,
  hostnameMatch: c.hostnameMatch,
  certsSent: c.certsSent,
  bytesSent: c.bytesSent,
  linksLen: c.links.length,
});

const check = (label: string, expected: any, gotFull: any) => {
  const got = wrap(gotFull);
  const pass = isDeepStrictEqual(got, expected);
  console.log(`\n==== ${label}  →  ${pass ? "PASS ✅" : "FAIL ❌"} ====`);
  if (!pass) {
    console.log("expected:", expected);
    console.log("got     :", got);
  }
};

/* ---------- A: leaf + 1 intermediate + root (sent), trusted ---------- */
const rA = cert("RootA", "RootA");
const iA = cert("IntA", "RootA", rA);
const leafA = cert("a.example.com", "IntA", iA);
check("A  leaf+1int+root, trusted",
  { rootName: "RootA", inTrustStore: true, status: "In OS / browser trust store",
    verified: true, pathValidation: "Verified to a trusted root", hostnameMatch: true,
    certsSent: 3, bytesSent: 2148, linksLen: 3 },
  buildChainOfTrust(leafA, true, null, true, 2148));

/* ---------- B: leaf + 2 intermediates + root (sent), trusted ---------- */
const rB = cert("RootB", "RootB");
const iB2 = cert("IntB2", "RootB", rB);
const iB1 = cert("IntB1", "IntB2", iB2);
const leafB = cert("b.example.com", "IntB1", iB1);
check("B  leaf+2int+root, trusted",
  { rootName: "RootB", inTrustStore: true, status: "In OS / browser trust store",
    verified: true, pathValidation: "Verified to a trusted root", hostnameMatch: true,
    certsSent: 4, bytesSent: 3600, linksLen: 4 },
  buildChainOfTrust(leafB, true, null, true, 3600));

/* ---------- C: leaf + intermediate, NO root sent, trusted ---------- */
const iC = cert("IntC", "RootC");                 // top cert, no issuerCertificate
const leafC = cert("c.example.com", "IntC", iC);
check("C  leaf+int, no root sent, trusted",
  { rootName: "RootC", inTrustStore: true, status: "In OS / browser trust store",
    verified: true, pathValidation: "Verified to a trusted root", hostnameMatch: true,
    certsSent: 2, bytesSent: 1900, linksLen: 2 },
  buildChainOfTrust(leafC, true, null, true, 1900));

/* ---------- D: self-signed leaf, untrusted ---------- */
const selfD = cert("localhost", "localhost");
check("D  self-signed leaf, untrusted",
  { rootName: "localhost", inTrustStore: false, status: "Not a trusted root",
    verified: false, pathValidation: "self signed certificate", hostnameMatch: true,
    certsSent: 1, bytesSent: 1180, linksLen: 1 },
  buildChainOfTrust(selfD, false, "self signed certificate", true, 1180));

/* ---------- E: leaf only (missing intermediate), untrusted ---------- */
const leafE = cert("e.example.com", "Missing Intermediate CA");
check("E  leaf only (missing intermediate), untrusted",
  { rootName: "Missing Intermediate CA", inTrustStore: false,
    status: "Not a trusted root", verified: false,
    pathValidation: "unable to get local issuer certificate", hostnameMatch: false,
    certsSent: 1, bytesSent: 1200, linksLen: 1 },
  buildChainOfTrust(leafE, false, "unable to get local issuer certificate", false, 1200));
