export interface overViewStatsProps {
  total_checks: string;
  avg_total_checks: string | null;
  up_count: string;
  down_count: string;
  total_monitors: string | null;
  paused_monitors: string;
}

export interface uptimeStatsProps {
  uptime_percentage: string | null;
}

export interface individualStatsProps {
  uptime_24hr: string | null;
  uptime_7d: string | null;
  uptime_30d: string | null;
  avg_response_24hr: string | null;
}

export interface individualStatsState {
  url: string;
  url_name: string;
  next_check_at: Date;
  interval_seconds: number;
  status: "UP" | "DOWN" | "UNKNOWN";
  is_active: boolean;
}

export interface IncidentStatsQueryResult {
  active_incidents: string;
  total_incidents: string;
  average_duration_minutes: string | null;
  mttr_minutes: string | null;
}

export interface IncidentStatsCardInfo {
  activeIncidents: number;
  totalIncidents: number;
  averageDurationMinutes: number;
  mttrMinutes: number;
}

export interface IncidentsDataProps {
  id: string;
  is_active: boolean;
  url_name: string;
  started_at: string;
  resolved_at: string | null;
  url: string;
}

export interface AddIncidentDataProps {
  status: "detected" | "resolved" | "monitoring" | "investigating";
  message: string;
  occurredAt: Date | string;
  incident_id: string;
}

export interface IncidentAddDataProps {
  incident_id: string;
  type: "detected" | "resolved" | "monitoring" | "investigating";
  occurred_at: string;
  message: string;
  updated_at: string | null;
  created_at: string;
  id: string;
}

export interface IncidentTimelineProps {
  title: string | null;
  incident_id: string;
  updates: {
    id: string;
    type: "detected" | "resolved" | "monitoring" | "investigating";
    message: string | null;
    occured_at: string | null;
  }[];
}

export interface lastFiveIncidentDataProps {
  id: string;
  title: string | null;
  started_at: string;
  is_active: boolean;
  resolved_at: string | null;
}
