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
import { IndividualStatsCardProps, RegionMonitorProps } from "./types";
import Chart from "@/utils/chart";

const IndividualMonitorInfoStats = () => {
  return (
    <div>
      <div className="border border-b-sf-border bg-sf-surface mt-6 rounded-sf">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-[16px] font-sans font-medium text-sf-text">
              Operational
            </p>
            <a className="cursor-pointer text-sf-blue text-[14px] hover:underline">
              https://statusforge.io
            </a>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col justify-center">
              <p className="text-[16px] text-sf-text-muted font-sans">
                Checked
              </p>
              <p className="text-[14px] text-sf-text font-sans">8s ago</p>
            </div>
            <div className="flex flex-col ">
              <p className="text-[16px] text-sf-text-muted font-sans">
                Intervals
              </p>
              <p className="text-sf-label text-sf-text font-sans">60s</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[16px] text-sf-text-muted font-sans">
                Regions
              </p>
              <p className="text-[14px] text-sf-text font-sans">
                Global: 5regions
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {IndividualStatsCardData.map((data) => (
          <StatsCard key={data.id} title={data.title} stats={data.stats} />
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ title, stats }: IndividualStatsCardProps) => {
  return (
    <div className="w-full bg-sf-surface mt-6 flex flex-col gap-1 p-4  rounded-sf border border-sf-border hover:border-sf-text-muted transition-colors">
      <p className="text-[14px] text-sf-text-sub font-sans font-medium">
        {title}
      </p>
      <p className="text-[20px] text-sf-text font-sans font-medium">{stats}</p>
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

export const ResponseTimeTrend = () => {
  const isDark = useDarkMode();

  const green = isDark ? "#4ade80" : "#16a34a";
  const amber = isDark ? "#fbbf24" : "#d97706";
  const red = isDark ? "#f87171" : "#dc2626";
  const axisLine = isDark ? "#333333" : "#cbd5e1";

  const threshold = 400;

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: { color: axisLine, type: "dashed", width: 1 },
      },
      formatter: (params: { seriesName: string; value: number; axisValue: string }[]) => {
        const time = params[0]?.axisValue ?? "";
        const rows = params
          .map((p) => `<span style="color:${p.seriesName === "Avg response" ? green : amber}">●</span> ${p.seriesName}: <b>${p.value}ms</b>`)
          .join("<br/>");
        const breach = params.some((p) => p.value >= threshold)
          ? `<br/><span style="color:${red}">▲ above ${threshold}ms threshold</span>`
          : "";
        return `<div style="font-weight:600;margin-bottom:2px">${time}</div>${rows}${breach}`;
      },
    },
    legend: {
      data: [
        { name: "Avg response", icon: "rect" },
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
      data: responseTimeHours,
      boundaryGap: false,
      axisLabel: { fontSize: 11, margin: 10 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: { formatter: "{value}ms", fontSize: 11 },
      splitLine: { lineStyle: { type: "dashed", opacity: 0.5 } },
    },
    series: [
      {
        name: "Avg response",
        type: "line",
        smooth: 0.4,
        data: responseTimeAvg,
        emphasis: { focus: "series" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: green + "28" },
              { offset: 1, color: green + "00" },
            ],
          },
        },
        itemStyle: { color: green },
        lineStyle: { color: green, width: 2 },
        symbol: "none",
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
          data: [[{ yAxis: threshold }, { yAxis: 500 }]],
        },
      },
      {
        name: "p95",
        type: "line",
        smooth: 0.4,
        data: responseTimeP95,
        emphasis: { focus: "series" },
        areaStyle: null,
        itemStyle: { color: amber },
        lineStyle: { color: amber, width: 1.5, type: "dashed", dashOffset: 4 },
        symbol: "none",
      },
    ],
    grid: { left: 8, right: 8, top: 28, bottom: 4, containLabel: true },
  };

  return (
    <div>
      <Chart option={option} height={300} />
    </div>
  );
};

export default IndividualMonitorInfoStats;
