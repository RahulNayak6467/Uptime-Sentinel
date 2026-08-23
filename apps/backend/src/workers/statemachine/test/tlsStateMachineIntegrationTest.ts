// Integration test for runTlsStateMachine against the LOCAL DB.
// Scenarios: A (transition matrix), C (cause coverage), D (full lifecycle).
//
// Seeds a throwaway `tls` monitor, runs the state machine, asserts the rows it
// wrote, then deletes the monitor (CASCADE cleans incidents/updates/events).
// Safe on a dev DB — it only touches its own seeded monitor.
//
// Run: pnpm exec tsx src/workers/statemachine/test/tlsStateMachineIntegrationTest.ts

import { PoolClient } from "pg";
import { db } from "../../../db";
import { runTlsStateMachine } from "../tlsStateMachine.worker";
import { OCSPStatus, TlsStatus, ValidationChecks } from "../../../checkers/tls/tls.types";

const TEST_NAME = "__tls_sm_test__";

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

// all-passing validation set; override one field to trip a cause
const ok = (over: Partial<ValidationChecks> = {}): ValidationChecks => ({
  certificate_trust_check: true,
  validity_start_check: true,
  expiry_boundary_check: true,
  check_hostname_match: true,
  self_signed_check: true,
  ...over,
});

type Status = TlsStatus | "Unreachable";
type Rev = OCSPStatus["status"];
type Counts = {
  incidents: number; active: number; detected: number;
  resolved: number; went_down: number; recovered: number;
};

const seedMonitor = async (userId: string): Promise<string> => {
  const r = await db.query(
    `INSERT INTO monitor (url, monitor_name, user_id, interval_seconds, monitor_type)
     VALUES ($1, $2, $3, $4, 'tls') RETURNING id`,
    ["https://sm-test.local", TEST_NAME, userId, 43200],
  );
  return r.rows[0].id;
};

const seedActiveIncident = async (tlsId: string) =>
  db.query(
    `INSERT INTO incidents (monitor_id, is_active, last_alert_sent_at) VALUES ($1, true, NOW())`,
    [tlsId],
  );

const reset = async (tlsId: string) => {
  await db.query(`DELETE FROM incidents WHERE monitor_id = $1`, [tlsId]); // cascades incident_updates
  await db.query(`DELETE FROM tls_events WHERE monitor_id = $1`, [tlsId]);
};

const counts = async (tlsId: string): Promise<Counts> => {
  const r = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM incidents WHERE monitor_id=$1)                    AS incidents,
       (SELECT COUNT(*) FROM incidents WHERE monitor_id=$1 AND is_active)      AS active,
       (SELECT COUNT(*) FROM incident_updates iu JOIN incidents i ON iu.incident_id=i.id
          WHERE i.monitor_id=$1 AND iu.type='detected')                        AS detected,
       (SELECT COUNT(*) FROM incident_updates iu JOIN incidents i ON iu.incident_id=i.id
          WHERE i.monitor_id=$1 AND iu.type='resolved')                        AS resolved,
       (SELECT COUNT(*) FROM tls_events WHERE monitor_id=$1 AND type='went_down') AS went_down,
       (SELECT COUNT(*) FROM tls_events WHERE monitor_id=$1 AND type='recovered') AS recovered`,
    [tlsId],
  );
  const row = r.rows[0];
  return {
    incidents: +row.incidents, active: +row.active, detected: +row.detected,
    resolved: +row.resolved, went_down: +row.went_down, recovered: +row.recovered,
  };
};

const latestCause = async (tlsId: string): Promise<string | null> => {
  const r = await db.query(
    `SELECT metadata->>'cause' AS cause FROM tls_events
     WHERE monitor_id=$1 AND type='went_down' ORDER BY occurred_at DESC LIMIT 1`,
    [tlsId],
  );
  return r.rows[0]?.cause ?? null;
};

const seedResolvedIncident = async (tlsId: string) =>
  db.query(
    `INSERT INTO incidents (monitor_id, is_active, resolved_at, last_alert_sent_at)
     VALUES ($1, false, NOW(), NOW())`,
    [tlsId],
  );

const incidentRow = async (tlsId: string) => {
  const r = await db.query(
    `SELECT is_active,
            started_at         IS NOT NULL AS has_started,
            resolved_at        IS NOT NULL AS has_resolved,
            last_alert_sent_at IS NOT NULL AS has_alert
     FROM incidents WHERE monitor_id=$1 ORDER BY started_at DESC LIMIT 1`,
    [tlsId],
  );
  const row = r.rows[0];
  return {
    is_active: row.is_active, has_started: row.has_started,
    has_resolved: row.has_resolved, has_alert: row.has_alert,
  };
};

const run = (client: PoolClient, tlsId: string, status: Status, validation: ValidationChecks | null, rev: Rev) =>
  runTlsStateMachine(client, tlsId, status, validation, rev);

(async () => {
  // clean any leftover from a previous aborted run
  await db.query(`DELETE FROM monitor WHERE monitor_name = $1`, [TEST_NAME]);

  const u = await db.query(`SELECT id FROM user_details LIMIT 1`);
  if (u.rows.length === 0) throw new Error("No user in user_details to attach the test monitor to.");
  const userId = u.rows[0].id;

  const tlsId = await seedMonitor(userId);
  const client = await db.connect();

  try {
    /* ================= A. transition matrix ================= */
    await reset(tlsId);
    await run(client, tlsId, "Valid", ok(), "good");
    eq("A1 NO_INCIDENT+Valid -> nothing", await counts(tlsId),
      { incidents: 0, active: 0, detected: 0, resolved: 0, went_down: 0, recovered: 0 });

    await reset(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    eq("A2 NO_INCIDENT+Expired -> open", await counts(tlsId),
      { incidents: 1, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });

    await reset(tlsId);
    await seedActiveIncident(tlsId);
    await run(client, tlsId, "Valid", ok(), "good");
    eq("A3 INCIDENT_ACTIVE+Valid -> close", await counts(tlsId),
      { incidents: 1, active: 0, detected: 0, resolved: 1, went_down: 0, recovered: 1 });

    await reset(tlsId);
    await seedActiveIncident(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    eq("A4 INCIDENT_ACTIVE+Expired -> nothing new", await counts(tlsId),
      { incidents: 1, active: 1, detected: 0, resolved: 0, went_down: 0, recovered: 0 });

    /* ================= C. cause coverage ================= */
    const causeCases: { name: string; status: Status; val: ValidationChecks | null; rev: Rev; cause: string }[] = [
      { name: "C13 unreachable", status: "Unreachable", val: null, rev: "unknown", cause: "unreachable" },
      { name: "C14 expired", status: "Expired", val: ok({ expiry_boundary_check: false }), rev: "good", cause: "expired" },
      { name: "C15 revoked", status: "Invalid", val: ok(), rev: "revoked", cause: "revoked" },
      { name: "C16 hostname", status: "Invalid", val: ok({ check_hostname_match: false }), rev: "good", cause: "hostname_mismatch" },
      { name: "C17 other", status: "Invalid", val: ok({ certificate_trust_check: false }), rev: "good", cause: "other" },
      { name: "C18 expired>revoked", status: "Expired", val: ok({ expiry_boundary_check: false }), rev: "revoked", cause: "expired" },
    ];
    for (const t of causeCases) {
      await reset(tlsId);
      await run(client, tlsId, t.status, t.val, t.rev);
      eq(t.name, await latestCause(tlsId), t.cause);
    }

    /* ================= D. full lifecycle ================= */
    await reset(tlsId);
    const seq: Status[] = ["Valid", "Expired", "Expired", "Unreachable", "Valid", "Valid", "Invalid"];
    for (const s of seq) {
      const val = s === "Unreachable" ? null : ok(s === "Expired" ? { expiry_boundary_check: false } : {});
      await run(client, tlsId, s, val, "good");
    }
    eq("D full lifecycle final counts", await counts(tlsId),
      { incidents: 2, active: 1, detected: 2, resolved: 1, went_down: 2, recovered: 1 });

    /* ================= E. idempotency ================= */
    await reset(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    eq("E1 consecutive DOWN -> one incident", await counts(tlsId),
      { incidents: 1, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });

    await reset(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    await run(client, tlsId, "Valid", ok(), "good");
    await run(client, tlsId, "Valid", ok(), "good");
    await run(client, tlsId, "Valid", ok(), "good");
    eq("E2 consecutive UP -> one close", await counts(tlsId),
      { incidents: 1, active: 0, detected: 1, resolved: 1, went_down: 1, recovered: 1 });

    /* ================= F. resolved incident does not block a new one ================= */
    await reset(tlsId);
    await seedResolvedIncident(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    eq("F resolved incident -> new incident opens", await counts(tlsId),
      { incidents: 2, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });

    /* ================= G. monitor isolation ================= */
    const monB = await seedMonitor(userId);
    await reset(tlsId);
    await reset(monB);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good"); // open A
    await run(client, monB, "Expired", ok({ expiry_boundary_check: false }), "good");   // open B
    eq("G1 monitor A opened independently", await counts(tlsId),
      { incidents: 1, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });
    eq("G1 monitor B opened independently", await counts(monB),
      { incidents: 1, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });
    await run(client, tlsId, "Valid", ok(), "good"); // close A only
    eq("G2 A closed", await counts(tlsId),
      { incidents: 1, active: 0, detected: 1, resolved: 1, went_down: 1, recovered: 1 });
    eq("G2 B untouched", await counts(monB),
      { incidents: 1, active: 1, detected: 1, resolved: 0, went_down: 1, recovered: 0 });

    /* ================= H. field / timestamp correctness ================= */
    await reset(tlsId);
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    eq("H1 open sets fields", await incidentRow(tlsId),
      { is_active: true, has_started: true, has_resolved: false, has_alert: true });
    await run(client, tlsId, "Valid", ok(), "good");
    eq("H2 close sets fields", await incidentRow(tlsId),
      { is_active: false, has_started: true, has_resolved: true, has_alert: true });

    /* ================= I. atomicity / rollback ================= */
    // I1: an OPEN rolled back must leave nothing behind (all writes were on the txn client)
    await reset(tlsId);
    await client.query("BEGIN");
    await run(client, tlsId, "Expired", ok({ expiry_boundary_check: false }), "good");
    await client.query("ROLLBACK");
    eq("I1 rolled-back open -> nothing persists", await counts(tlsId),
      { incidents: 0, active: 0, detected: 0, resolved: 0, went_down: 0, recovered: 0 });

    // I2: a CLOSE rolled back must leave the (committed) incident STILL active
    await reset(tlsId);
    await seedActiveIncident(tlsId);           // committed via db.query
    await client.query("BEGIN");
    await run(client, tlsId, "Valid", ok(), "good");
    await client.query("ROLLBACK");
    eq("I2 rolled-back close -> incident still active", await counts(tlsId),
      { incidents: 1, active: 1, detected: 0, resolved: 0, went_down: 0, recovered: 0 });
  } finally {
    client.release();
    await db.query(`DELETE FROM monitor WHERE monitor_name = $1`, [TEST_NAME]); // cascade cleanup (A + any extra seeded monitors)
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
