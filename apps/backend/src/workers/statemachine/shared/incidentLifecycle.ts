import { PoolClient } from "pg";
import { db } from "../../../db";

export const getActiveIncident = async (monitor_id: string) => {
  const is_active_query =
    "SELECT id, started_at,last_alert_sent_at FROM incidents WHERE monitor_id = $1 AND is_active = true LIMIT 1";
  const is_active_values = [monitor_id];
  const checkIsActive = await db.query(is_active_query, is_active_values);
  const activeRows = checkIsActive.rows.length;
  if (activeRows === 0) {
    return null;
  }
  return checkIsActive.rows[0];
};

export const updateResolvedAt = async (client: PoolClient,incident_id: string) => {
  try {
    const update_resolvedAt_query =
      "UPDATE incidents SET is_active = false, resolved_at = NOW() where  id = $1 RETURNING resolved_at";
    const update_resolvedAt_values = [incident_id];
    const updatedResult = await client.query(
      update_resolvedAt_query,
      update_resolvedAt_values,
    );

    const resolved_at = updatedResult.rows[0].resolved_at;

    const insert_incidentUpdates_query =
      "INSERT INTO incident_updates (incident_id,type,occurred_at) VALUES($1,$2, $3)";
    const insert_incidentsUpdates_values = [
      incident_id,
      "resolved",
      resolved_at,
    ];

    await client.query(
      insert_incidentUpdates_query,
      insert_incidentsUpdates_values,
    );

  } catch (err) {
    throw err;
  }
};

export const insertIntoIncidentsTable = async (client: PoolClient, monitor_id: string) => {
  try {
    const insert_incidents_query =
      "INSERT INTO incidents (monitor_id,is_active,last_alert_sent_at) VALUES($1, $2, NOW()) RETURNING id,started_at";
    const insert_incidents_values = [monitor_id, true];

    const result = await client.query(
      insert_incidents_query,
      insert_incidents_values,
    );

    const incident_id = result.rows[0].id;
    const started_at = result.rows[0].started_at;

    const insert_incidentsUpdates_query =
      "INSERT INTO incident_updates (incident_id,type,occurred_at) VALUES($1, $2, $3)";

    const insert_incidentsUpdates_values = [
      incident_id,
      "detected",
      started_at,
    ];

    await client.query(
      insert_incidentsUpdates_query,
      insert_incidentsUpdates_values,
    );

    return incident_id;
  } catch (err) {
    throw err;
  }
};

export const insertIntoNotificationsTable = async (
  id: string,
  resendId: string | null,
  status: "sent" | "failed",
  type: "down" | "recovery" | "reminder",
) => {
  const insert_notifications_query =
    "INSERT INTO notification_logs (incident_id,resend_email_id,type,status) VALUES($1,$2,$3,$4)";
  const insert_notifications_values = [id, resendId, type, status];
  await db.query(insert_notifications_query, insert_notifications_values);
};

export const updateLastAlertSentAt = async (incident_id: string) => {
  const updatelast_alert_query =
    "UPDATE incidents SET last_alert_sent_at = NOW() where id = $1";
  const updatelast_alert_values = [incident_id];
  await db.query(updatelast_alert_query, updatelast_alert_values);
};
