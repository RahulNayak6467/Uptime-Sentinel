import { db } from "../db/index";
import {
  addToDownAlertEmailQueue,
  addToRecoveryEmailQueue,
} from "../queue/alertEmailQueue";

const getActiveIncident = async (url_id: string) => {
  const is_active_query =
    "SELECT id, started_at FROM incidents WHERE monitor_id = $1 AND is_active = true LIMIT 1";
  const is_active_values = [url_id];
  const checkIsActive = await db.query(is_active_query, is_active_values);
  const activeRows = checkIsActive.rows.length;
  if (activeRows === 0) {
    return null;
  }
  return checkIsActive.rows[0];
};

const updateResolvedAt = async (incident_id: string) => {
  const update_resolvedAt_query =
    "UPDATE incidents SET is_active = false, resolved_at = NOW() where  id = $1";
  const update_resolvedAt_values = [incident_id];
  await db.query(update_resolvedAt_query, update_resolvedAt_values);
};

const insertIntoIncidentsTable = async (url_id: string) => {
  const insert_incidents_query =
    "INSERT INTO incidents (monitor_id,is_active) VALUES($1, $2) RETURNING id";
  const insert_incidents_values = [url_id, true];
  const result = await db.query(
    insert_incidents_query,
    insert_incidents_values,
  );
  return result.rows[0].id;
};

const hasConsecutiveFailures = async (url_id: string) => {
  let isDown: boolean = false;
  const check_down_query =
    "SELECT status from url_checks where monitor_id = $1 ORDER BY checked_at DESC LIMIT 5";
  const check_down_values = [url_id];
  const getStatusValues = await db.query(check_down_query, check_down_values);

  console.log(getStatusValues);
  const rows = getStatusValues.rows.length;
  if (rows < 5) {
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
    "INCIDENT_ACTIVE:URL_DOWN": async () => {},
    "INCIDENT_ACTIVE:URL_UP": async () => {
      await updateResolvedAt(activeIncident.id);
      await addToRecoveryEmailQueue(url_id, activeIncident.id);
    },
  };
  console.log(`${currentState}:${event}`);
  const action = transitions[`${currentState}:${event}`];

  await action();
};
