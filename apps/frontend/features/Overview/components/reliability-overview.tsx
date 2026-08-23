"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Activity,
  ArrowUpRight,
  CircleCheck,
  Siren,
} from "lucide-react";
import { LIMIT } from "@/constants/constant";
import Chart from "@/utils/chart";
import { useIncidentsStatsCard } from "@/features/incidents/hooks/useIncidentsStatsCard";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { useAllMonitorsData } from "../hooks/useMonitorsData";

type AttentionTone = "danger" | "warning" | "neutral";

type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  tone: AttentionTone;
};

const ATTENTION_TONE: Record<AttentionTone, string> = {
  danger: "bg-sf-red",
  warning: "bg-sf-amber",
  neutral: "bg-sf-text-muted/60",
};

const PanelHeading = ({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Activity;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) => (
  <header className="flex flex-col gap-3 border-b border-sf-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[5px] border border-sf-border-faint bg-sf-bg text-sf-text-sub">
        <Icon className="size-3.5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold tracking-sf-tight text-sf-text">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] text-sf-text-muted">{subtitle}</p>
      </div>
    </div>
    {action}
  </header>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-medium text-sf-text-muted">{label}</p>
    <p className="mt-1 text-sm font-semibold tabular-nums text-sf-text">
      {value}
    </p>
  </div>
);

const ReliabilityOverview = () => {
  const { resolvedTheme } = useTheme();
  const { data, isLoading, isError } = useAllMonitorsData(1, LIMIT);
  const { data: overview } = useDashboardOverview();
  const { data: incidentStats } = useIncidentsStatsCard();

  if (isLoading || isError || !data || data.data.length === 0) return null;

  const responseMonitors = data.data
    .flatMap((monitor) =>
      monitor.avgResponseTime === null
        ? []
        : [
            {
              id: monitor.id,
              name: monitor.monitorName,
              value: Math.round(monitor.avgResponseTime),
              status: monitor.status,
            },
          ],
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const average = responseMonitors.length
    ? Math.round(
        responseMonitors.reduce((sum, monitor) => sum + monitor.value, 0) /
          responseMonitors.length,
      )
    : null;
  const fastest = responseMonitors.length
    ? responseMonitors.reduce((best, monitor) =>
        monitor.value < best.value ? monitor : best,
      )
    : null;
  const slowest = responseMonitors[0] ?? null;

  const chartOption = {
    animationDuration: 350,
    grid: { left: 4, right: 78, top: 8, bottom: 10, containLabel: true },
    tooltip: {
      trigger: "item",
      formatter: (params: { name: string; value: number }) =>
        `${params.name}<br/><strong>${params.value}ms average response</strong>`,
    },
    xAxis: {
      type: "value",
      min: 0,
      splitNumber: 4,
      axisLabel: { formatter: (value: number) => `${value}ms` },
      splitLine: { show: true, lineStyle: { type: "dashed" } },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: responseMonitors.map((monitor) => monitor.name),
      axisTick: { show: false },
      axisLabel: { width: 118, overflow: "truncate" },
    },
    series: [
      {
        name: "Average response",
        type: "bar",
        barWidth: 11,
        showBackground: true,
        backgroundStyle: { color: "rgba(120, 120, 128, 0.08)", borderRadius: 3 },
        label: {
          show: true,
          position: "right",
          distance: 8,
          formatter: "{value|{c}}{unit|ms}",
          rich: {
            value: {
              color: resolvedTheme === "dark" ? "#f7f8f8" : "#202124",
              fontSize: 12,
              fontWeight: 650,
              fontFamily: "Inter, sans-serif",
            },
            unit: {
              color: resolvedTheme === "dark" ? "#9297a0" : "#6f737b",
              fontSize: 10,
              fontWeight: 500,
              padding: [1, 0, 0, 2],
              fontFamily: "Inter, sans-serif",
            },
          },
        },
        data: responseMonitors.map((monitor) => ({
          value: monitor.value,
          itemStyle: {
            color: monitor.status === "DOWN" ? "#d14d56" : "#5e6ad2",
            borderRadius: [0, 3, 3, 0],
          },
        })),
      },
    ],
  };

  const attentionItems: AttentionItem[] = [];
  const activeIncidents = incidentStats?.activeIncidents ?? 0;
  const pausedMonitors = overview?.paused_monitors ?? 0;

  if (activeIncidents > 0) {
    attentionItems.push({
      id: "active-incidents",
      title: `${activeIncidents} active incident${activeIncidents === 1 ? "" : "s"}`,
      detail: "Recovery monitoring is in progress",
      href: "/dashboard/incidents",
      tone: "danger",
    });
  }

  data.data
    .filter((monitor) => monitor.status === "DOWN")
    .slice(0, 3)
    .forEach((monitor) => {
      attentionItems.push({
        id: `down-${monitor.id}`,
        title: `${monitor.monitorName} is down`,
        detail:
          monitor.statusCode === null
            ? "No HTTP response"
            : `Latest response: HTTP ${monitor.statusCode}`,
        href: `/dashboard/monitors/${monitor.id}`,
        tone: "danger",
      });
    });

  if (pausedMonitors > 0) {
    attentionItems.push({
      id: "paused-monitors",
      title: `${pausedMonitors} paused monitor${pausedMonitors === 1 ? "" : "s"}`,
      detail: "Checks are not currently running",
      href: "/dashboard/monitors",
      tone: "warning",
    });
  }

  const unknownMonitors = data.data.filter(
    (monitor) => monitor.status === "UNKNOWN",
  ).length;
  if (unknownMonitors > 0) {
    attentionItems.push({
      id: "unknown-monitors",
      title: `${unknownMonitors} monitor${unknownMonitors === 1 ? "" : "s"} awaiting data`,
      detail: "No current health result is available",
      href: "/dashboard/monitors",
      tone: "neutral",
    });
  }

  return (
    <section>
      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <section className="sf-panel overflow-hidden">
          <PanelHeading
            icon={Activity}
            title="Response time by monitor"
            subtitle="Actual average response values from the current monitor data"
            action={
              <div className="grid grid-cols-3 gap-5 sm:gap-7">
                <Metric label="Fastest" value={fastest ? `${fastest.value}ms` : "—"} />
                <Metric label="Average" value={average === null ? "—" : `${average}ms`} />
                <Metric label="Slowest" value={slowest ? `${slowest.value}ms` : "—"} />
              </div>
            }
          />
          <div className="px-3 py-3 sm:px-4">
            {responseMonitors.length > 0 ? (
              <Chart option={chartOption} height={248} />
            ) : (
              <div className="flex h-[248px] items-center justify-center text-xs text-sf-text-muted">
                No response-time data is available yet.
              </div>
            )}
          </div>
        </section>

        <section className="sf-panel overflow-hidden">
          <PanelHeading
            icon={Siren}
            title="Needs attention"
            subtitle="Current incidents and monitors requiring review"
          />
          {attentionItems.length > 0 ? (
            <div className="divide-y divide-sf-border-faint">
              {attentionItems.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-sf-bg/55"
                >
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${ATTENTION_TONE[item.tone]}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-sf-text">
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-sf-text-muted">
                      {item.detail}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-sf-text-muted transition-colors group-hover:text-sf-text" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <span className="flex size-9 items-center justify-center rounded-full bg-sf-green-bg text-sf-green">
                <CircleCheck className="size-4" />
              </span>
              <p className="mt-3 text-sm font-semibold text-sf-text">Nothing needs attention</p>
              <p className="mt-1 max-w-[230px] text-xs leading-5 text-sf-text-muted">
                No active incidents, down monitors, paused checks, or monitors awaiting data.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default ReliabilityOverview;
