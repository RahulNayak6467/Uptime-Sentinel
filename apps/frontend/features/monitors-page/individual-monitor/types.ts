export type IndividualStatsCardProps = {
  title: string;
  value: keyof IndividualStatsCardState;
  unit: "%" | "ms"
  context: number | null
};

export type StatsCardProps = {
  id:string;
  title: string;
  metrixKey: keyof IndividualStatsCardState;
  unit: "%" | "ms";
}

export type RegionMonitorProps = {
  region: string;
  latency: string;
  latencyMs: number;
};

export type IndividualStatsCardState = {
  uptime_24hr: number | null;
  uptime_7d: number | null;
  uptime_30d: number | null;
  avg_response_24hr: number | null
}