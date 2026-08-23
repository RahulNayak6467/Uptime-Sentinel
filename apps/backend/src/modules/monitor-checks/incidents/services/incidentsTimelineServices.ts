import { QueryResult } from "pg";
import { db } from "../../../../db";
import { IncidentTimelineProps } from "../../../../db/db-types";
import logger from "../../../../config/logger";

export const getIncidentsTimelineServices = async (
  user_id: string,
  limit: number,
  offset: number,
  pageNumber: number,
) => {
  const get_incidentsTimeline_query = `SELECT
      i.title,
      iu.incident_id,
      jsonb_agg(
          jsonb_build_object(
              'id', iu.id,
              'type', iu.type,
              'message', iu.message,
              'occurred_at', iu.occurred_at
          )
          ORDER BY iu.occurred_at
      ) AS updates
  FROM incident_updates iu
  JOIN incidents i ON iu.incident_id = i.id
  JOIN monitor m ON i.monitor_id = m.id
  WHERE m.user_id = $1
  GROUP BY iu.incident_id,i.started_at,i.title
  ORDER BY i.started_at DESC
  OFFSET $2 LIMIT $3
  ;
    `;

  const get_incidentsTimeline_value = [user_id, offset, limit];

  const getTimeline: QueryResult<IncidentTimelineProps> = await db.query(
    get_incidentsTimeline_query,
    get_incidentsTimeline_value,
  );

  const rows = getTimeline.rows;

  const total_page_query =
    "SELECT COUNT(i.id) AS total_count from incidents i inner join monitor m on i.monitor_id = m.id where m.user_id = $1";

  const total_page_value = [user_id];

  const get_total_page = await db.query(total_page_query, total_page_value);

  const getTotalPage: number = get_total_page.rows[0].total_count;

  const totalPage = Math.ceil(getTotalPage / limit) ?? 0;

  const paginatedIncidentsData = {
    data: rows,
    pagination: {
      page: pageNumber,
      limit: limit,
      totalPage,
    },
  };

  logger.debug(
    { userId: user_id, page: pageNumber, totalPage, timelineCount: rows.length },
    "fetched incident timelines",
  );
  return paginatedIncidentsData;
};
