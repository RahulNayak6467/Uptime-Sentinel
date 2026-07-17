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
  monitor_name: string;
  next_check_at: Date;
  interval_seconds: number;
  status: "UP" | "DOWN" | "UNKNOWN";
  is_active: boolean;
  status_code: number[];
  request_timeout_ms: number;
  failure_threshold: number;
  recovery_threshold: number;
  http_method: HttpMethod;
  monitor_type: MonitorType;
}

export type MonitorType = "http" | "https" | "tcp" | "ssl" | "dns" | "keyword";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ContentType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "text/plain"
  | "none";

export type RequestBodyType = "none" | "json" | "form-encoded" | "raw-text";

export interface MonitorConfigurationRow {
  id: string;
  user_id: string;
  url: string;
  monitor_name: string;
  interval_seconds: number;
  next_check_at: string;
  request_timeout_ms: number;
  response_time_threshold_ms: number;
  last_status_code: number | null;
  status_code: number[];
  monitor_type: MonitorType;
  http_method: HttpMethod;
  content_type?: ContentType;
  failure_threshold: number;
  recovery_threshold: number;
  consecutive_failure_count: number;
  consecutive_success_count: number;
  status: "UP" | "DOWN" | "UNKNOWN";
  is_active: boolean;
  request_body_type?: RequestBodyType;
  request_body?: string | null;
}

export type MonitorCheckConfigRow = Pick<
  MonitorConfigurationRow,
  | "url"
  | "next_check_at"
  | "request_timeout_ms"
  | "status_code"
  | "monitor_type"
  | "http_method"
  | "content_type"
  | "request_body_type"
  |"request_body"
>;

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
  monitor_name: string;
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

export interface AuthMeProps {
  id: string
  email_verified: boolean
  created_at: string
  email:string
}
