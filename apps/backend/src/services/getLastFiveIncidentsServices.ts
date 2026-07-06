import { QueryResult } from "pg";
import { db } from "../db";
import { AppError } from "../errors/AppError";
import { lastFiveIncidentDataProps } from "../types/db-types";

export const getLastFiveIncidentsServices = async (
  user_id: string,
  monitorId: string,
) => {
  const get_monitor_query =
    "SELECT url_name from monitor where user_id = $1 and id = $2";

  const get_monitor_values = [user_id, monitorId];

  const getMonitor = await db.query(get_monitor_query, get_monitor_values);

  const getMonitorRows = getMonitor.rows;

  if (getMonitorRows.length === 0) {
    throw new AppError(404, "Monitor not found", "MONITOR_NOT_FOUND");
  }

  const get_lastFive_query = `SELECT i.id,i.title,i.is_active,i.started_at,i.resolved_at
    FROM incidents i JOIN monitor m ON i.monitor_id = m.id
    where m.user_id = $1 and m.id = $2
    ORDER BY i.started_at DESC
    LIMIT 5`;

  const get_lastFive_values = [user_id, monitorId];

  const getLastFiveData: QueryResult<lastFiveIncidentDataProps> =
    await db.query(get_lastFive_query, get_lastFive_values);

  const rows = getLastFiveData.rows;

  return rows;
};
