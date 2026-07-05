import { db } from "../db";
import { AppError } from "../errors/AppError";

export const updateIncidentDataServices = async (
  title: string | null,
  type: "detected" | "resolved",
  message: string,
  incident_id: string,
  user_id: string,
  limit: number,
  offset: number,
  pageNumber: number,
) => {
  const update_incidentUpdates_query = `
    UPDATE incident_updates iu
    SET
        message = $1,
        updated_at = NOW()
    FROM incidents i
    JOIN monitor m ON i.monitor_id = m.id
    WHERE
        iu.incident_id = i.id
        AND iu.incident_id = $2
        AND iu.type = $3
        AND m.user_id = $4
    RETURNING iu.*`;
  const update_incidentUpdates_values = [message, incident_id, type, user_id];

  const updatedData = await db.query(
    update_incidentUpdates_query,
    update_incidentUpdates_values,
  );

  const rows = updatedData.rowCount;

  if (rows === 0) {
    throw new AppError(
      404,
      "No such incident exists",
      "INCIDENT_DOES_NOT_EXIST",
    );
  }

  const update_incidents_query =
    "UPDATE incidents SET title = COALESCE(title,$1) where id = $2 RETURNING title";

  const update_incidents_values = [title, incident_id];

  const getTitle = await db.query(
    update_incidents_query,
    update_incidents_values,
  );

  const updatedTitle = getTitle.rows[0].title;

  const formData = { ...updatedData.rows[0], title: updatedTitle };

  console.log("FORMAT DATA", formData);

  return formData;
};
