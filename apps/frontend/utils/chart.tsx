"use client";

import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { useEffect, useRef } from "react";
import { sfDark, sfLight } from "./echarts-theme";

echarts.registerTheme("sf-dark", sfDark);
echarts.registerTheme("sf-light", sfLight);

type ChartProps = {
  option: Record<string, unknown>;
  height?: number | string;
  className?: string;
  loading?: boolean;
};

const Chart = ({ option, height = 240, className, loading = false }: ChartProps) => {
  const ref = useRef<ReactECharts>(null);

  useEffect(() => {
    const applyTheme = () => {
      const instance = ref.current?.getEchartsInstance();
      if (!instance) return;
      const dark = document.documentElement.classList.contains("dark");
      instance.setOption({ ...option }, { replaceMerge: [] });
      // re-apply theme colors on mode change
      instance.setOption({
        textStyle: dark ? sfDark.textStyle : sfLight.textStyle,
      });
    };

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [option]);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <ReactECharts
      ref={ref}
      option={option}
      theme={isDark ? "sf-dark" : "sf-light"}
      style={{ height, width: "100%" }}
      className={className}
      showLoading={loading}
      loadingOption={{
        text: "",
        color: isDark ? "#4ade80" : "#16a34a",
        maskColor: isDark ? "rgba(17,17,17,0.6)" : "rgba(255,255,255,0.6)",
      }}
      notMerge={false}
      opts={{ renderer: "canvas" }}
    />
  );
};

export default Chart;
