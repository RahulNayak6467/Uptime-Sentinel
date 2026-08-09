import { QueryResult } from "pg";
import { db } from "../../../../db";
import {
  IncidentStatsCardInfo,
  IncidentStatsQueryResult,
} from "../../../../db/db-types";
import logger from "../../../../config/logger";

export const getIncidentsStatsCardInfo = async (
  user_id: string,
): Promise<IncidentStatsCardInfo> => {
  const get_incidents_query = `
    WITH period_bounds AS (
      SELECT
        NOW() - INTERVAL '30 days' AS period_start,
        NOW() AS period_end
    )
    SELECT
      COUNT(*) FILTER (
        WHERE i.is_active = true
          AND i.started_at >= bounds.period_start
          AND i.started_at < bounds.period_end
      ) AS active_incidents,

      COUNT(*) FILTER (
        WHERE i.started_at >= bounds.period_start
          AND i.started_at < bounds.period_end
      ) AS total_incidents,

      ROUND((
        AVG(
          EXTRACT(
            EPOCH FROM (COALESCE(i.resolved_at, NOW()) - i.started_at)
          )
        ) FILTER (
          WHERE i.started_at >= bounds.period_start
            AND i.started_at < bounds.period_end
        ) / 60
      )::numeric, 0) AS average_duration_minutes,

      ROUND((
        AVG(
          EXTRACT(EPOCH FROM (i.resolved_at - i.started_at))
        ) FILTER (
          WHERE i.resolved_at >= bounds.period_start
            AND i.resolved_at < bounds.period_end
        ) / 60
      )::numeric, 0) AS mttr_minutes

    FROM incidents i
    INNER JOIN monitor m ON m.id = i.monitor_id
    CROSS JOIN period_bounds bounds
    WHERE m.user_id = $1
  `;

  const get_incidents_value = [user_id];

  const result: QueryResult<IncidentStatsQueryResult> = await db.query(
    get_incidents_query,
    get_incidents_value,
  );

  const stats = result.rows[0];

  logger.debug({ userId: user_id }, "fetched incident statistics");
  return {
    activeIncidents: Number(stats.active_incidents),
    totalIncidents: Number(stats.total_incidents),
    averageDurationMinutes: Number(stats.average_duration_minutes ?? 0),
    mttrMinutes: Number(stats.mttr_minutes ?? 0),
  };
};
