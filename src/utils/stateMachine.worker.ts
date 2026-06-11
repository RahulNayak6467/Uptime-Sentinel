import { db } from "../db/index";
import {
  addToDownAlertEmailQueue,
  addToRecoveryEmailQueue,
} from "../queue/alertEmailQueue";

const getActiveIncident = async (url_id: string) => {
  let activeIncident: boolean = false;
  const is_active_query =
    "SELECT is_active FROM incidents where monitor_id = $1 and is_active = true";
  const is_active_values = [url_id];
  const checkIsActive = await db.query(is_active_query, is_active_values);
  const activeRows = checkIsActive.rows.length;
  if (activeRows > 0) {
    activeIncident = true;
  }
  return activeIncident;
};

const updateResolvedAt = async (url_id: string) => {
  const update_resolvedAt_query =
    "UPDATE incidents SET is_active = false, resolved_at = NOW() where monitor_id = $1";
  const update_resolvedAt_values = [url_id];
  await db.query(update_resolvedAt_query, update_resolvedAt_values);
};

const insertIntoIncidentsTable = async (url_id: string) => {
  const insert_incidents_query =
    "INSERT INTO incidents (monitor_id,is_active) VALUES($1, $2)";
  const insert_incidents_values = [url_id, true];
  const insertIntoIncidents = await db.query(
    insert_incidents_query,
    insert_incidents_values,
  );
};

const getLastTwoChecks = async (url_id: string) => {
  let isDown: boolean = false;
  const check_down_query =
    "SELECT status from url_checks where monitor_id = $1 ORDER BY checked_at DESC LIMIT 5";
  const check_down_values = [url_id];
  const getStatusValues = await db.query(check_down_query, check_down_values);
  const isActiveIncident = await getActiveIncident(url_id);

  console.log(getStatusValues);
  const rows = getStatusValues.rows.length;
  if (rows < 5) {
    return isDown;
  }
  const isDownAlert = getStatusValues.rows.every(
    (checks) => checks.status === "DOWN",
  );
  if (isDownAlert && !isActiveIncident) {
    await insertIntoIncidentsTable(url_id);
  }
  if (isDownAlert) {
    isDown = true;
  }
  if (!isDownAlert && isActiveIncident) {
    await updateResolvedAt(url_id);
  }

  return isDown;
};
// getLastTwoChecks(monitorId)
export const runStateMachine = async (url_id: string) => {
  const currentState = (await getActiveIncident(url_id))
    ? "INCIDENT_ACTIVE"
    : "NO_INCIDENT";
  const event = (await getLastTwoChecks(url_id)) ? "URL_DOWN" : "URL_UP";

  const transitions = {
    "NO_INCIDENT:URL_DOWN": async () => {
      await addToDownAlertEmailQueue(url_id);
    },
    "NO_INCIDENT:URL_UP": async () => {},
    "INCIDENT_ACTIVE:URL_DOWN": async () => {},
    "INCIDENT_ACTIVE:URL_UP": async () => {
      await addToRecoveryEmailQueue(url_id);
    },
  };
  console.log(`${currentState}:${event}`);
  const action = transitions[`${currentState}:${event}`];

  await action();
};
