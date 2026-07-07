import logger from "../config/logger";
import { db } from "../db/index";
import {
  addReminderEmailQueue,
  addToDownAlertEmailQueue,
  addToRecoveryEmailQueue,
} from "../queue/alertEmailQueue";
import { getMinutesDifference } from "./formatDate";

const getActiveIncident = async (url_id: string) => {
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

const updateResolvedAt = async (incident_id: string) => {
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

const insertIntoIncidentsTable = async (url_id: string) => {
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

const hasConsecutiveFailures = async (url_id: string) => {
  let isDown: boolean = false;
  const check_down_query =
    "SELECT status from url_checks where monitor_id = $1 ORDER BY checked_at DESC LIMIT 2";
  const check_down_values = [url_id];
  const getStatusValues = await db.query(check_down_query, check_down_values);

  const rows = getStatusValues.rows.length;
  if (rows < 2) {
    return isDown;
  }
  const isDownAlert = getStatusValues.rows.every(
    (checks) => checks.status === "DOWN",
  );

  if (isDownAlert) {
    isDown = true;
  }

  return isDown;
};

export const runStateMachine = async (
  url_id: string,
  status: "UP" | "DOWN",
) => {
  const activeIncident = await getActiveIncident(url_id);
  const currentState = activeIncident ? "INCIDENT_ACTIVE" : "NO_INCIDENT";
  const event = status === "DOWN" ? "URL_DOWN" : "URL_UP";

  const transitions = {
    "NO_INCIDENT:URL_DOWN": async () => {
      const isUrlDown = await hasConsecutiveFailures(url_id);
      if (!isUrlDown) {
        return;
      }
      const incident_id = await insertIntoIncidentsTable(url_id);
      await addToDownAlertEmailQueue(url_id, incident_id);
    },
    "NO_INCIDENT:URL_UP": async () => {},
    "INCIDENT_ACTIVE:URL_DOWN": async () => {
      const reminderEmailTime = getMinutesDifference(
        activeIncident.last_alert_sent_at,
      );
      if (reminderEmailTime > 2) {
        await addReminderEmailQueue(url_id, activeIncident.id);
      } else {
        return;
      }
    },
    "INCIDENT_ACTIVE:URL_UP": async () => {
      await updateResolvedAt(activeIncident.id);
      await addToRecoveryEmailQueue(url_id, activeIncident.id);
    },
  };

  logger.debug(
    { currentState, event },
    "Event type as processed by state machine",
  );

  const action = transitions[`${currentState}:${event}`];

  await action();
};
