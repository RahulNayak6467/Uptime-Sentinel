"use client";

import { useTheme } from "next-themes";
import Chart from "@/utils/chart";
import type { Tone } from "./monitor-detail-primitives";

/* ------------------------------------------------------------------ */
/* Palette — mirrors utils/echarts-theme so canvas colors match tokens */
/* ------------------------------------------------------------------ */

const usePalette = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return {
    isDark,
    text: isDark ? "#777780" : "#747680",
    grid: isDark ? "#1e1e22" : "#e2e2e5",
    tooltipBg: isDark ? "#151517" : "#ffffff",
    tooltipBorder: isDark ? "#1e1e22" : "#e2e2e5",
    tooltipText: isDark ? "#ececef" : "#202024",
    tone: {
      neutral: isDark ? "#777780" : "#747680",
      positive: isDark ? "#4cb782" : "#269765",
      warning: isDark ? "#d7a453" : "#b7791f",
      negative: isDark ? "#e96b72" : "#d14d56",
      info: isDark ? "#7c82e8" : "#5e6ad2",
    } as Record<Tone, string>,
    percentile: {
      p50: isDark ? "#7c82e8" : "#5e6ad2",
      p95: isDark ? "#45b8a5" : "#258c7d",
    } as Record<string, string>,
  };
};

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ------------------------------------------------------------------ */
/* TrendChart — themed latency/timing series with an optional threshold */
/* ------------------------------------------------------------------ */

export type TrendSeries = {
  name: string;
  values: (number | null)[];
  tone?: Tone;
};

export const TrendChart = ({
  values,
  series,
  categories,
  threshold,
  tone = "info",
  unit = "ms",
  height = 200,
  area = true,
  compact = false,
}: {
  values?: (number | null)[];
  series?: TrendSeries[];
  categories?: string[];
  threshold?: number;
  tone?: Tone;
  unit?: string;
  height?: number;
  area?: boolean;
  compact?: boolean;
}) => {
  const palette = usePalette();
  const fallbackValues = values ?? [];
  const trendSeries = series?.length
    ? series.map((item) => ({
        ...item,
        color:
          palette.percentile[item.name] ??
          (item.tone ? palette.tone[item.tone] : palette.tone[tone]),
      }))
    : [
        {
          name: "Latency",
          values: fallbackValues,
          color: palette.tone[tone],
        },
      ];
  const x =
    categories ??
    (trendSeries[0]?.values ?? []).map((_, index) => `${index + 1}`);

  const measured = trendSeries
    .flatMap((item) => item.values)
    .filter((value): value is number => value !== null);
  const dataMax = measured.length ? Math.max(...measured) : 1;
  const showThreshold = Boolean(
    threshold && threshold <= dataMax * 1.5,
  );
  const axisMax = showThreshold && threshold
    ? Math.max(dataMax, threshold)
    : dataMax;
  const lineTypes = ["solid", "dashed"] as const;

  const option = {
    grid: compact
      ? { left: 0, right: 0, top: 6, bottom: 6 }
      : {
          left: 8,
          right: 12,
          top: trendSeries.length > 1 ? 34 : 12,
          bottom: 6,
          containLabel: true,
        },
    legend: {
      show: !compact && trendSeries.length > 1,
      top: 0,
      right: 4,
      selectedMode: "multiple",
      itemWidth: 14,
      itemHeight: 3,
      itemGap: 18,
      textStyle: { color: palette.text, fontSize: 10, fontWeight: 600 },
      inactiveColor: hexToRgba(palette.text, 0.45),
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: palette.tooltipBg,
      borderColor: palette.tooltipBorder,
      borderWidth: 1,
      padding: [8, 11],
      textStyle: { color: palette.tooltipText, fontSize: 12 },
      extraCssText:
        "border-radius:6px;box-shadow:0 10px 28px rgba(15,23,42,0.14);",
      axisPointer: {
        type: "line",
        lineStyle: { color: palette.grid, type: "dashed", width: 1 },
      },
      formatter: (params: { value: number | null; axisValue: string; seriesName: string; marker: string }[]) => {
        const point = params[0];
        const label = point?.axisValue ?? "";
        const rows = params
          .map((item) => {
            const value =
              typeof item.value === "number"
                ? `<b>${item.value}${unit}</b>`
                : `<span style="opacity:.6">no data</span>`;
            return `<div style="display:flex;justify-content:space-between;gap:20px;margin-top:4px"><span>${item.marker}${item.seriesName}</span>${value}</div>`;
          })
          .join("");
        const breach =
          threshold && params.some((item) => typeof item.value === "number" && item.value >= threshold)
            ? `<div style="margin-top:5px;color:${palette.tone.warning}">▲ above ${threshold}${unit}</div>`
            : "";
        return `<div style="font-weight:600;margin-bottom:3px">${label}</div>${rows}${breach}`;
      },
    },
    xAxis: {
      type: "category",
      data: x,
      boundaryGap: false,
      show: !compact,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: !compact,
        color: palette.text,
        fontSize: 11,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: Math.ceil((axisMax * 1.15) / 10) * 10,
      splitNumber: 4,
      show: !compact,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: !compact,
        color: palette.text,
        fontSize: 11,
        margin: 14,
      },
      splitLine: {
        lineStyle: { color: palette.grid, type: "dashed", opacity: 0.75 },
      },
    },
    series: trendSeries.map((item, index) => ({
        name: item.name,
        type: "line",
        data: item.values,
        smooth: 0.22,
        smoothMonotone: "x",
        connectNulls: false,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        emphasis: {
          focus: "series",
          lineStyle: { width: 3, opacity: 1 },
        },
        blur: {
          lineStyle: { opacity: 0.12 },
        },
        lineStyle: {
          width: compact ? 1.4 : index === 0 ? 2 : 1.45,
          color: item.color,
          type: lineTypes[index] ?? "solid",
          opacity: index === 0 ? 1 : 0.9,
        },
        itemStyle: { color: item.color },
        areaStyle: area && trendSeries.length === 1
          ? {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: hexToRgba(item.color, palette.isDark ? 0.28 : 0.18) },
                  { offset: 1, color: hexToRgba(item.color, 0) },
                ],
              },
            }
          : undefined,
        markLine: showThreshold && threshold && index === 0
          ? {
              silent: true,
              symbol: "none",
              lineStyle: {
                color: palette.tone.warning,
                type: "dashed",
                width: 1,
              },
              label: {
                show: !compact,
                position: "insideEndTop",
                formatter: `${threshold}${unit}`,
                color: palette.tone.warning,
                fontSize: 10,
              },
              data: [{ yAxis: threshold }],
            }
          : undefined,
      })),
  };

  return <Chart option={option} height={height} />;
};

/* ------------------------------------------------------------------ */
/* RadialGauge — SVG progress ring (certificate lifetime, quota, etc.)  */
/* ------------------------------------------------------------------ */

const GAUGE_TONE: Record<Tone, string> = {
  neutral: "var(--color-sf-text-muted)",
  positive: "var(--color-sf-green)",
  warning: "var(--color-sf-amber)",
  negative: "var(--color-sf-red)",
  info: "var(--sf-protocol-accent)",
};

export const RadialGauge = ({
  percent,
  tone = "positive",
  value,
  label,
  marker,
  size = 176,
}: {
  /** 0–100 fill of the ring */
  percent: number;
  tone?: Tone;
  /** large centered value */
  value: React.ReactNode;
  /** small centered caption under the value */
  label?: React.ReactNode;
  /** optional secondary marker (0–100), e.g. the warning threshold */
  marker?: number;
  size?: number;
}) => {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const dash = (clamped / 100) * circumference;
  const markerAngle = marker !== undefined ? (marker / 100) * 360 - 90 : null;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-sf-border-faint)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={GAUGE_TONE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      {markerAngle !== null ? (
        <span
          className="absolute left-1/2 top-1/2 h-[14px] w-[3px] -translate-x-1/2 rounded-full bg-sf-amber"
          style={{
            transform: `rotate(${markerAngle}deg) translateY(-${radius}px)`,
            transformOrigin: "center center",
          }}
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-[-0.03em] tabular-nums text-sf-text">
          {value}
        </span>
        {label ? (
          <span className="mt-1 text-[11px] font-medium text-sf-text-muted">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
};
