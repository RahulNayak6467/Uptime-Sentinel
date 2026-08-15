import { IncidentsDataProps } from "../../../../db/db-types";

export const mapIncidentListRow = (row: IncidentsDataProps) => ({
  id: row.id,
  monitorName: row.monitor_name,
  monitorType: row.monitor_type,
  url: row.url,
  resolvedAt: row.resolved_at,
  startedAt: row.started_at,
  failureStatusCode: row.failure_status_code,
  failureReason: row.failure_reason,
  isActive: row.is_active,
});
