import { QueryResult } from "pg";
import { db } from "../db";
import { emailAlertProps } from "../types/types";
import { LIMIT_RECENT_ALERTS } from "../constants/constants";

export const getEmailAlertsServices = async (user_id: string) => {
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
  LIMIT $2`;

  const get_emailAlert_values = [user_id, LIMIT_RECENT_ALERTS];

  const getEmailAlertDetails: QueryResult<emailAlertProps> = await db.query(
    get_emailAlert_query,
    get_emailAlert_values,
  );

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

  return emailAlertsResponse;
};
