export type IncidentsInfoProps = {
  title: string;
  information: string | number;
  color: string;
};

export type IncidentStatus = "active" | "resolved";

export type IncidentUpdateStatus =
  "detected" | "investigating" | "monitoring" | "resolved";

export type IncidentUpdate = {
  id: string;
  status: IncidentUpdateStatus;
  time: string;
  message: string;
};

export type IncidentListItemProps = {
  id: string;
  title?: string;
  status: IncidentStatus;
  service: string;
  date: string;
  occurredAt: string;
  time: string;
  duration: string;
  description?: string;
  endpoint: string;
  startedAt: string;
  resolvedAt?: string;
  triggerLabel: string;
  triggerValue: string;
  updates?: IncidentUpdate[];
  expanded?: boolean;
};

export type IncidentStatsCardInfoProps = {
  activeIncidents: number;
  totalIncidents: number;
  averageDurationMinutes: number;
  mttrMinutes: number;
};
