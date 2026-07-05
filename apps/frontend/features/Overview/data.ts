import { OverviewStatsProps } from "./types";

type OverviewStatsPropsData = { id: string } & OverviewStatsProps;

export const OverviewData: OverviewStatsPropsData[] = [
  {
    id: crypto.randomUUID(),
    metric: "Overall Uptime",
    value: "uptime_percentage",
    context: "30 days",
    color: "var(--color-sf-green)",
    stats: null,
    format: (value) => `${value}%`,
  },
  {
    id: crypto.randomUUID(),
    metric: "Operational",
    value: "up_count",
    context: "monitors up",
    color: "var(--color-sf-green)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Failing",
    value: "down_count",
    context: "failing",
    color: "var(--color-sf-red)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Average Latency",
    value: "avg_total_checks",
    context: "all monitors",
    color: "var(--color-sf-text)",
    stats: null,
    format: (value) => `${value}ms`,
  },
];
