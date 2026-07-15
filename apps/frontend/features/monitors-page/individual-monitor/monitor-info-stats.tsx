"use client";

import { useState } from "react";
import { Activity, Check, Copy, ExternalLink } from "lucide-react";
import { IndividualStatsCardData } from "./data";
import Error from "../../Overview/components/error";
import {
  ChartSkeleton,
  MetricCardsSkeleton,
} from "@/components/loading/dashboard-skeletons";
import { IndividualStatsCardProps, TimeRangeProps } from "./types";
import Chart from "@/utils/chart";
import { useIndividualStats } from "@/features/monitors-page/individual-monitor/hooks/useIndividualStats";
import { useParams } from "next/navigation";
import { useTimeRange } from "@/features/monitors-page/individual-monitor/hooks/useTimeRange";
import { useIsFetching } from "@tanstack/react-query";
import { FetchingIndicator } from "@/components/ui/fetching-indicator";
import { ChartTimeRange, formatChartDate } from "@/utils/format-chart-date";
import { IndividualOverviewStatsProps } from "./types";
import {
  OperationalSkeleton,
  OperationalError,
} from "./monitor-overview-states";
import { formatTimeUntil } from "@/utils/format-time-until";
import { useSSEIndividualMonitorData } from "./hooks/useSSEIndividualMonitorData";
import { useTheme } from "next-themes";

const StripStat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-28 border-l border-sf-border px-4 first:border-l-0 sm:px-5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">{label}</p>
    <p className="mt-1 text-[13px] font-semibold text-sf-text">{value}</p>
  </div>
);

const OperationalStrip = ({ data }: { data: IndividualOverviewStatsProps }) => {
  const [copied, setCopied] = useState(false);
  const nextCheck = !data.isActive
    ? "Paused"
    : data.status === "UNKNOWN"
      ? "Pending"
      : new Date(data.nextCheckAt) <= new Date()
        ? "Due now"
        : formatTimeUntil(data.nextCheckAt);

  const statusMeta = !data.isActive
    ? {
        headline: "Monitoring paused",
        icon: "border-sf-border bg-sf-bg text-sf-text-muted",
        dot: "bg-sf-text-muted",
      }
    : data.status === "UP"
      ? {
          headline: "Endpoint operational",
          icon: "border-sf-green-border bg-sf-green-bg text-sf-green",
          dot: "bg-sf-green",
        }
      : data.status === "DOWN"
        ? {
            headline: "Endpoint unavailable",
            icon: "border-sf-red-border bg-sf-red-bg text-sf-red",
            dot: "bg-sf-red",
          }
        : {
            headline: "Awaiting first check",
            icon: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
            dot: "bg-sf-amber",
          };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${statusMeta.icon}`}>
            <Activity className="size-4.5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold text-sf-text">
                {statusMeta.headline}
              </p>
              <span className={`size-1.5 rounded-full ${statusMeta.dot}`} />
            </div>
            <div className="mt-1 flex min-w-0 items-center gap-1.5">
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="block max-w-xl truncate font-mono text-xs text-sf-text-muted hover:text-sf-blue"
              >
                {data.url}
              </a>
              <button
                type="button"
                onClick={copyUrl}
                aria-label={copied ? "Endpoint URL copied" : "Copy endpoint URL"}
                title={copied ? "Copied" : "Copy URL"}
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
              >
                {copied ? <Check className="size-3 text-sf-green" /> : <Copy className="size-3" />}
              </button>
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Open endpoint in a new tab"
                title="Open endpoint"
                className="flex size-6 shrink-0 items-center justify-center rounded text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
              >
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-x-auto sm:w-auto">
          <StripStat label="Next check" value={nextCheck} />
          <StripStat label="Interval" value={`${data.intervalSeconds}s`} />
          <StripStat label="Regions" value="5" />
        </div>
      </div>
    </div>
  );
};

const IndividualMonitorInfoStats = ({
  monitorOverviewData,
  monitorOverviewLoading,
  monitorOverviewError,
}: {
  monitorOverviewData: NoInfer<IndividualOverviewStatsProps> | undefined;
  monitorOverviewLoading: boolean;
  monitorOverviewError: boolean;
}) => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const {
    data: individualMonitorStats,
    isLoading: individualMonitorStatsLoading,
    isError: individualMonitorStatsError,
    refetch,
  } = useIndividualStats(id);

  return (
    <section id="overview" className="scroll-mt-16">
      {monitorOverviewLoading ? (
        <OperationalSkeleton />
      ) : monitorOverviewError || !monitorOverviewData ? (
        <OperationalError />
      ) : (
        <OperationalStrip data={monitorOverviewData} />
      )}

      {individualMonitorStatsLoading ? (
        <MetricCardsSkeleton />
      ) : individualMonitorStatsError || !individualMonitorStats ? (
        <Error refetch={refetch} />
      ) : (
        <div className="mt-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-sf-text">Performance summary</h2>
            <p className="mt-1 text-xs text-sf-text-muted">
              Uptime and response metrics across current reporting windows
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {IndividualStatsCardData.map((data) => (
            <StatsCard
              key={data.title}
              title={data.title}
              unit={data.unit}
              value={data.value}
              context={individualMonitorStats[data.value]}
            />
          ))}
          </div>
        </div>
      )}
    </section>
  );
};

const StatsCard = ({
  title,
  unit,
  context,
}: IndividualStatsCardProps) => {
  return (
    <div className="sf-panel flex min-h-[104px] w-full flex-col justify-center gap-1 p-5 transition-colors hover:border-sf-text-muted/50">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
        {title}
      </p>
      <p className="mt-1 text-[22px] font-semibold tracking-sf-tight text-sf-text">
        {context === null ? (
          <span className="text-[14px] text-sf-text-muted">No data</span>
        ) : (
          <>
            {context}
            <span className="ml-1 text-[14px] text-sf-text-muted">{unit}</span>
          </>
        )}
      </p>
    </div>
  );
};

export const ResponseTimeTrend = ({
  currentRange,
}: {
  currentRange: TimeRangeProps;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const params = useParams<{ id: string }>();
  const id = params.id;
  const isFetchingChart =
    useIsFetching({
      queryKey: ["monitor", id, "charts", currentRange],
      exact: true,
    }) > 0;

  const { data, isLoading, isError, refetch } = useTimeRange(id, currentRange);

  useSSEIndividualMonitorData(id, currentRange);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError || !data) {
    return <Error refetch={refetch} />;
  }

  const bucketData = data.series.map((item) => {
    return {
      bucket: formatChartDate(item.bucket, data.range as ChartTimeRange),
      p50Data: item.p50 === null ? null : Math.round(item.p50),
      p95Data: item.p95 === null ? null : Math.round(item.p95),
    };
  });

  const bucket = bucketData.map((el) => el.bucket);
  const p50Data = bucketData.map((el) => el.p50Data);
  const p95Data = bucketData.map((el) => el.p95Data);
  const latestBucket = [...bucketData]
    .reverse()
    .find((item) => item.p50Data !== null || item.p95Data !== null);
  const measuredBucketCount = bucketData.filter(
    (item) => item.p50Data !== null || item.p95Data !== null,
  ).length;

  const green = isDark ? "#4ade80" : "#16a34a";
  const amber = isDark ? "#fbbf24" : "#d97706";
  const red = isDark ? "#f87171" : "#dc2626";
  const axisLine = isDark ? "#333333" : "#cbd5e1";

  const threshold = data.responseTimeThresholdMS;

  // Latency is a magnitude, so keep the baseline at 0 and only grow the top.
  // Drop gap (null) buckets. `threshold` is always included so the threshold line
  // stays on-chart even with no data yet (Math.max(...[], threshold) === threshold).
  // Pick a round step (100/200/500/...) so every gridline is a clean number.
  const seriesValues = [...p50Data, ...p95Data].filter(
    (value): value is number => value !== null,
  );

  const rawMax = Math.max(...seriesValues, threshold) * 1.15;
  const roughStep = rawMax / 5; // aim for ~5 gridlines
  const niceSteps = [100, 200, 500, 1000, 2000, 5000, 10000];
  const step =
    niceSteps.find((value) => value >= roughStep) ??
    niceSteps[niceSteps.length - 1];
  const yAxisMax = Math.ceil(rawMax / step) * step;
  const yAxisInterval = step;
  const hasSeriesData = seriesValues.length > 0;

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#171717" : "#ffffff",
      borderColor: isDark ? "#3f3f46" : "#e2e8f0",
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        color: isDark ? "#e5e7eb" : "#334155",
        fontSize: 12,
      },
      extraCssText:
        "border-radius:6px;box-shadow:0 10px 28px rgba(15,23,42,0.14);",
      axisPointer: {
        type: "line",
        lineStyle: { color: axisLine, type: "dashed", width: 1 },
      },
      formatter: (
        params: {
          seriesName: string;
          value: number | null;
          axisValue: string;
        }[],
      ) => {
        const time = params[0]?.axisValue ?? "";
        const hasData = params.some(
          (p) => typeof p.value === "number" && Number.isFinite(p.value),
        );

        if (!hasData) {
          return `<div style="font-weight:600;margin-bottom:4px">${time}</div><span style="opacity:.7">No checks in this bucket</span>`;
        }

        const rows = params
          .map((p) => {
            const value =
              typeof p.value === "number" && Number.isFinite(p.value)
                ? `${p.value}ms`
                : "No data";
            const label = p.seriesName === "p50" ? "p50 · median" : "p95 · tail";

            return `<div style="display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:5px"><span><span style="color:${p.seriesName === "p50" ? green : amber}">●</span> ${label}</span><b>${value}</b></div>`;
          })
          .join("");
        const breach = params.some(
          (p) => typeof p.value === "number" && p.value >= threshold,
        )
          ? `<div style="border-top:1px solid ${axisLine};margin-top:7px;padding-top:7px;color:${red}">▲ Above ${threshold}ms threshold</div>`
          : "";
        return `<div style="font-weight:600;margin-bottom:4px">${time}</div>${rows}${breach}`;
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: "category",
      data: bucket,
      boundaryGap: false,
      axisLabel: { fontSize: 11, margin: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: yAxisMax,
      interval: yAxisInterval,
      axisLabel: { formatter: "{value}ms", fontSize: 11 },
      splitLine: { lineStyle: { type: "dashed", opacity: 0.5 } },
    },
    series: [
      {
        name: "p50",
        type: "line",
        smooth: 0.18,
        data: p50Data,
        connectNulls: false,
        showSymbol: true,
        emphasis: { focus: "series", scale: true },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: green + "28" },
              { offset: 1, color: green + "00" },
            ],
          },
        },
        itemStyle: { color: green },
        lineStyle: { color: green, width: 2 },
        symbol: "circle",
        symbolSize: 4,
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: red, type: "dashed", width: 1 },
          label: {
            formatter: `Threshold ${threshold}ms`,
            color: red,
            fontSize: 10,
            position: "insideEndTop",
          },
          data: [{ yAxis: threshold }],
        },
        markArea: {
          silent: true,
          itemStyle: { color: red + "12" },
          data: [[{ yAxis: threshold }, { yAxis: yAxisMax }]],
        },
      },
      {
        name: "p95",
        type: "line",
        smooth: 0.18,
        data: p95Data,
        connectNulls: false,
        showSymbol: true,
        emphasis: { focus: "series", scale: true },
        areaStyle: null,
        itemStyle: { color: amber },
        lineStyle: { color: amber, width: 1.5, type: "dashed", dashOffset: 4 },
        symbol: "circle",
        symbolSize: 4,
      },
    ],
    grid: { left: 8, right: 8, top: 28, bottom: 4, containLabel: true },
  };

  return (
    <div className="relative overflow-hidden" aria-busy={isFetchingChart}>
      <FetchingIndicator
        active={isFetchingChart && !isLoading}
        label="Updating response time chart"
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <ChartSummaryItem
          label="Latest bucket p50"
          value={
            latestBucket?.p50Data === null || latestBucket?.p50Data === undefined
              ? "—"
              : `${latestBucket.p50Data}ms`
          }
          context={latestBucket?.bucket}
        />
        <ChartSummaryItem
          label="Latest bucket p95"
          value={
            latestBucket?.p95Data === null || latestBucket?.p95Data === undefined
              ? "—"
              : `${latestBucket.p95Data}ms`
          }
          context={latestBucket?.bucket}
        />
        <ChartSummaryItem
          label="Buckets with data"
          value={`${measuredBucketCount} / ${bucketData.length}`}
          context="Selected range"
        />
      </div>

      {hasSeriesData ? (
        <div className="mt-3 min-w-0 overflow-x-auto">
          <Chart option={option} height={300} />
        </div>
      ) : (
        <div className="mt-3 flex h-[300px] items-center justify-center rounded-md border border-dashed border-sf-border bg-sf-bg/30 px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-sf-text">
              No response-time data
            </p>
            <p className="mt-1 text-xs text-sf-text-muted">
              No completed checks were recorded during this range.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ChartSummaryItem = ({
  label,
  value,
  context,
}: {
  label: string;
  value: string;
  context?: string;
}) => (
  <div className="rounded-md border border-sf-border bg-sf-bg/35 px-3.5 py-3">
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
      {label}
    </p>
    <div className="mt-1.5 flex items-end justify-between gap-2">
      <p className="font-mono text-base font-semibold tabular-nums text-sf-text">
        {value}
      </p>
      {context ? (
        <p className="truncate text-[10px] text-sf-text-muted">{context}</p>
      ) : null}
    </div>
  </div>
);

export default IndividualMonitorInfoStats;
