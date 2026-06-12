export const formatDuration = (startedAt: Date, resolvedAt: Date): string => {
  const durationMs = resolvedAt.getTime() - startedAt.getTime();
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0 && minutes === 0) return "less than a minute";
  if (hours === 0) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  if (remainingMinutes === 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
};

export const getMinutesDifference = (startTime: Date | string): number => {
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const diffInMilliseconds = Date.now() - start.getTime();
  return diffInMilliseconds / (1000 * 60);
};
