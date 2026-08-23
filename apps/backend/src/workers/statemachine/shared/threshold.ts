import { db } from "../../../db";

export const hasConsecutiveFailures = async (url_id: string,failureThresholdCount:number) => {
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

export const getThresholdValues = async(user_id: string, url_id: string) => {
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



export const checkConsecutiveSuccess  = async (url_id: string, user_id: string,recoveryThreshold: number) => {
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


export const updateMonitorStatus = async (
  status: "UP" | "DOWN",
  statusCode: number | null,
  user_id: string,
  url_id: string,
) => {
  const update_monitor_query =
    "UPDATE monitor SET status = $1, last_status_code = $2 where id = $3 and user_id = $4";
  const update_monitor_values = [status, statusCode, url_id, user_id];

  await db.query(update_monitor_query, update_monitor_values);
};
