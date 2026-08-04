// Tests for chainOfTrust — verify it flattens the nested getPeerCertificate(true)
// structure into the correct ordered, role-labeled array.
//
// Each case prints the FULL expected array and the FULL array the function produced
// so you can compare field-by-field. Mismatches = bugs to fix.
//
// Run: pnpm exec ts-node src/checkers/tls/test/certChainInspect.ts

import { isDeepStrictEqual } from "node:util";
import { chainOfTrust } from "../deriveTls";

const cert = (subjectCN: string, issuerCN: string, issuerCertificate?: any): any => ({
  subject: { CN: subjectCN },
  issuer: { CN: issuerCN, O: issuerCN },
  valid_from: "Jan  1 00:00:00 2026 GMT",
  valid_to: "Dec 31 23:59:59 2026 GMT",
  fingerprint256: `FP:${subjectCN}`,
  serialNumber: `SN:${subjectCN}`,
  ...(issuerCertificate ? { issuerCertificate } : {}),
});

// The expected flattened entry: the cert's fields (minus issuerCertificate) + role.
const entry = (c: any, role: string) => {
  const { issuerCertificate, ...rest } = c;
  return { role, ...rest };
};

const show = (label: string, expected: any[], got: any[]) => {
  const pass = isDeepStrictEqual(got, expected);
  console.log(`\n================ ${label}  →  ${pass ? "PASS ✅" : "FAIL ❌"} ================`);
  if (!pass) {
    console.log(`--- EXPECTED (len ${expected.length}) ---`);
    console.dir(expected, { depth: 4 });
    console.log(`--- GOT (len ${got.length}) ---`);
    console.dir(got, { depth: 4 });
  }
};

/* ---------- Case 1: leaf + 3 intermediates + root ---------- */
const root = cert("Example Global Root", "Example Global Root");
const int3 = cert("Example Policy CA", "Example Global Root", root);
const int2 = cert("Example Intermediate CA G2", "Example Policy CA", int3);
const int1 = cert("Example Issuing CA", "Example Intermediate CA G2", int2);
const leaf5 = cert("shop.example.com", "Example Issuing CA", int1);

show("CASE 1  leaf+3int+root",
  [entry(leaf5, "Leaf"), entry(int1, "Intermediate"), entry(int2, "Intermediate"), entry(int3, "Intermediate"), entry(root, "Root")],
  chainOfTrust(leaf5));

// console.dir(leaf5, { depth: 10 });

/* ---------- Case 2: leaf + 1 intermediate + root ---------- */
const rootB = cert("ISRG Root X1", "ISRG Root X1");
const intB = cert("R11", "ISRG Root X1", rootB);
const leaf3 = cert("api.statusforge.io", "R11", intB);

show("CASE 2  leaf+1int+root",
  [entry(leaf3, "Leaf"), entry(intB, "Intermediate"), entry(rootB, "Root")],
  chainOfTrust(leaf3));

/* ---------- Case 3: leaf + intermediate, NO root sent ---------- */
const intC = cert("R11", "ISRG Root X1");
const leaf2 = cert("api.statusforge.io", "R11", intC);

show("CASE 3  leaf+int, no root sent",
  [entry(leaf2, "Leaf"), entry(intC, "Intermediate")], // root NOT in array — derived separately
  chainOfTrust(leaf2));

/* ---------- Case 4: self-signed leaf ---------- */
const selfSigned = cert("localhost", "localhost");

show("CASE 4  self-signed leaf",
  [entry(selfSigned, "Root")], // single self-signed entry (your contract's call: Leaf or Root)
  chainOfTrust(selfSigned));

/* ---------- Case 5: leaf only, missing intermediate ---------- */
const leafOnly = cert("misconfigured.example.com", "Some Intermediate CA");

show("CASE 5  leaf only (missing intermediate)",
  [entry(leafOnly, "Leaf")],
  chainOfTrust(leafOnly));

/* ---------- Case 6: leaf + 2 intermediates + root ---------- */
const r6 = cert("Root6", "Root6");
const i6b = cert("Int6B", "Root6", r6);
const i6a = cert("Int6A", "Int6B", i6b);
const leaf6 = cert("host6.example.com", "Int6A", i6a);

show("CASE 6  leaf+2int+root",
  [entry(leaf6, "Leaf"), entry(i6a, "Intermediate"), entry(i6b, "Intermediate"), entry(r6, "Root")],
  chainOfTrust(leaf6));

/* ---------- Case 7: leaf signed directly by a (sent) root, no intermediate ---------- */
const r7 = cert("Root7", "Root7");
const leaf7 = cert("host7.example.com", "Root7", r7);

show("CASE 7  leaf+root (no intermediate)",
  [entry(leaf7, "Leaf"), entry(r7, "Root")],
  chainOfTrust(leaf7));

// ---------- Case 8: SELF-REFERENCING root — how REAL Node certs terminate ----------
 //
 // ⚠️  DO NOT UNCOMMENT until chainOfTrust has a self-reference / cycle guard.
 // Node sets the top cert's .issuerCertificate to ITSELF, so `while (cert.issuerCertificate)`
 // never becomes falsy → INFINITE LOOP (pushes "Root" forever). This is the one gap the
 // omit-issuerCertificate mocks (cases 1-7) don't catch.
 //
  const rootSelf: any = cert("RealRoot", "RealRoot");
  rootSelf.issuerCertificate = rootSelf;            // ← self-reference, like real Node
  const intSelf = cert("RealInt", "RealRoot", rootSelf);
const leafSelf = cert("real.example.com", "RealInt", intSelf);

show("CASE 8  self-referencing root (REAL Node)",
[entry(leafSelf, "Leaf"), entry(intSelf, "Intermediate"), entry(rootSelf, "Root")],
 chainOfTrust(leafSelf));   // hangs today — needs a `seen` fingerprint guard
