export type OverviewStatsProps = {
  metric: string;
  value: string | number;
  context: string;
  color: string;
};

export type MonitorState = "up" | "down" | "paused";

export type monitorDataProps = {
  name: string;
  url: string;
  uptime: number;
  responseTime: number | null;
  statusCode: number | null;
  interval: number;
  lastCheck: string;
  state: MonitorState;
  trend: number[];
};
