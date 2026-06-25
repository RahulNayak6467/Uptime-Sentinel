// Returns the elapsed time between two timestamps in the largest sensible unit
// (s / min / hr / d). `from` is the earlier time (e.g. a Postgres timestamp),
// `to` defaults to now. Both accept a Date, an ISO string, or epoch millis.
export const formatTimeAgo = (
  from: Date | string | number,
  to: Date | string | number = Date.now(),
): string => {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();

  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) return "—";

  const seconds = Math.max(0, Math.floor((fromMs - toMs) / 1000));
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}hr`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};
