const sfDark = {
  color: [
    "#4ade80", // sf-green
    "#8b8cf8", // sf-blue
    "#fbbf24", // sf-amber
    "#f87171", // sf-red
    "#a78bfa", // purple
    "#34d399", // emerald
    "#fb923c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#a1a1aa",
  },
  title: {
    textStyle: { color: "#f2f2f3", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#73737d", fontSize: 12 },
  },
  line: {
    itemStyle: { borderWidth: 0 },
    lineStyle: { width: 1.5 },
    smooth: false,
    symbolSize: 0,
  },
  bar: {
    itemStyle: { borderRadius: [2, 2, 0, 0] },
  },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#73737d", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#73737d", fontSize: 11 },
    splitLine: { lineStyle: { color: "#29292c", type: "dashed" } },
  },
  tooltip: {
    backgroundColor: "#151516",
    borderColor: "#29292c",
    borderWidth: 1,
    textStyle: { color: "#f2f2f3", fontSize: 12 },
    extraCssText: "box-shadow: 0 4px 16px rgba(0,0,0,0.4); border-radius: 6px;",
  },
  legend: {
    textStyle: { color: "#888888", fontSize: 12 },
    inactiveColor: "#333333",
    pageTextStyle: { color: "#888888" },
  },
  toolbox: {
    iconStyle: { borderColor: "#444444" },
    emphasis: { iconStyle: { borderColor: "#888888" } },
  },
  dataZoom: {
    backgroundColor: "#111111",
    dataBackgroundColor: "#1a1a1a",
    fillerColor: "rgba(255,255,255,0.04)",
    handleColor: "#333333",
    borderColor: "#222222",
    textStyle: { color: "#737373" },
  },
};

const sfLight = {
  color: [
    "#16a34a", // sf-green
    "#5e6ad2", // sf-blue
    "#d97706", // sf-amber
    "#dc2626", // sf-red
    "#7c3aed", // purple
    "#059669", // emerald
    "#ea580c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#5f5f69",
  },
  title: {
    textStyle: { color: "#1b1b1f", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#8a8a94", fontSize: 12 },
  },
  line: {
    itemStyle: { borderWidth: 0 },
    lineStyle: { width: 1.5 },
    smooth: false,
    symbolSize: 0,
  },
  bar: {
    itemStyle: { borderRadius: [2, 2, 0, 0] },
  },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#8a8a94", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#8a8a94", fontSize: 11 },
    splitLine: { lineStyle: { color: "#e4e4e7", type: "dashed" } },
  },
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#111827", fontSize: 12 },
    extraCssText: "box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 6px;",
  },
  legend: {
    textStyle: { color: "#6b7280", fontSize: 12 },
    inactiveColor: "#d1d5db",
    pageTextStyle: { color: "#6b7280" },
  },
  toolbox: {
    iconStyle: { borderColor: "#d1d5db" },
    emphasis: { iconStyle: { borderColor: "#6b7280" } },
  },
  dataZoom: {
    backgroundColor: "#ffffff",
    dataBackgroundColor: "#f9fafb",
    fillerColor: "rgba(0,0,0,0.04)",
    handleColor: "#e5e7eb",
    borderColor: "#e5e7eb",
    textStyle: { color: "#9ca3af" },
  },
};

export { sfDark, sfLight };
