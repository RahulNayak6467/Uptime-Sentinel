import { QueryResult } from "pg";
import { db } from "../db";
import { AppError } from "../errors/AppError";
import {
  TIME_ERROR_MESSAGES,
  validateOccurredAt,
} from "../utils/validateOccurredAt";
import { IncidentAddDataProps } from "../types/db-types";

export const addIncidentUpdatesServices = async (
  title: string | null,
  type: "investigating" | "monitoring",
  message: string,
  occurredAt: string | null,
  incident_id: string,
  user_id: string,
  limit: number,
  offset: number,
  pageNumber: number,
) => {
  const get_time_query = `SELECT i.started_at, i.is_active FROM incidents i JOIN monitor m ON i.monitor_id = m.id where m.user_id = $1 and i.id = $2`;
  const get_time_value = [user_id, incident_id];

  const getTimeDetails = await db.query(get_time_query, get_time_value);

  const timeRows = getTimeDetails.rows;

  if (timeRows.length === 0) {
    throw new AppError(
      404,
      "No such incident exists",
      "INCIDENT_DOES_NOT_EXIST",
    );
  }

  if (!timeRows[0].is_active) {
    throw new AppError(
      409,
      "Incident is already resolved",
      "INCIDENT_ALREADY_RESOLVED",
    );
  }

  const startedAtTime = timeRows[0].started_at;

  const timeError = validateOccurredAt(occurredAt, startedAtTime);
  if (timeError) {
    throw new AppError(400, TIME_ERROR_MESSAGES[timeError], timeError);
  }

  const insert_incidentUpdates_query = `INSERT INTO incident_updates (incident_id,type,message,occurred_at)
    VALUES($1, $2, $3, COALESCE($4,NOW()))
    RETURNING *
    `;

  const insert_incidentUpdates_values = [
    incident_id,
    type,
    message,
    occurredAt,
  ];

  const insertIncidentUpdatesData: QueryResult<IncidentAddDataProps> =
    await db.query(insert_incidentUpdates_query, insert_incidentUpdates_values);

  const update_incidents_query =
    "UPDATE incidents SET title = COALESCE(title,$1) where id = $2 RETURNING title";

  const update_incidents_values = [title, incident_id];

  const getTitle = await db.query(
    update_incidents_query,
    update_incidents_values,
  );

  const updatedTitle = getTitle.rows[0].title;

  const rows = insertIncidentUpdatesData.rows;

  const formData = { ...rows[0], title: updatedTitle };

  console.log("FORMAT DATA", formData);

  return rows[0];
};
