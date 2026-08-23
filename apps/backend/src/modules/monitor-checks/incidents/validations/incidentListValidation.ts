import { z } from "zod";

export const INCIDENT_STATUS_FILTERS = ["all", "active", "resolved"] as const;

export type IncidentStatusFilter =
  (typeof INCIDENT_STATUS_FILTERS)[number];

export const incidentListQuerySchema = z.object({
  status: z.enum(INCIDENT_STATUS_FILTERS).default("all"),
});

export const incidentStatusPredicate = (
  status: IncidentStatusFilter,
  alias = "i",
) => {
  if (status === "active") return `AND ${alias}.is_active = true`;
  if (status === "resolved") return `AND ${alias}.is_active = false`;
  return "";
};
