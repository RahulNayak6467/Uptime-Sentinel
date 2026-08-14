import { db } from "../../../db";

export const getActiveIncident = async (url_id: string) => {
  const is_active_query =
    "SELECT id, started_at,last_alert_sent_at FROM incidents WHERE monitor_id = $1 AND is_active = true LIMIT 1";
  const is_active_values = [url_id];
  const checkIsActive = await db.query(is_active_query, is_active_values);
  const activeRows = checkIsActive.rows.length;
  if (activeRows === 0) {
    return null;
  }
  return checkIsActive.rows[0];
};

export const updateResolvedAt = async (incident_id: string) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

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

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const insertIntoIncidentsTable = async (url_id: string) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const insert_incidents_query =
      "INSERT INTO incidents (monitor_id,is_active,last_alert_sent_at) VALUES($1, $2, NOW()) RETURNING id,started_at";
    const insert_incidents_values = [url_id, true];

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

    await client.query("COMMIT");
    return incident_id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
