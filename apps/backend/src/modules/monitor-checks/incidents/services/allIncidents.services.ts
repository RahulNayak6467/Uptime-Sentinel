import { QueryResult } from "pg";
import { db } from "../../../../db";
import { IncidentsDataProps } from "../../../../db/db-types";
import logger from "../../../../config/logger";
import {
  incidentStatusPredicate,
  IncidentStatusFilter,
} from "../validations/incidentListValidation";
import { mapIncidentListRow } from "./incidentResponse";

export const getIncidentsDataServices = async (
  user_id: string,
  limit: number,
  offset: number,
  pageNumber: number,
  status: IncidentStatusFilter,
) => {
  const statusPredicate = incidentStatusPredicate(status);
  const get_incidents_query = `
    SELECT
      m.monitor_name,
      m.monitor_type,
      i.started_at,
      m.url,
      i.resolved_at,
      i.is_active,
      i.id,
      failure.status_code AS failure_status_code,
      failure.error_message AS failure_reason
    from monitor m
    inner join incidents i on m.id = i.monitor_id
    LEFT JOIN LATERAL (
      SELECT uc.status_code, uc.error_message
      FROM url_checks uc
      WHERE uc.monitor_id = m.id
        AND uc.status = 'DOWN'
        AND uc.checked_at <= i.started_at
      ORDER BY uc.checked_at DESC
      LIMIT 1
    ) failure ON true
    where m.user_id = $1
    ${statusPredicate}
    order by i.started_at DESC
    OFFSET $2 LIMIT $3
  `;
  const get_incidents_value = [user_id, offset, limit];

  const getIncidentsData: QueryResult<IncidentsDataProps> = await db.query(
    get_incidents_query,
    get_incidents_value,
  );

  const total_page_query = `
    SELECT COUNT(i.id) AS total_count
    from incidents i
    inner join monitor m on i.monitor_id = m.id
    where m.user_id = $1
    ${statusPredicate}
  `;

  const total_page_value = [user_id];

  const get_total_page = await db.query(total_page_query, total_page_value);

  const getTotalPage: number = get_total_page.rows[0].total_count;

  const totalPage = Math.ceil(getTotalPage / limit) ?? 0;

  const rows = getIncidentsData.rows;

  const incidentsData = rows.map(mapIncidentListRow);

  const paginatedIncidentsData = {
    data: incidentsData,
    pagination: {
      page: pageNumber,
      limit: limit,
      totalPage,
    },
  };
  logger.debug(
    { userId: user_id, page: pageNumber, totalPage, incidentCount: rows.length },
    "fetched incidents",
  );
  return paginatedIncidentsData;
};
