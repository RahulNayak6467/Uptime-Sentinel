import { db } from "../db";
import { QueryResult } from "pg";
import { allMonitorsDataProps } from "../types/types";

export const getAllMonitorInfo = async (
  query: (string | null | boolean)[],
  pageNumber: number,
  limit: number,
  offset: number,
) => {
  const all_monitors_query = `
        SELECT
            m.url_name,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status,
            m.id,
            ROUND(AVG(u.response_time), 0) AS avg_response_time,
            ROUND(COUNT(u.id) FILTER (WHERE u.status = 'UP' ) * 100.0 / NULLIF(COUNT(u.id),0),2)
                AS uptime_percentage,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'responseTime', u.response_time
                    )
                ) FILTER (WHERE u.id IS NOT NULL),
                '[]'
            ) AS response
        FROM monitor m
        LEFT JOIN url_checks u
            ON m.id = u.monitor_id
        WHERE m.user_id = $1
        AND ($2::text IS NULL OR m.status = $2::text)
        AND ($3::boolean IS NULL OR m.is_active = $3::boolean)
        GROUP BY
            m.url_name,
            m.id,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status
        ORDER BY m.created_at
        OFFSET $4
        LIMIT $5
    `;

  console.log(query);

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
      urlName: data.url_name,
      intervalSeconds: data.interval_seconds,
      nextCheckAt: data.next_check_at,
      status: data.status,
      avgResponseTime: data.avg_response_time,
      response: data.response,
      uptimePercentage: data.uptime_percentage,
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

  console.log(paginatedMonitorsData);

  return paginatedMonitorsData;
};
