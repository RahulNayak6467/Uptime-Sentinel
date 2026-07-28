const sfDark = {
  color: [
    "#4cb782", // sf-green
    "#7c82e8", // sf-blue (Linear indigo)
    "#d7a453", // sf-amber
    "#e96b72", // sf-red
    "#9b8afb", // purple
    "#55b89a", // emerald
    "#fb923c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#a1a1aa",
  },
  title: {
    textStyle: { color: "#ececef", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#777780", fontSize: 12 },
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
    axisLabel: { color: "#777780", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#777780", fontSize: 11 },
    splitLine: { lineStyle: { color: "#1e1e22", type: "dashed" } },
  },
  tooltip: {
    backgroundColor: "#151517",
    borderColor: "#1e1e22",
    borderWidth: 1,
    textStyle: { color: "#ececef", fontSize: 12 },
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
    backgroundColor: "#111113",
    dataBackgroundColor: "#19191c",
    fillerColor: "rgba(255,255,255,0.04)",
    handleColor: "#35353b",
    borderColor: "#1e1e22",
    textStyle: { color: "#777780" },
  },
};

const sfLight = {
  color: [
    "#269765", // sf-green
    "#5e6ad2", // sf-blue (Linear indigo)
    "#b7791f", // sf-amber
    "#d14d56", // sf-red
    "#7c64d5", // purple
    "#2f987a", // emerald
    "#ea580c", // orange
  ],
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    color: "#5f6069",
  },
  title: {
    textStyle: { color: "#202024", fontSize: 14, fontWeight: 600 },
    subtextStyle: { color: "#747680", fontSize: 12 },
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
    axisLabel: { color: "#747680", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#747680", fontSize: 11 },
    splitLine: { lineStyle: { color: "#e2e2e5", type: "dashed" } },
  },
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e2e5",
    borderWidth: 1,
    textStyle: { color: "#202024", fontSize: 12 },
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
    dataBackgroundColor: "#f0f0f2",
    fillerColor: "rgba(0,0,0,0.04)",
    handleColor: "#d9d9de",
    borderColor: "#e2e2e5",
    textStyle: { color: "#747680" },
  },
};

export { sfDark, sfLight };
