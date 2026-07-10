import { QueryResult } from "pg";
import { db } from "../../../db";
import { emailAlertProps } from "../../../shared/types/types";
import { LIMIT_RECENT_ALERTS } from "../../../constants/constants";
import logger from "../../../config/logger";

export const getEmailAlertsServices = async (
  user_id: string,
  pageNumber: number,
  limit: number,
  offset: number,
) => {
  const get_emailAlert_query = ` SELECT
      n.type,
      n.status,
      n.created_at,
      m.url_name,
      n.id AS notificationId
  FROM notification_logs AS n
  INNER JOIN incidents AS i
      ON n.incident_id = i.id
  INNER JOIN monitor AS m
      ON m.id = i.monitor_id
  WHERE m.user_id = $1
    AND n.created_at >= NOW() - INTERVAL '7 days'
  ORDER BY n.created_at DESC
  OFFSET $2
  LIMIT $3`;

  const get_emailAlert_values = [user_id, offset, limit];

  const getEmailAlertDetails: QueryResult<emailAlertProps> = await db.query(
    get_emailAlert_query,
    get_emailAlert_values,
  );

  const get_totalCount_query = `SELECT COUNT(*) AS total_count  FROM notification_logs AS n
    INNER JOIN incidents AS i
        ON n.incident_id = i.id
    INNER JOIN monitor AS m
        ON m.id = i.monitor_id
    WHERE m.user_id = $1
    AND n.created_at >= NOW() - INTERVAL '7 days'`;

  const get_totalCount_value = [user_id];

  const getTotalCountQuery = await db.query(
    get_totalCount_query,
    get_totalCount_value,
  );

  const totalMonitors = getTotalCountQuery.rows[0].total_count || 1;

  const totalPage = Math.ceil(totalMonitors / limit);

  const rows = getEmailAlertDetails.rows;

  const emailAlertsResponse = rows.map((email) => {
    return {
      id: email.notificationId,
      urlName: email.url_name,
      type: email.type,
      status: email.status,
      sentAt: email.created_at,
    };
  });

  const emailAlertResponsePagination = {
    data: emailAlertsResponse,
    pagination: {
      page: pageNumber,
      limit: limit,
      totalPage,
    },
  };

  logger.debug(
    { userId: user_id, page: pageNumber, totalPage },
    "fetched email alerts",
  );

  return emailAlertResponsePagination;
};
