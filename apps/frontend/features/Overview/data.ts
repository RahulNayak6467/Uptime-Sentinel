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
    metric: "Total Monitors",
    value: "total_monitors",
    context: "tracked",
    color: "var(--color-sf-text)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Up",
    value: "up_count",
    context: "operational",
    color: "var(--color-sf-text)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Down",
    value: "down_count",
    context: "failing",
    color: "var(--color-sf-red)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Paused",
    value: "paused_monitors",
    context: "muted",
    color: "var(--color-sf-text)",
    stats: null,
  },
  {
    id: crypto.randomUUID(),
    metric: "Avg Response",
    value: "avg_total_checks",
    context: "all monitors",
    color: "var(--color-sf-text)",
    stats: null,
    format: (value) => `${value}ms`,
  },
  {
    id: crypto.randomUUID(),
    metric: "Total Checks",
    value: "total_checks",
    context: "Today",
    color: "var(--color-sf-text)",
    stats: null,
    format: (value) => value.toLocaleString(),
  },
];
