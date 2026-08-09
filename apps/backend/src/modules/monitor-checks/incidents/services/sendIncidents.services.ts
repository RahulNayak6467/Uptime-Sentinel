import { QueryResult } from "pg";
import { db } from "../../../../db";
import { AppError } from "../../../../shared/errors/AppError";
import { formatDuration } from "../../../../shared/utils/formatDate";
import logger from "../../../../config/logger";
import { LIMIT_RECENT_INCIDENTS } from "../../../../constants/constants";

interface incidentsTableDataProps {
  id: string;
  monitorName: string;
  url: string;
  startedAt: Date;
  resolvedAt: Date;
  isActive: boolean;
  duration: string;
}

export const getIncidentsDetailsById = async (
  url_id: string,
  user_id: string,
) => {
  console.log(url_id);
  const incidents_info_query = `
    SELECT i.id,i.resolved_at,i.started_at,i.is_active,m.url,m.monitor_name
    FROM incidents i
    left join monitor m on m.id = i.monitor_id
    where m.user_id = $1 and m.id = $2
    ORDER BY i.started_at DESC
    LIMIT 10
  `;
  const incidents_info_values = [user_id, url_id, LIMIT_RECENT_INCIDENTS];
  try {
    const getFromIncidentTable = await db.query(
      incidents_info_query,
      incidents_info_values,
    );

    console.log(getFromIncidentTable);

    const get_monitorId_query = `
      SELECT id
      FROM monitor
      where user_id = $1
      AND id = $2`

    const get_monitorId_values = [user_id,url_id]

    const getMonitorId = await db.query(get_monitorId_query, get_monitorId_values);

    console.log(getMonitorId.rows.length)

    const rows = getFromIncidentTable.rows.length;

    if (getMonitorId.rows.length !== 0) {
      return getFromIncidentTable.rows
    }

    if (rows === 0) {
      throw new AppError(404, "No incidents exist", "INCIDENTS_NOT_FOUND");
    }


    const response: incidentsTableDataProps[] = getFromIncidentTable.rows.map(
      (url) => {
        return {
          id: url.id as string,
          monitorName: url.monitor_name as string,
          url: url.url as string,
          startedAt: url.started_at as Date,
          resolvedAt: url.resolved_at as Date,
          isActive: url.is_active as boolean,
          duration: formatDuration(url.started_at, url.resolved_at) as string,
        };
      },
    );

    logger.debug(
      { userId: user_id, monitorId: url_id, incidentCount: response.length },
      "fetched monitor incidents",
    );
    return response;
  } catch (err) {
    throw err;
  }
};
