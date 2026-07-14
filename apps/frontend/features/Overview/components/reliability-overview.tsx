"use client";

import { Activity, Grid3X3 } from "lucide-react";
import { LIMIT } from "@/constants/constant";
import { useAllMonitorsData } from "../hooks/useMonitorsData";
import Chart from "@/utils/chart";
import {
  buildAverageResponseSeries,
  percentile,
  RESPONSE_SAMPLE_COUNT,
} from "@/utils/overview-series";

const STATUS_DOT: Record<string, string> = {
  UP: "bg-sf-green",
  DOWN: "bg-sf-red",
  UNKNOWN: "bg-sf-text-muted/60",
};

const TrendChart = ({
  values,
  average,
}: {
  values: (number | null)[];
  average: number | null;
}) => {
  const option = {
    animationDuration: 450,
    animationEasing: "cubicOut",
    grid: { left: 4, right: 16, top: 18, bottom: 24, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: { color: "rgba(124, 131, 230, 0.45)", type: "dashed" },
      },
      formatter: (params: { data: number | null; axisValueLabel: string }[]) => {
        const point = params[0];
        return `${point.axisValueLabel}<br/><span>Cross-monitor average</span><br/><strong>${point.data === null ? "No response data" : `${Math.round(point.data)} ms`}</strong>`;
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
        name: "Cross-monitor average",
        type: "line",
        data: values,
        smooth: 0.28,
        connectNulls: false,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 2, color: "#7c83e6" },
        itemStyle: { color: "#7c83e6", borderColor: "#ffffff", borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(124, 131, 230, 0.22)" },
              { offset: 1, color: "rgba(124, 131, 230, 0)" },
            ],
          },
        },
        markLine:
          average === null
            ? undefined
            : {
                silent: true,
                symbol: "none",
                lineStyle: {
                  color: "rgba(138, 138, 148, 0.55)",
                  type: "dashed",
                  width: 1,
                },
                label: {
                  formatter: `overall avg ${Math.round(average)}ms`,
                  position: "insideEndTop",
                  color: "#8a8a94",
                  fontSize: 10,
                },
                data: [{ yAxis: average }],
              },
        emphasis: { focus: "series", scale: true },
      },
    ],
  };

  return <Chart option={option} height={245} />;
};

const HeaderStat = ({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) => (
  <div
    className={`flex min-h-[76px] min-w-0 flex-col justify-center rounded-lg px-4 py-3 ${
      emphasized ? "bg-sf-blue-bg" : "bg-sf-bg/70"
    }`}
  >
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-sf-text-muted">
      {label}
    </p>
    <p
      className={`mt-1.5 whitespace-nowrap text-[18px] font-semibold tracking-[-0.025em] tabular-nums ${
        emphasized ? "text-sf-blue" : "text-sf-text"
      }`}
    >
      {value}
    </p>
  </div>
);

const PanelHeading = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Activity;
  title: string;
  subtitle: string;
}) => (
  <div>
    <div className="flex items-center gap-2">
      <span className="flex size-6 items-center justify-center rounded-sf-sm bg-sf-blue-bg text-sf-blue">
        <Icon className="size-3.5" />
      </span>
      <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">
        {title}
      </h2>
    </div>
    <p className="mt-1.5 text-xs text-sf-text-muted">{subtitle}</p>
  </div>
);

const ms = (value: number | null) =>
  value === null ? "—" : `${Math.round(value)}ms`;

const ReliabilityOverview = () => {
  const { data, isLoading, isError } = useAllMonitorsData(1, LIMIT);

  if (isLoading || isError || !data || data.data.length === 0) return null;

  const series = buildAverageResponseSeries(data.data);
  const successful = series.filter((value): value is number => value !== null);
  const sortedAsc = [...successful].sort((a, b) => a - b);

  const currentAverage = successful.length
    ? successful.reduce((sum, value) => sum + value, 0) / successful.length
    : null;
  const lowestPoint = successful.length ? Math.min(...successful) : null;
  const highestPoint = successful.length ? Math.max(...successful) : null;
  const p95 = percentile(sortedAsc, 95);

  return (
    <section>
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sf-blue">
          Reliability signals
        </p>
        <h2 className="mt-1 text-[14px] font-semibold tracking-sf-tight text-sf-text">
          Performance and check health
        </h2>
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.85fr)]">
        <section className="sf-panel flex flex-col overflow-hidden p-5 shadow-sm">
          <PanelHeading
            icon={Activity}
            title="Cross-monitor response pattern"
            subtitle={`Up to ${RESPONSE_SAMPLE_COUNT} response samples per monitor across the first ${LIMIT} monitors`}
          />
          <div className="mt-3 flex-1">
            <TrendChart values={series} average={currentAverage} />
          </div>
        </section>

        <section className="sf-panel flex flex-col p-5 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sf-blue">
              Chart summary
            </p>
            <h3 className="mt-1 text-[14px] font-semibold tracking-sf-tight text-sf-text">
              Plotted response averages
            </h3>
            <p className="mt-1.5 text-xs text-sf-text-muted">
              Statistics calculated from the points shown in the chart
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <HeaderStat label="Lowest point" value={ms(lowestPoint)} />
            <HeaderStat label="P95 point" value={ms(p95)} />
            <HeaderStat label="Highest point" value={ms(highestPoint)} />
            <HeaderStat label="Chart average" value={ms(currentAverage)} emphasized />
          </div>
          <div className="mt-4 rounded-md border border-sf-border-faint bg-sf-bg/60 px-3 py-2 text-xs leading-5 text-sf-text-muted">
            <span className="font-semibold text-sf-text-sub">How to read it:</span>{" "}
            Each point averages available responses at the same sample position
            across monitors. Missing values are excluded; positions are not clock
            times.
          </div>
        </section>
      </div>

      <section className="sf-panel mt-4 flex flex-col overflow-hidden p-5 shadow-sm">
        <PanelHeading
          icon={Grid3X3}
          title="Recent check health"
          subtitle={`Top 6 monitors · last ${RESPONSE_SAMPLE_COUNT} checks each`}
        />

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.data.slice(0, 6).map((monitor) => {
            const checks = monitor.response.slice(-RESPONSE_SAMPLE_COUNT);
            const okCount = checks.filter(
              (check) => check.responseTime !== null,
            ).length;
            const okRate = checks.length
              ? Math.round((okCount / checks.length) * 100)
              : null;

            return (
              <div
                key={monitor.id}
                className="rounded-lg border border-sf-border-faint bg-sf-bg/40 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-2">
                    <i
                      className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[monitor.status] ?? STATUS_DOT.UNKNOWN}`}
                    />
                    <span className="truncate text-sm font-medium text-sf-text-sub">
                      {monitor.monitorName}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-xs font-semibold tabular-nums ${
                      okRate === null || okRate === 100
                        ? "text-sf-text-sub"
                        : okRate >= 90
                          ? "text-sf-amber"
                          : "text-sf-red"
                    }`}
                  >
                    {okRate === null ? "No checks" : `${okRate}% OK`}
                  </span>
                </div>
                <div className="mt-3 grid max-w-[620px] grid-cols-[repeat(26,minmax(3px,1fr))] gap-0.5 sm:grid-cols-[repeat(26,minmax(5px,1fr))] sm:gap-1">
                  {Array.from({ length: RESPONSE_SAMPLE_COUNT }, (_, index) => {
                    const check = checks[index];
                    const title = !check
                      ? "No check recorded"
                      : check.responseTime === null
                        ? "Failed check"
                        : `${check.responseTime}ms`;
                    const color = !check
                      ? "bg-sf-border-faint"
                      : check.responseTime === null
                        ? "bg-sf-red hover:bg-sf-red/80"
                        : "bg-sf-blue/55 hover:bg-sf-blue";

                    return (
                      <span
                        key={index}
                        title={title}
                        className={`h-3 rounded-[3px] transition-colors sm:h-4 ${color}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-sf-border pt-4 text-xs text-sf-text-muted">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-sf-blue/55" />
            Successful
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-sf-red" />
            Failed
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-sf-border-faint" />
            No check
          </span>
        </div>
      </section>
    </section>
  );
};

export default ReliabilityOverview;
