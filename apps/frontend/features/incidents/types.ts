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
  type: IncidentUpdateStatus;
  occurred_at: string;
  message: string | null;
};

export type IncidentListItemProps = {
  id: string;
  incidentId: string;
  title: string | null;
  status: IncidentStatus;
  service: string;
  date: string;
  startedAtRaw: string;
  time: string;
  duration: string;
  description?: string;
  endpoint: string;
  startedAtDisplay: string;
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

export type IncidentsDataProps = {
  id: string;
  isActive: boolean;
  urlName: string;
  url: string;
  resolvedAt: Date | string | null;
  startedAt: Date | string;
  httpStatus: number;
};

export type IncidentsPaginatedData = {
  data: IncidentsDataProps[];
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
  };
};

export type IncidentAddDataProps = {
  incident_id: string;
  title: string;
  type: Omit<IncidentUpdateStatus, "detected" | "resolved">;
  occurred_at: string;
  message: string;
  updated_at: string | null;
  created_at: string;
  id: string;
};

export type IncidentDataAddPayload = {
  type: Omit<IncidentUpdateStatus, "detected" | "resolved">;
  title: string | null;
  message: string | null;
  occurredAt: string | null;
};

export type IncidentDataUpdatesPayload = {
  type: Omit<IncidentUpdateStatus, "investigating" | "monitoring">;
  title: string | null;
  message: string | null;
};

export type PayloadAddProps = {
  type: string;
  title: string | null;
  message: string | null;
  occurredAt: string | null;
};

export type PayloadUpdateProps = {
  type: string;
  title: string | null;
  message: string | null;
};

export type IncidentTypeTimelineUpdates = {
  id: string;
  type: IncidentUpdateStatus;
  message: string | null;
  occurred_at: string | null;
};

// export type IncidentTypeTimelineProps = {
//   [key: string]: IncidentTypeTimelineUpdates[];
// };

export type IncidentTypeTimelineProps = {
  getTimeline: {
    data: {
      title: string | null;
      incident_id: string;
      updates: IncidentTypeTimelineUpdates[];
    }[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
    };
  };
};
