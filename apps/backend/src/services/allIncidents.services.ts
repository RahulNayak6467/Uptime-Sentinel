import { QueryResult } from "pg";
import { db } from "../db";
import { IncidentsDataProps } from "../types/db-types";

export const getIncidentsDataServices = async (
  user_id: string,
  limit: number,
  offset: number,
  pageNumber: number,
) => {
  const get_incidents_query =
    "SELECT m.url_name,i.started_at,m.url,i.resolved_at,i.is_active,i.id from monitor m inner join incidents i on m.id = i.monitor_id where m.user_id = $1 order by i.started_at DESC OFFSET $2 LIMIT $3";
  const get_incidents_value = [user_id, offset, limit];

  const getIncidentsData: QueryResult<IncidentsDataProps> = await db.query(
    get_incidents_query,
    get_incidents_value,
  );

  const total_page_query =
    "SELECT COUNT(i.id) AS total_count from incidents i inner join monitor m on i.monitor_id = m.id where m.user_id = $1";

  const total_page_value = [user_id];

  const get_total_page = await db.query(total_page_query, total_page_value);

  const getTotalPage: number = get_total_page.rows[0].total_count;

  const totalPage = Math.ceil(getTotalPage / limit) ?? 0;

  const rows = getIncidentsData.rows;

  const incidentsData = rows.map((el) => {
    return {
      id: el.id,
      urlName: el.url_name,
      url: el.url,
      resolvedAt: el.resolved_at,
      startedAt: el.started_at,
      httpStatus: 500,
      isActive: el.is_active,
    };
  });

  console.log("INCIDENTS DATA:", incidentsData);
  console.log("LIMIT", limit);
  console.log("OFFSET", offset);
  console.log("PAGE NUMBER", pageNumber);

  const paginatedIncidentsData = {
    data: incidentsData,
    pagination: {
      page: pageNumber,
      limit: limit,
      totalPage,
    },
  };
  return paginatedIncidentsData;
};
