// Manual test scaffold for computeConnectionLatency.
//
// The function is a pure mapping (inputs -> { dnsMs, tcpMs, tlsMs, totalMs }), so
// these cases pin down two things: (1) each input lands in the right field, and
// (2) nulls are PRESERVED (never coerced to 0) so the frontend omits a missing bar
// instead of drawing a fake zero. totalMs always mirrors handshake_time_ms.
//
// Run: pnpm exec ts-node src/checkers/tls/test/connectionLatencyTest.ts

import { computeConnectionLatency } from "../deriveTls";

// 1. Normal domain — all phases measured
console.log("all present  ",
  computeConnectionLatency(6, 21, 57, 84),
  "expected { dnsMs: 6, tcpMs: 21, tlsMs: 57, totalMs: 84 }");

// 2. Host is an IP — no DNS lookup fired, so tcpMs can't be derived, but tlsMs still is
console.log("ip host      ",
  computeConnectionLatency(0, null, 57, 84),
  "expected { dnsMs: 0, tcpMs: null, tlsMs: 57, totalMs: 84 }");

// 3. Only total available — both mid-phase markers missing
console.log("phases null  ",
  computeConnectionLatency(0, null, null, 84),
  "expected { dnsMs: 0, tcpMs: null, tlsMs: null, totalMs: 84 }");

// 4. DNS + TLS present, TCP null (the case where tcpMs null != tlsMs null)
console.log("tcp-only null",
  computeConnectionLatency(0, null, 40, 50),
  "expected { dnsMs: 0, tcpMs: null, tlsMs: 40, totalMs: 50 }");

// 5. total independent of phases — phases null must NOT zero out total
console.log("total intact ",
  computeConnectionLatency(6, null, null, 91),
  "expected totalMs 91 (not summed from phases)");
