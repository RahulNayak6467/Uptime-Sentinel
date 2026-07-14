export type MonitorType = "http" | "https" | "tcp" | "ssl" | "dns" | "keyword";
export type MonitorState = "up" | "down" | "degraded" | "paused" | "unknown";

export type MonitorPageData = {
  id: string;
  name: string;
  url: string;
  type: MonitorType;
  uptime: number | null;
  responseTime: number | null;
  interval: string;
  nextCheck: string;
  state: MonitorState;
  trend: number[];
};
