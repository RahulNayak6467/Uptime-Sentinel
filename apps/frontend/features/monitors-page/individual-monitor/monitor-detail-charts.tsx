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

export const TrendChart = ({
  values,
  categories,
  threshold,
  tone = "info",
  unit = "ms",
  height = 200,
  area = true,
  compact = false,
}: {
  values: (number | null)[];
  categories?: string[];
  threshold?: number;
  tone?: Tone;
  unit?: string;
  height?: number;
  area?: boolean;
  compact?: boolean;
}) => {
  const palette = usePalette();
  const color = palette.tone[tone];
  const x = categories ?? values.map((_, index) => `${index + 1}`);

  const measured = values.filter((v): v is number => v !== null);
  const dataMax = measured.length ? Math.max(...measured) : 1;
  const axisMax = threshold ? Math.max(dataMax, threshold) : dataMax;

  const option = {
    grid: compact
      ? { left: 0, right: 0, top: 6, bottom: 6 }
      : { left: 8, right: 12, top: 12, bottom: 6, containLabel: true },
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
      formatter: (params: { value: number | null; axisValue: string }[]) => {
        const point = params[0];
        const label = point?.axisValue ?? "";
        const value =
          typeof point?.value === "number"
            ? `<b>${point.value}${unit}</b>`
            : `<span style="opacity:.6">no data</span>`;
        const breach =
          threshold && typeof point?.value === "number" && point.value >= threshold
            ? `<div style="margin-top:5px;color:${palette.tone.warning}">▲ above ${threshold}${unit}</div>`
            : "";
        return `<div style="font-weight:600;margin-bottom:3px">${label}</div>${value}${breach}`;
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
      show: !compact,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: !compact, color: palette.text, fontSize: 11 },
      splitLine: { lineStyle: { color: palette.grid, type: "dashed" } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        smoothMonotone: "x",
        connectNulls: false,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        emphasis: { focus: "series" },
        lineStyle: { width: compact ? 1.5 : 2, color },
        itemStyle: { color },
        areaStyle: area
          ? {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: hexToRgba(color, palette.isDark ? 0.28 : 0.18) },
                  { offset: 1, color: hexToRgba(color, 0) },
                ],
              },
            }
          : undefined,
        markLine: threshold
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
      },
    ],
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
  info: "var(--color-sf-blue)",
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
