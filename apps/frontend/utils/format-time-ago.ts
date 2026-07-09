// Returns how long ago a past timestamp occurred (e.g. when an email was sent)
// in the largest sensible unit (s / min / hr / d). `past` is the earlier time;
// `from` defaults to now. A future timestamp returns "just now", and invalid
// input returns "—". All args accept a Date, an ISO string, or epoch millis.
export const formatTimeAgo = (
  past: Date | string | number,
  from: Date | string | number = Date.now(),
): string => {
  const pastMs = new Date(past).getTime();
  const fromMs = new Date(from).getTime();

  if (Number.isNaN(pastMs) || Number.isNaN(fromMs)) return "—";

  const seconds = Math.floor((fromMs - pastMs) / 1000);
  if (seconds <= 0) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}hr ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
