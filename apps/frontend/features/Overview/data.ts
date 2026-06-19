import { OverviewStatsProps } from "./types";

type OverviewStatsPropsData = { id: string } & OverviewStatsProps;

export const OverviewData: OverviewStatsPropsData[] = [
  {
    id: crypto.randomUUID(),
    metric: "Overall Uptime",
    value: "99.86%",
    context: "30 days",
    color: "var(--color-sf-green)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Total Monitors",
    value: 21,
    context: "tracked",
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Up",
    value: 18,
    context: "operational",
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Down",
    value: 1,
    context: "failing",
    color: "var(--color-sf-red)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Paused",
    value: 2,
    context: "muted",
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Avg Response",
    value: "161ms",
    context: "all monitors",
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    metric: "Total Checks",
    value: 48210,
    context: "today",
    color: "var(--color-sf-text)",
  },
];
