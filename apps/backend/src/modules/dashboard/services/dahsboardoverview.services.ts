import { UPTIME_STATS_PERIOD } from "../../../constants/constants";
import { db } from "../../../db";
import { uptimeStatsProps, overViewStatsProps } from "../../../db/db-types";
import { QueryResult } from "pg";
import logger from "../../../config/logger";

export const fetchDashboardOverviewData = async (user_id: string) => {
  const fetch_stats_query = `select count(*) FILTER (WHERE checked_at >= date_trunc('day', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata') AS total_checks,
    ROUND(AVG(response_time) FILTER (WHERE u.status = 'UP')) AS avg_total_checks,
    COUNT(DISTINCT m.id) FILTER (WHERE m.status = 'UP' and m.is_active = 'true') AS up_count,
    COUNT(DISTINCT m.id) FILTER (WHERE m.status = 'DOWN' and m.is_active = 'true') AS down_count,
    COUNT(DISTINCT m.id ) AS total_monitors,
    COUNT(DISTINCT m.id) FILTER(where m.is_active = 'false') AS paused_monitors,
    COUNT(DISTINCT m.id) FILTER(where m.status = 'UNKNOWN' and m.is_active = true) AS unknown_count
    from monitor m left join url_checks u on m.id = u.monitor_id where user_id = $1`;

  const fetch_stats_value = [user_id];

  const fetch_uptime_query = `select ROUND(COUNT(*) FILTER (WHERE u.status = 'UP' ) * 100.0 / NULLIF(COUNT(*),0),2)
                              AS uptime_percentage from monitor m inner join url_checks u on m.id = u.monitor_id
                              WHERE checked_at >= NOW() - INTERVAL '${UPTIME_STATS_PERIOD} days' and user_id = $1`;

  const fetch_uptime_value = [user_id];
  try {
    const get_stats: QueryResult<overViewStatsProps> = await db.query(
      fetch_stats_query,
      fetch_stats_value,
    );
    const get_rows = get_stats.rows[0];

    const get_uptime_stats: QueryResult<uptimeStatsProps> = await db.query(
      fetch_uptime_query,
      fetch_uptime_value,
    );
    const get_uptime_rows = get_uptime_stats.rows[0].uptime_percentage;

    const get_overview_data = {
      total_checks: Number(get_rows.total_checks),
      avg_total_checks:
        get_rows.avg_total_checks === null
          ? null
          : Number(get_rows.avg_total_checks),
      up_count: Number(get_rows.up_count),
      down_count: Number(get_rows.down_count),
      total_monitors: Number(get_rows.total_monitors),
      paused_monitors: Number(get_rows.paused_monitors),
      uptime_percentage:
        get_uptime_rows === null ? null : Number(get_uptime_rows),
    };

    logger.debug({ userId: user_id }, "fetched dashboard overview");
    return get_overview_data;
  } catch (err) {
    logger.error(
      { err, userId: user_id },
      "dashboard overview fetch failed",
    );
    throw err;
  }
};
