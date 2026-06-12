import { db } from "../db/index";
import { AppError } from "../errors/AppError";
import { formatDuration } from "../utils/formatDate";

interface singleIncidentsTableDataProps {
  id: string;
  urlName: string;
  url: string;
  startedAt: Date;
  resolvedAt: Date;
  isActive: boolean;
  duration: string;
}

export const getSingleIncidentsDetailsById = async (
  incident_id: string,
  user_id: string,
) => {
  const single_incident_query =
    "SELECT i.resolved_at,i.started_at,i.is_active,m.url,m.url_name,m.id FROM incidents i inner join monitor m on m.id = i.monitor_id  where m.user_id = $1 and i.id = $2 ";
  const single_incident_values = [user_id, incident_id];

  try {
    const getSingleDataFromIncidentTable = await db.query(
      single_incident_query,
      single_incident_values,
    );

    const rows = getSingleDataFromIncidentTable.rows.length;

    if (rows === 0) {
      throw new AppError(404, "No incidents exist");
    }
    const data = getSingleDataFromIncidentTable.rows[0];
    console.log(data);
    const response: singleIncidentsTableDataProps = {
      id: data.id,
      urlName: data.url_name,
      url: data.url,
      startedAt: data.started_at,
      resolvedAt: data.resolved_at,
      isActive: data.is_active,
      duration: formatDuration(data.started_at, data.resolved_at),
    };

    return response;
  } catch (err) {
    throw err;
  }
};
