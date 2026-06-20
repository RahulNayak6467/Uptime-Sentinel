export type MonitorType = "http" | "tcp" | "dns";
export type MonitorState = "up" | "down" | "degraded" | "paused";

export type MonitorPageData = {
  name: string;
  url: string;
  type: MonitorType;
  uptime: number;
  responseTime: number | null;
  interval: string;
  lastCheck: string;
  state: MonitorState;
  trend: number[];
};

export type IndividualStatsCardProps = {
  title: string;
  stats: number;
};
