// Test scaffold for connectionInfo() — a pure remap of TlsConfigInput.
//
// Asserts the LOCKED contract (raw values, no formatting):
//   warningThresholdDays  <- warning_threshold_days
//   expiryAlertThresholds <- expiry_alert_thresholds
//   connectionTimeoutMs   <- request_time_out_ms
//   minTlsVersion         <- min_tls_version
//   serverName            <- host
//   checkIntervalSeconds  <- interval_seconds
//   nextCheckAt           <- next_check_at
//
// Input values are deliberately DISTINCT so a swapped mapping is caught.
// Run: pnpm exec tsx src/checkers/tls/test/connectionInfoTest.ts

import { connectionInfo } from "../deriveTls";
import { TlsConfigInput } from "../tls.types";

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

const nextCheck = new Date("2026-08-06T22:00:00.000Z");
const input: TlsConfigInput = {
  url: "https://api.statusforge.io",
  host: "api.statusforge.io",
  interval_seconds: 43200,
  next_check_at: nextCheck,
  request_time_out_ms: 10000,
  warning_threshold_days: 30,
  expiry_alert_thresholds: [30, 14, 7, 1],
  min_tls_version: "TLSv1.2",
};

const r = connectionInfo(input) as any;

eq("returns an object (not undefined/function)", typeof r === "object" && r !== null, true);

eq("warningThresholdDays <- warning_threshold_days", r?.warningThresholdDays, 30);
eq("expiryAlertThresholds <- expiry_alert_thresholds", r?.expiryAlertThresholds, [30, 14, 7, 1]);
eq("connectionTimeoutMs <- request_time_out_ms", r?.connectionTimeoutMs, 10000);
eq("minTlsVersion <- min_tls_version", r?.minTlsVersion, "TLSv1.2");
eq("serverName <- host", r?.serverName, "api.statusforge.io");
eq("checkIntervalSeconds <- interval_seconds", r?.checkIntervalSeconds, 43200);
eq("nextCheckAt <- next_check_at", new Date(r?.nextCheckAt).getTime(), nextCheck.getTime());

// swap guards — the two fields that were previously mis-mapped
eq("warningThresholdDays is NOT the interval", r?.warningThresholdDays !== 43200, true);
eq("checkIntervalSeconds is NOT the timeout", r?.checkIntervalSeconds !== 10000, true);

console.log(`\n${passed} passed, ${failed} failed`);
