const sfDark = {
  color: [
    "#4ade80", // sf-green
    "#60a5fa", // sf-blue
    "#fbbf24", // sf-amber
    "#f87171", // sf-red
    "#a78bfa", // purple
    "#34d399", // emerald
    "#fb923c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#888888",
  },
  title: {
    textStyle: { color: "#f0f0f0", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#737373", fontSize: 12 },
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
    axisLabel: { color: "#737373", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#737373", fontSize: 11 },
    splitLine: { lineStyle: { color: "#222222", type: "dashed" } },
  },
  tooltip: {
    backgroundColor: "#111111",
    borderColor: "#222222",
    borderWidth: 1,
    textStyle: { color: "#f0f0f0", fontSize: 12 },
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
    "#2563eb", // sf-blue
    "#d97706", // sf-amber
    "#dc2626", // sf-red
    "#7c3aed", // purple
    "#059669", // emerald
    "#ea580c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#6b7280",
  },
  title: {
    textStyle: { color: "#111827", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#9ca3af", fontSize: 12 },
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
    axisLabel: { color: "#9ca3af", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#9ca3af", fontSize: 11 },
    splitLine: { lineStyle: { color: "#e5e7eb", type: "dashed" } },
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
