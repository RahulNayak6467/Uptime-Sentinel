"use client";

import { useMemo, type ReactNode } from "react";
import {
  Activity,
  ChartNoAxesCombined,
  CircleGauge,
  Download,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import Chart from "@/utils/chart";
import { useDashboardOverview } from "@/features/Overview/hooks/useDashboardOverview";
import { useIncidentsStatsCard } from "@/features/incidents/hooks/useIncidentsStatsCard";
import { useFilter } from "@/features/monitors-page/hooks/useFilter";
import type { allMonitorsDataDashboardView } from "@/features/Overview/types";

const fmtMinutes = (minutes: number | null | undefined) => {
  if (minutes == null || Number.isNaN(minutes)) return "—";
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

const fmtNumber = (value: number | null | undefined) =>
  value == null ? "—" : value.toLocaleString();

const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`sf-panel overflow-hidden ${className}`}>{children}</section>
);

const PanelHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Activity;
  title: string;
  description: string;
}) => (
  <header className="flex flex-col gap-2 border-b border-sf-border-faint px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="flex min-w-0 items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-sf-text-muted" strokeWidth={1.8} />
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-sf-tight text-sf-text">{title}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-sf-text-muted">{description}</p>
      </div>
    </div>
  </header>
);

const typeLabel = (type: string) => type.toUpperCase();

const AnalyticsPage = () => {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: incidentStats, isLoading: incidentsLoading } = useIncidentsStatsCard();
  const { data: monitorsResponse, isLoading: monitorsLoading } = useFilter("all", 1, 100);

  const monitors: allMonitorsDataDashboardView = monitorsResponse?.data ?? [];
  const isLoading = overviewLoading || incidentsLoading || monitorsLoading;

  const metrics = [
    {
      label: "Availability",
      value:
        overview?.uptime_percentage == null
          ? "—"
          : `${overview.uptime_percentage}%`,
    },
    { label: "Checks today", value: fmtNumber(overview?.total_checks) },
    {
      label: "Avg response",
      value:
        overview?.avg_total_checks == null
          ? "—"
          : `${overview.avg_total_checks}ms`,
    },
    { label: "Total incidents", value: fmtNumber(incidentStats?.totalIncidents) },
    { label: "Mean time to recover", value: fmtMinutes(incidentStats?.mttrMinutes) },
  ];

  const responseChart = useMemo(() => {
    const rows = monitors.filter((monitor) => monitor.avgResponseTime != null);
    return {
      animationDuration: 420,
      grid: { left: 8, right: 14, top: 16, bottom: 10, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value}ms` },
      xAxis: {
        type: "category",
        data: rows.map((monitor) => monitor.monitorName),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, hideOverlap: true, interval: 0, rotate: rows.length > 5 ? 30 : 0, margin: 12 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { formatter: (value: number) => `${value}ms`, fontSize: 10, margin: 14 },
        splitLine: { lineStyle: { type: "dashed", opacity: 0.7 } },
      },
      series: [
        {
          type: "bar",
          data: rows.map((monitor) => monitor.avgResponseTime),
          barMaxWidth: 26,
          itemStyle: { color: "#7c82e8", borderRadius: [3, 3, 0, 0] },
        },
      ],
    };
  }, [monitors]);

  const availabilityChart = useMemo(() => {
    const rows = monitors.filter((monitor) => monitor.uptimePercentage != null);
    return {
      animationDuration: 420,
      grid: { left: 8, right: 14, top: 16, bottom: 10, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (value: number) => `${value}%` },
      xAxis: {
        type: "category",
        data: rows.map((monitor) => monitor.monitorName),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, hideOverlap: true, interval: 0, rotate: rows.length > 5 ? 30 : 0, margin: 12 },
      },
      yAxis: {
        type: "value",
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { formatter: (value: number) => `${value}%`, fontSize: 10, margin: 14 },
        splitLine: { lineStyle: { type: "dashed", opacity: 0.7 } },
      },
      series: [
        {
          type: "bar",
          data: rows.map((monitor) => monitor.uptimePercentage),
          barMaxWidth: 26,
          itemStyle: { color: "#4cb782", borderRadius: [3, 3, 0, 0] },
        },
      ],
    };
  }, [monitors]);

  const exportCsv = () => {
    const header = ["Monitor", "URL", "Type", "Status", "Uptime %", "Avg response (ms)"];
    const body = monitors.map((monitor) => [
      monitor.monitorName,
      monitor.url,
      typeLabel(monitor.monitorType),
      monitor.status,
      monitor.uptimePercentage ?? "",
      monitor.avgResponseTime ?? "",
    ]);
    const csv = [header, ...body]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "statusforge-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full">
      <header className="sf-page-header bg-sf-surface/90 backdrop-blur-xl">
        <div className="min-w-0">
          <h1 className="sf-page-title">Analytics</h1>
          <p className="sf-page-subtitle truncate">
            Reliability and latency across your monitors
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex h-8 items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-3 text-[11px] font-medium text-sf-text-sub shadow-sm transition-colors hover:bg-sf-bg hover:text-sf-text"
        >
          <Download className="size-3.5" />
          Export
        </button>
      </header>

      <main className="sf-page-content space-y-4 pb-12">
        {/* Metric strip */}
        <Panel>
          <div className="grid grid-cols-2 gap-px bg-sf-border-faint lg:grid-cols-5">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 bg-sf-surface px-4 py-3.5 sm:px-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-sf-text-muted">
                  {metric.label}
                </p>
                <p className="mt-2 truncate text-[22px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-sf-text">
                  {isLoading ? "…" : metric.value}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Per-monitor charts */}
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel>
            <PanelHeader icon={Activity} title="Average response by monitor" description="Mean latency over recorded checks" />
            <div className="px-3 pb-2 pt-3 sm:px-4">
              {monitors.length ? <Chart option={responseChart} height={260} /> : <EmptyChart />}
            </div>
          </Panel>
          <Panel>
            <PanelHeader icon={ChartNoAxesCombined} title="Availability by monitor" description="Successful checks as a percentage of all checks" />
            <div className="px-3 pb-2 pt-3 sm:px-4">
              {monitors.length ? <Chart option={availabilityChart} height={260} /> : <EmptyChart />}
            </div>
          </Panel>
        </div>

        {/* Monitor performance table + incident summary */}
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <Panel>
            <PanelHeader icon={CircleGauge} title="Monitor performance" description="Uptime and latency per monitor" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-sf-border bg-sf-bg/55 text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
                  <tr>
                    <th className="px-5 py-2.5">Monitor</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Uptime</th>
                    <th className="px-5 py-2.5 text-right">Avg response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sf-border-faint">
                  {monitors.map((monitor) => (
                    <tr key={monitor.id} className="transition-colors hover:bg-sf-bg/45">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`size-1.5 rounded-full ${
                              monitor.status === "UP"
                                ? "bg-sf-green"
                                : monitor.status === "DOWN"
                                  ? "bg-sf-red"
                                  : "bg-sf-text-muted"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sf-text">{monitor.monitorName}</p>
                            <p className="mt-0.5 truncate font-mono text-[10.5px] text-sf-text-muted">{monitor.url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-[3px] border border-sf-border bg-sf-bg px-1.5 py-0.5 text-[10px] font-semibold text-sf-text-muted">
                          {typeLabel(monitor.monitorType)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sf-text-sub">{monitor.status}</td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-sf-text">
                        {monitor.uptimePercentage == null ? "—" : `${monitor.uptimePercentage}%`}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-sf-text-sub">
                        {monitor.avgResponseTime == null ? "—" : `${monitor.avgResponseTime}ms`}
                      </td>
                    </tr>
                  ))}
                  {!monitors.length && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sf-text-muted">
                        {isLoading ? "Loading monitors…" : "No monitors yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel>
            <PanelHeader icon={TriangleAlert} title="Reliability summary" description="Fleet health and incident response" />
            <dl className="divide-y divide-sf-border-faint px-5">
              {[
                ["Monitors up", fmtNumber(overview?.up_count)],
                ["Monitors down", fmtNumber(overview?.down_count)],
                ["Paused", fmtNumber(overview?.paused_monitors)],
                ["Active incidents", fmtNumber(incidentStats?.activeIncidents)],
                ["Total incidents", fmtNumber(incidentStats?.totalIncidents)],
                ["Avg incident duration", fmtMinutes(incidentStats?.averageDurationMinutes)],
                ["Mean time to recover", fmtMinutes(incidentStats?.mttrMinutes)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3 text-xs">
                  <dt className="text-sf-text-muted">{label}</dt>
                  <dd className="font-medium tabular-nums text-sf-text">{isLoading ? "…" : value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <div className="flex items-start gap-2.5 rounded-[5px] border border-sf-border-faint bg-sf-surface px-4 py-3 text-[11px] leading-relaxed text-sf-text-muted">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-sf-blue" />
          <p>
            All values are live, pulled from your overview, monitors, and incident data.
            Time-series and regional breakdowns will appear once those aggregation
            endpoints exist.
          </p>
        </div>
      </main>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex h-[260px] items-center justify-center text-xs text-sf-text-muted">
    No monitor data yet.
  </div>
);

export default AnalyticsPage;
