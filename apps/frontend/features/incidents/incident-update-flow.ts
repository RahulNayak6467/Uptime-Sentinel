import { IncidentStatus, IncidentUpdate, IncidentUpdateStatus } from "./types";

const hasMessage = (update: IncidentUpdate) =>
  Boolean(update.message?.trim());

export const getAvailableIncidentUpdateStatuses = (
  incidentStatus: IncidentStatus,
  updates: IncidentUpdate[],
): IncidentUpdateStatus[] => {
  const completedStatuses = new Set(
    updates.filter(hasMessage).map((update) => update.type),
  );

  if (incidentStatus === "resolved") {
    return completedStatuses.has("resolved") ? [] : ["resolved"];
  }

  if (!completedStatuses.has("detected")) {
    return ["detected"];
  }

  return (["investigating", "monitoring"] as IncidentUpdateStatus[]).filter(
    (status) => !completedStatuses.has(status),
  );
};
