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
        return `${point.axisValueLabel}<br/><strong>${point.data === null ? "No successful response" : `${Math.round(point.data)} ms`}</strong>`;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: values.map((_, index) => `Check ${index + 1}`),
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
                  formatter: `avg ${Math.round(average)}ms`,
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
    className={`min-w-0 rounded-lg px-3 py-2.5 ${
      emphasized ? "bg-sf-blue-bg" : "bg-sf-bg/70"
    }`}
  >
    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-sf-text-muted">
      {label}
    </p>
    <p
      className={`mt-1 whitespace-nowrap text-[15px] font-semibold tracking-[-0.025em] tabular-nums ${
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
      <h2 className="text-[15px] font-semibold tracking-sf-tight text-sf-text">
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
  const fastest = successful.length ? Math.min(...successful) : null;
  const slowest = successful.length ? Math.max(...successful) : null;
  const p95 = percentile(sortedAsc, 95);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sf-blue">
            Reliability signals
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-sf-tight text-sf-text">
            Performance and check health
          </h2>
        </div>
        <span className="hidden rounded-full border border-sf-border bg-sf-surface px-2.5 py-1 font-mono text-[10px] text-sf-text-muted sm:inline-flex">
          Latest {RESPONSE_SAMPLE_COUNT} checks
        </span>
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(390px,0.9fr)]">
      <section className="sf-panel flex min-h-[410px] flex-col overflow-hidden p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <PanelHeading
            icon={Activity}
            title="Response time"
            subtitle="Average of recent successful checks across monitors"
          />
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:min-w-[390px]">
            <HeaderStat label="Fastest" value={ms(fastest)} />
            <HeaderStat label="P95" value={ms(p95)} />
            <HeaderStat label="Slowest" value={ms(slowest)} />
            <HeaderStat label="Average" value={ms(currentAverage)} emphasized />
          </div>
        </div>
        <div className="mt-3 flex-1">
          <TrendChart values={series} average={currentAverage} />
        </div>
      </section>

      <section className="sf-panel flex min-h-[410px] flex-col overflow-hidden p-5 shadow-sm">
        <PanelHeading
          icon={Grid3X3}
          title="Recent check health"
          subtitle={`Last ${RESPONSE_SAMPLE_COUNT} checks per monitor · successful vs failed`}
        />

        <div className="mt-5 grid grid-cols-[minmax(0,110px)_1fr_44px] items-center gap-3 text-[9px] font-medium uppercase tracking-wider text-sf-text-muted">
          <span>Monitor</span>
          <span />
          <span className="text-right">OK rate</span>
        </div>

        <div className="mt-3 space-y-3.5">
          {data.data.slice(0, 6).map((monitor) => {
            const checks = monitor.response.slice(0, RESPONSE_SAMPLE_COUNT);
            const okCount = checks.filter(
              (check) => check.responseTime !== null,
            ).length;
            const okRate = checks.length
              ? Math.round((okCount / checks.length) * 100)
              : null;

            return (
              <div
                key={monitor.id}
                className="grid grid-cols-[minmax(0,110px)_1fr_44px] items-center gap-3"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <i
                    className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[monitor.status] ?? STATUS_DOT.UNKNOWN}`}
                  />
                  <span className="truncate text-[11px] font-medium text-sf-text-sub">
                    {monitor.urlName}
                  </span>
                </span>
                <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1">
                  {checks.map((check, index) => (
                    <span
                      key={index}
                      title={
                        check.responseTime === null
                          ? "Failed check"
                          : `${check.responseTime}ms`
                      }
                      className={`h-[18px] rounded-[3px] transition-colors ${check.responseTime === null ? "bg-sf-red hover:bg-sf-red/80" : "bg-sf-blue/55 hover:bg-sf-blue"}`}
                    />
                  ))}
                </div>
                <span
                  className={`text-right text-[11px] font-semibold tabular-nums ${
                    okRate === null || okRate === 100
                      ? "text-sf-text-sub"
                      : okRate >= 90
                        ? "text-sf-amber"
                        : "text-sf-red"
                  }`}
                >
                  {okRate === null ? "—" : `${okRate}%`}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-sf-border pt-4 text-[10px] text-sf-text-muted">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-sf-blue/55" />
            Successful
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-[2px] bg-sf-red" />
            Failed
          </span>
        </div>
      </section>
      </div>
    </section>
  );
};

export default ReliabilityOverview;
