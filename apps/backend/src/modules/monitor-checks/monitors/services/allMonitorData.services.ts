import { db } from "../../../../db";
import { QueryResult } from "pg";
import { allMonitorsDataProps } from "../../../../shared/types/types";
import logger from "../../../../config/logger";

export const getAllMonitorInfo = async (
  query: (string | null | boolean | number)[],
  pageNumber: number,
  limit: number,
  offset: number,
) => {
  const all_monitors_query = `
        WITH checks AS (
            SELECT monitor_id, status, response_time, checked_at FROM url_checks
            UNION ALL
            SELECT monitor_id,
                   CASE WHEN status IN ('Valid', 'Expiring') THEN 'UP' ELSE 'DOWN' END AS status,
                   tls_handshake_time_ms AS response_time,
                   created_at AS checked_at
            FROM tls_checks
        )
        SELECT
            m.monitor_name,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status,
            m.id,
            m.last_status_code,
            m.monitor_type,
            ROUND(AVG(c.response_time), 0) AS avg_response_time,
            ROUND(COUNT(c.monitor_id) FILTER (WHERE c.status = 'UP' ) * 100.0 / NULLIF(COUNT(c.monitor_id),0),2)
                AS uptime_percentage,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'responseTime', c.response_time
                    )
                     ORDER BY c.checked_at
                ) FILTER (WHERE c.monitor_id IS NOT NULL),
                '[]'
            ) AS response
        FROM monitor m
        LEFT JOIN checks c
            ON m.id = c.monitor_id
        WHERE m.user_id = $1
        AND ($2::text IS NULL OR m.status = $2::text)
        AND ($3::boolean IS NULL OR m.is_active = $3::boolean)
        GROUP BY
            m.monitor_name,
            m.id,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status,
            m.last_status_code,
            m.monitor_type
        ORDER BY m.created_at
        OFFSET $4
        LIMIT $5
    `;

  const all_monitors_value = query;

  const all_monitors_data: QueryResult<allMonitorsDataProps> = await db.query(
    all_monitors_query,
    all_monitors_value,
  );

  const get_totalCount_query =
    "SELECT COUNT(*) AS total_count FROM monitor where user_id = $1";

  const get_totalCount_value = [query[0]];

  const getTotalCountQuery = await db.query(
    get_totalCount_query,
    get_totalCount_value,
  );

  const totalMonitors = getTotalCountQuery.rows[0].total_count || 1;

  const totalPage = Math.ceil(totalMonitors / limit);

  const rows = all_monitors_data.rows;

  const allMonitorsData = rows.map((data) => {
    return {
      id: data.id,
      url: data.url,
      monitorName: data.monitor_name,
      intervalSeconds: data.interval_seconds,
      nextCheckAt: data.next_check_at,
      status: data.status,
      monitorType: data.monitor_type,
      avgResponseTime: data.avg_response_time,
      response: data.response,
      uptimePercentage: data.uptime_percentage,
      statusCode: data.last_status_code,
    };
  });

  const paginatedMonitorsData = {
    data: allMonitorsData,
    pagination: {
      page: pageNumber,
      limit: limit,
      totalPage,
    },
  };

  logger.debug(
    {
      userId: query[0],
      page: pageNumber,
      totalPage,
      monitorCount: rows.length,
    },
    "fetched monitors",
  );

  return paginatedMonitorsData;
};
