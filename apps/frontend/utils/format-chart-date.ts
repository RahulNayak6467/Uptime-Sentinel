export type ChartTimeRange = "1h" | "24h" | "7d" | "30d";

export const formatChartDate = (
  value: string | Date,
  range: ChartTimeRange,
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formats: Record<ChartTimeRange, Intl.DateTimeFormatOptions> = {
    "1h": {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    "24h": {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    "7d": {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    "30d": {
      day: "2-digit",
      month: "short",
    },
  };

  return new Intl.DateTimeFormat(undefined, formats[range]).format(date);
};
