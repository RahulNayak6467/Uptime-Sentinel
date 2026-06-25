export type OverviewStatsProps = {
  metric:string ;
  value: keyof DashboardOverviewResponse;
  context: string;
  color: string;
  stats:number | null;
  format?: (value: number) => string;
};

export type MonitorState = "up" | "down" | "paused";

export type monitorDataProps = {
  url_name: string;
  url: string;
  uptime: number;
  responseTime: number | null;
  statusCode: number | null;
  interval_seconds: number;
  next_check_at: string;
  status: MonitorState;
  trend: number[];
};

export type DashboardOverviewResponse = {
  total_checks: number;
  avg_total_checks: number | null;
  up_count: number;
  down_count: number;
  total_monitors: number;
  paused_monitors: number;
  uptime_percentage: number | null;
}

export type MonitorsDataProps = {
  url:string
  url_name: string,
  interval_seconds: number,
  status: "UP" | "DOWN" | "UNKNOWN"
  next_check_at: Date;
}