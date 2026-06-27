export type OverviewStatsProps = {
  metric:string ;
  value: keyof DashboardOverviewResponse;
  context: string;
  color: string;
  stats:number | null;
  format?: (value: number) => string;
};

export type monitorDataProps = {
  url_name: string;
  url: string;
  uptime: number | null;
  responseTime: number | null;
  statusCode: number | null;
  interval_seconds: number;
  next_check_at: string;
  status:  "UP" | "DOWN" | "UNKNOWN";
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
  urlName: string,
  intervalSeconds: number,
  status: "UP" | "DOWN" | "UNKNOWN"
  next_check_at: Date;
}

export type allMonitorsDataDashboardViewProps = {
  url: string,
  urlName:string,
  intervalSeconds: number,
  status: "UP" | "DOWN" | "UNKNOWN",
  nextCheckAt: string,
  response: {
    responseTime: number | null,
  }[],
  avgResponseTime: number | null,
  uptimePercentage: number | null,
}
