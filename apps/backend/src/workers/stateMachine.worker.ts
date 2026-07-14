import logger from "../config/logger";
import { db } from "../db/index";
import {
  addReminderEmailQueue,
  addToDownAlertEmailQueue,
  addToRecoveryEmailQueue,
} from "../queue/alertEmailQueue";
import { getMinutesDifference } from "../shared/utils/formatDate";

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

const hasConsecutiveFailures = async (url_id: string,failureThresholdCount:number) => {
  let isDown: boolean = false;
  const check_down_query =
    "SELECT status from url_checks where monitor_id = $1 ORDER BY checked_at DESC LIMIT $2";
  const check_down_values = [url_id,failureThresholdCount];
  const getStatusValues = await db.query(check_down_query, check_down_values);

  const rows = getStatusValues.rows.length;
  if (rows < failureThresholdCount) {
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

const getThresholdValues = async(user_id: string, url_id: string) => {
  const get_threshold_query = `SELECT
    failure_threshold,recovery_threshold
    FROM monitor
    where id = $1
    AND user_id = $2`

  const get_threshold_values = [url_id, user_id]

  const getThreshold = await db.query(get_threshold_query,get_threshold_values)

  const failureThresholdCount = getThreshold.rows[0].failure_threshold;
  const recoveryThresholdCount = getThreshold.rows[0].recovery_threshold

  return {failureThresholdCount,recoveryThresholdCount}
}



const checkConsecutiveSuccess  = async (url_id: string, user_id: string,recoveryThreshold: number) => {
  let isRecovered: boolean = false
  const check_recovered_query = `SELECT u.status
    FROM monitor m
    JOIN url_checks u
    ON m.id = u.monitor_id
    WHERE m.id = $1
    AND m.user_id = $2
    ORDER BY u.checked_at DESC
    LIMIT $3`;

  const check_recovered_values = [url_id, user_id, recoveryThreshold];

  const checkRecovered = await db.query(check_recovered_query, check_recovered_values);

  const rows = checkRecovered.rows

  if(rows.length < recoveryThreshold) return isRecovered

  const checkConsecutiveUpStatus = rows.every((checks) => checks.status === "UP");

  if (checkConsecutiveUpStatus) {
    isRecovered = true
  }

  return isRecovered
}


const updateMonitorStatus = async (
  status: "UP" | "DOWN",
  user_id: string,
  url_id: string,
) => {
  const update_monitor_query =
    "UPDATE monitor SET status = $1 where id = $2 and user_id = $3";
  const update_monitor_values = [status, url_id, user_id];

  await db.query(update_monitor_query, update_monitor_values);
};


export const runStateMachine = async (
  user_id: string,
  url_id: string,
  status: "UP" | "DOWN"
) => {
  const activeIncident = await getActiveIncident(url_id);
  const currentState = activeIncident ? "INCIDENT_ACTIVE" : "NO_INCIDENT";
  const event = status === "DOWN" ? "URL_DOWN" : "URL_UP";

  const {failureThresholdCount,recoveryThresholdCount} = await getThresholdValues(user_id,url_id)

  const transitions = {
    "NO_INCIDENT:URL_DOWN": async () => {
      const isUrlDown = await hasConsecutiveFailures(url_id,failureThresholdCount);
      if (!isUrlDown) {
        return;
      }

      await updateMonitorStatus(status, user_id, url_id);
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
      const isUrlUp = await checkConsecutiveSuccess(url_id,user_id,recoveryThresholdCount)
      if (!isUrlUp) {
        return
      }
      await updateMonitorStatus(status, user_id, url_id);
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
