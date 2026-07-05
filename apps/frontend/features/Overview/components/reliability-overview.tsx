"use client";

import { Activity, Grid3X3 } from "lucide-react";
import { LIMIT } from "@/constants/constant";
import { useAllMonitorsData } from "../hooks/useMonitorsData";
import Chart from "@/utils/chart";

const buildAverageSeries = (
  monitors: NonNullable<ReturnType<typeof useAllMonitorsData>["data"]>["data"],
) => {
  const samples = monitors.map((monitor) =>
    monitor.response.slice(0, 26).map((point) => point.responseTime),
  );
  const length = Math.max(0, ...samples.map((sample) => sample.length));

  return Array.from({ length }, (_, index) => {
    const values = samples
      .map((sample) => sample[index])
      .filter((value): value is number => value !== null && value !== undefined);
    return values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : null;
  });
};

const TrendChart = ({ values }: { values: (number | null)[] }) => {
  const option = {
    animationDuration: 450,
    animationEasing: "cubicOut",
    grid: { left: 4, right: 12, top: 18, bottom: 28, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line", lineStyle: { color: "#71717a", type: "dashed" } },
      formatter: (params: { data: number | null; axisValueLabel: string }[]) => {
        const point = params[0];
        return `${point.axisValueLabel}<br/><strong>${point.data === null ? "No successful response" : `${Math.round(point.data)} ms`}</strong>`;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: values.map((_, index) => `Sample ${index + 1}`),
      axisLabel: {
        interval: Math.max(Math.floor(values.length / 4) - 1, 0),
        formatter: (_value: string, index: number) => `${index + 1}`,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      splitNumber: 4,
      axisLabel: { formatter: (value: number) => `${value}ms` },
      splitLine: { show: true, lineStyle: { type: "dashed" } },
    },
    series: [
      {
        name: "Average response time",
        type: "line",
        data: values,
        smooth: 0.28,
        connectNulls: false,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 2, color: "#7c83e6" },
        itemStyle: { color: "#7c83e6", borderColor: "#ffffff", borderWidth: 2 },
        areaStyle: { color: "rgba(124, 131, 230, 0.10)" },
        emphasis: { focus: "series", scale: true },
      },
    ],
  };

  return <Chart option={option} height={245} />;
};

const ReliabilityOverview = () => {
  const { data, isLoading, isError } = useAllMonitorsData(1, LIMIT);

  if (isLoading || isError || !data || data.data.length === 0) return null;

  const series = buildAverageSeries(data.data);
  const average = series.filter((value): value is number => value !== null);
  const currentAverage = average.length
    ? Math.round(average.reduce((sum, value) => sum + value, 0) / average.length)
    : null;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
      <section className="sf-panel p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-sf-blue" />
              <h2 className="text-sm font-semibold text-sf-text">Response-time samples</h2>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">Average successful response across monitors</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold tracking-sf-tight text-sf-text">{currentAverage === null ? "—" : `${currentAverage}ms`}</p>
            <p className="text-[10px] uppercase tracking-wider text-sf-text-muted">Average</p>
          </div>
        </div>
        <div className="mt-3"><TrendChart values={series} /></div>
      </section>

      <section className="sf-panel p-5">
        <div className="flex items-center gap-2">
          <Grid3X3 className="size-4 text-sf-blue" />
          <h2 className="text-sm font-semibold text-sf-text">Recent check health</h2>
        </div>
        <p className="mt-1 text-xs text-sf-text-muted">Successful and failed checks by monitor</p>
        <div className="mt-6 space-y-4">
          {data.data.slice(0, 6).map((monitor) => (
            <div key={monitor.id} className="grid grid-cols-[110px_1fr] items-center gap-3">
              <span className="truncate text-[11px] font-medium text-sf-text-sub">{monitor.urlName}</span>
              <div className="grid grid-cols-13 gap-1">
                {monitor.response.slice(0, 26).map((check, index) => (
                  <span
                    key={index}
                    title={check.responseTime === null ? "Failed check" : `${check.responseTime}ms`}
                    className={`h-3 rounded-[2px] ${check.responseTime === null ? "bg-sf-red" : "bg-sf-blue/55"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4 border-t border-sf-border pt-4 text-[10px] text-sf-text-muted">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-sm bg-sf-blue/55" />Successful</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-sm bg-sf-red" />Failed</span>
        </div>
      </section>
    </div>
  );
};

export default ReliabilityOverview;
