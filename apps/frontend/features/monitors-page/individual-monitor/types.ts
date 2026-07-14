export type IndividualStatsCardProps = {
  title: string;
  value: keyof IndividualStatsCardState;
  unit: "%" | "ms";
  context: number | null;
};

export type StatsCardProps = {
  id: string;
  title: string;
  metrixKey: keyof IndividualStatsCardState;
  unit: "%" | "ms";
};

export type RegionMonitorProps = {
  region: string;
  latency: string;
  latencyMs: number;
};

export type IndividualStatsCardState = {
  uptime_24hr: number | null;
  uptime_7d: number | null;
  uptime_30d: number | null;
  avg_response_24hr: number | null;
};

export type TimeRangeDataProps = {
  range: string;
  series: {
    p50: number | null;
    p95: number | null;
    bucket: Date;
  }[];
};

type LastChecksProps = {
  monitor_status: "UP" | "DOWN" | "UNKNOWN";
  response_time: number | null;
  checked_at: Date | null;
  current_status: "UP" | "DOWN" | null;
};

export type LastChecksDataProps = {
  state: "CHECKED" | "UNCHECKED";
  checks: LastChecksProps[];
};

export type TimeRangeProps = "1h" | "24h" | "7d" | "30d";

export type IndividualOverviewStatsProps = {
  url: string;
  monitorName: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  nextCheckAt: Date;
  intervalSeconds: number;
  isActive: boolean;
  statusCodes: number[];
  requestTimeoutMS: number;
  failureThreshold: number;
  recoveryThreshold: number;
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  monitorType: "http" | "https" | "tcp" | "ssl" | "dns" | "keyword";
};

export type LastFiveIncidentDataProps = {
  data: {
    id: string;
    title: string | null;
    started_at: string;
    resolved_at: string | null;
    is_active: boolean;
  }[];
  activeCount: number;
  resolvedCount: number;
};
