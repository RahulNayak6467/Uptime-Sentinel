// Test scaffold for checkStatus() — the TLS UP/DOWN classifier.
//
// Locked contract:
//   "Valid" | "Expiring"                       -> "UP"
//   "Expired" | "Invalid" | "Unreachable"      -> "DOWN"
//
// Signature: checkStatus(status)
// Run: pnpm exec tsx src/workers/statemachine/test/checkStatusTest.ts

import { checkStatus } from "../tlsStateMachine.worker";

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

eq("Valid -> UP", checkStatus("Valid"), "UP");
eq("Expiring -> UP", checkStatus("Expiring"), "UP");
eq("Expired -> DOWN", checkStatus("Expired"), "DOWN");
eq("Invalid -> DOWN", checkStatus("Invalid"), "DOWN");
eq("Unreachable -> DOWN", checkStatus("Unreachable"), "DOWN");

console.log(`\n${passed} passed, ${failed} failed`);
