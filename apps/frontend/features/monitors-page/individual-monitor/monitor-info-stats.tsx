"use client";

import { useEffect, useState } from "react";
import { MapPin, Shield, Wifi } from "lucide-react";
import {
  IndividualStatsCardData,
  RegionalLatencyStats,
  responseTimeAvg,
  responseTimeHours,
  responseTimeP95,
} from "./data";
import Error from "../../Overview/components/error";
import {
  ChartSkeleton,
  MetricCardsSkeleton,
} from "@/components/loading/dashboard-skeletons";
import {
  IndividualStatsCardProps,
  RegionMonitorProps,
  TimeRangeProps,
} from "./types";
import Chart from "@/utils/chart";
import { useIndividualStats } from "@/features/monitors-page/individual-monitor/hooks/useIndividualStats";
import { useParams } from "next/navigation";
import { useTimeRange } from "@/features/monitors-page/individual-monitor/hooks/useTimeRange";
import { useIsFetching } from "@tanstack/react-query";
import { FetchingIndicator } from "@/components/ui/fetching-indicator";
import { ChartTimeRange, formatChartDate } from "@/utils/format-chart-date";
import { IndividualOverviewStatsProps } from "./types";
import { useIndividualMonitorOverview } from "@/features/monitors-page/individual-monitor/hooks/useInvidualMonitorOverview";
import {
  OperationalSkeleton,
  OperationalError,
} from "./monitor-overview-states";
import { formatTimeUntil } from "@/utils/format-time-until";
import { useSSEIndividualMonitorData } from "./hooks/useSSEIndividualMonitorData";

const StripStat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col justify-center items-center">
    <p className="text-[14px] text-sf-text-muted font-sans">{label}</p>
    <p className="text-[14px] text-sf-text font-sans">{value}</p>
  </div>
);

const OperationalStrip = ({ data }: { data: IndividualOverviewStatsProps }) => {
  const nextCheck = !data.isActive
    ? "Paused"
    : data.status === "UNKNOWN"
      ? "Pending"
      : new Date(data.nextCheckAt) <= new Date()
        ? "Due now"
        : formatTimeUntil(data.nextCheckAt);

  return (
    <div className="sf-panel">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex gap-2 items-center">
          <p className="text-[16px] font-sans font-medium text-sf-text">
            {data.isActive ? "Operational" : "Not operational"}
          </p>
          <a className="cursor-pointer text-sf-blue text-[14px] hover:underline">
            {data.url}
          </a>
        </div>
        <div className="flex items-center gap-10">
          <StripStat label="Next check" value={nextCheck} />
          <StripStat label="Intervals" value={`${data.intervalSeconds}s`} />
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
    <div>
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
        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
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
      )}
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  unit,
  context,
}: IndividualStatsCardProps) => {
  return (
    <div className="sf-panel flex w-full flex-col gap-1 p-4 transition-[border-color,box-shadow] hover:border-sf-text-muted/60 hover:shadow-sf-card">
      <p className="text-[14px] text-sf-text-sub font-sans font-medium">
        {title}
      </p>
      <p className="text-[20px] text-sf-text font-sans font-medium">
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

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

export const ResponseTimeTrend = ({
  currentRange,
}: {
  currentRange: TimeRangeProps;
}) => {
  const isDark = useDarkMode();

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

  const green = isDark ? "#4ade80" : "#16a34a";
  const amber = isDark ? "#fbbf24" : "#d97706";
  const red = isDark ? "#f87171" : "#dc2626";
  const axisLine = isDark ? "#333333" : "#cbd5e1";

  const threshold = 1000;

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

  const option = {
    tooltip: {
      trigger: "axis",
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
          return `<div style="font-weight:600;margin-bottom:2px">${time}</div><span>No response-time data available for this time.</span>`;
        }

        const rows = params
          .map((p) => {
            const value =
              typeof p.value === "number" && Number.isFinite(p.value)
                ? `${p.value}ms`
                : "No data";

            return `<span style="color:${p.seriesName === "p50" ? green : amber}">●</span> ${p.seriesName}: <b>${value}</b>`;
          })
          .join("<br/>");
        const breach = params.some(
          (p) => typeof p.value === "number" && p.value >= threshold,
        )
          ? `<br/><span style="color:${red}">▲ above ${threshold}ms threshold</span>`
          : "";
        return `<div style="font-weight:600;margin-bottom:2px">${time}</div>${rows}${breach}`;
      },
    },
    legend: {
      data: [
        { name: "p50", icon: "rect" },
        { name: "p95", icon: "rect" },
      ],
      right: 4,
      top: 2,
      itemWidth: 12,
      itemHeight: 2,
      itemGap: 16,
      textStyle: { fontSize: 11 },
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
        smooth: 0.4,
        data: p50Data,
        connectNulls: false,
        emphasis: { focus: "series" },
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
        smooth: 0.4,
        data: p95Data,
        connectNulls: false,
        emphasis: { focus: "series" },
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
      <Chart option={option} height={300} />
    </div>
  );
};

export default IndividualMonitorInfoStats;
