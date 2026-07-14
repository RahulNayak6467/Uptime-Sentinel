import type { allMonitorsDataDashboardView } from "@/features/Overview/types";

export const RESPONSE_SAMPLE_COUNT = 26;

// Averages the most-recent N response-time samples across every monitor,
// column by column. Failed checks (null) are ignored; a column with no
// successful check on any monitor collapses to null so the line breaks
// instead of drawing a misleading zero.
export const buildAverageResponseSeries = (
  monitors: allMonitorsDataDashboardView,
  sampleCount: number = RESPONSE_SAMPLE_COUNT,
): (number | null)[] => {
  const samples = monitors.map((monitor) =>
    monitor.response.slice(-sampleCount).map((point) => point.responseTime),
  );
  const length = Math.max(0, ...samples.map((sample) => sample.length));

  return Array.from({ length }, (_, index) => {
    const values = samples
      .map((sample) => sample[index])
      .filter(
        (value): value is number => value !== null && value !== undefined,
      );
    return values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : null;
  });
};

// Linear-interpolated percentile over an ascending-sorted array.
// Returns null for an empty input so callers can render a placeholder.
export const percentile = (
  sortedAsc: number[],
  p: number,
): number | null => {
  if (sortedAsc.length === 0) return null;
  if (sortedAsc.length === 1) return sortedAsc[0];

  const rank = (p / 100) * (sortedAsc.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return sortedAsc[low];

  const weight = rank - low;
  return sortedAsc[low] * (1 - weight) + sortedAsc[high] * weight;
};
