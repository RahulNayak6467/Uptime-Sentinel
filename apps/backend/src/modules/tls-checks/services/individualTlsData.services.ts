import { computeComparePin, computeRenewalComparison, connectionInfo, lifetimeHistoryStats } from "../../../checkers/tls/deriveTls";
import { db } from "../../../db";
import { checkTlsHealth } from "./tls.services"

export const getTlsDataServices = async (tls_id: string, user_id: string) => {

  const fetchTlsData = await checkTlsHealth(user_id, tls_id);

  const snapshotRows = await db.query(
    `SELECT fingerprint_sha256, valid_from, valid_to, first_seen_at,
            serial_number, issuer, asymmetric_key_type, nist_curve, key_bits, san_names AS san
     FROM tls_cert_snapshots
     WHERE monitor_id = $1
     ORDER BY first_seen_at DESC
     LIMIT 10`,
    [tls_id],
  );

  const lifetime = lifetimeHistoryStats(snapshotRows.rows);

  const renewalComparison = computeRenewalComparison(snapshotRows.rows.slice(0, 2));

  const configRow = await db.query(
    `SELECT m.url, m.url AS host, m.interval_seconds, m.next_check_at, m.request_timeout_ms AS request_time_out_ms,
            c.warning_threshold_days, c.expiry_alert_thresholds, c.min_tls_version
     FROM tls_config c
     JOIN monitor m ON m.id = c.monitor_id
     WHERE c.monitor_id = $1`,
    [tls_id],
  );

  const config = connectionInfo(configRow.rows[0]);

  const pinRow = await db.query(
    `SELECT pinned_fingerprint, pinned_at, auto_repin FROM tls_config WHERE monitor_id = $1`,
    [tls_id],
  );

  const currentFingerprint =
    fetchTlsData.certificate?.leaf_certificate.finger_print ?? "";

  const pinning = computeComparePin(
    currentFingerprint,
    pinRow.rows[0].pinned_fingerprint,
    pinRow.rows[0].pinned_at ?? fetchTlsData.checkedAt,
    pinRow.rows[0].auto_repin,
  );

  const renewalsRow = await db.query(
    `SELECT COUNT(*) AS count FROM tls_events
     WHERE monitor_id = $1 AND type = 'renewed' AND occurred_at >= NOW() - INTERVAL '365 days'`,
    [tls_id],
  );
  const renewals = Number(renewalsRow.rows[0].count);

  const alertsRow = await db.query(
    `SELECT enabled_alerts FROM tls_config WHERE monitor_id = $1`,
    [tls_id],
  );

  return {
    ...fetchTlsData,
    renewals,
    nextCheckAt: config.nextCheckAt,
    lifetime,
    renewalComparison,
    pinning,
    config,
    alerts: { enabledAlerts: alertsRow.rows[0].enabled_alerts },
  };

}
