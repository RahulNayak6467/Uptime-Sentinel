import { formatDurationMinutes } from "./format-duration-minutes";

// Duration line for an incident card:
//   resolved_at null  -> elapsed since started_at, e.g. "8 min (ongoing)"
//   resolved_at set   -> started_at → resolved_at, e.g. "lasted 47 min"
// "lasted" disambiguates duration from recency — a bare "8 min" next to the
// date reads like "8 min ago".
// Invalid started_at, or a resolved_at earlier than started_at, returns "—".
// For ongoing incidents a start a few seconds in the future (clock skew
// between server and browser) is clamped to 0 instead of erroring.
export const formatIncidentDuration = (
  startedAt: Date | string | number,
  resolvedAt: Date | string | number | null,
): string => {
  const startMs = new Date(startedAt).getTime();
  if (Number.isNaN(startMs)) return "—";

  const isOngoing = resolvedAt === null;
  const endMs = isOngoing ? Date.now() : new Date(resolvedAt).getTime();
  if (Number.isNaN(endMs)) return "—";

  let minutes = (endMs - startMs) / 60000;
  if (isOngoing) minutes = Math.max(minutes, 0);

  const base = formatDurationMinutes(minutes);
  if (base === "—") return "—";

  return isOngoing ? `${base} (ongoing)` : `lasted ${base}`;
};
