// Returns the time remaining until a scheduled timestamp (e.g. a monitor's
// next_check_at) in the largest sensible unit (s / min / hr / d). `target` is
// the future time; `from` defaults to now. Once `target` has passed, the check
// is overdue and we return "Due now" instead of a clamped 0. Invalid input
// returns "—". All args accept a Date, an ISO string, or epoch millis.
export const formatTimeUntil = (
  target: Date | string | number,
  from: Date | string | number = Date.now(),
): string => {
  const targetMs = new Date(target).getTime();
  const fromMs = new Date(from).getTime();

  if (Number.isNaN(targetMs) || Number.isNaN(fromMs)) return "—";

  const seconds = Math.floor((targetMs - fromMs) / 1000);
  if (seconds <= 0) return "Due now";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}hr`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};
