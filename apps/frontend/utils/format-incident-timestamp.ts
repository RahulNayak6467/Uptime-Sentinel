// Formats a timestamp into the display parts used by the incidents page:
//   date     -> "Jun 15"
//   time     -> "17:05"
//   dateTime -> "Jun 15, 2026 at 17:05"
// Accepts a Date, an ISO string (what postgres timestamps arrive as over
// JSON), or epoch millis. Invalid input returns "—" for every part. Uses a
// fixed en-US locale so the "Jun 15" order doesn't flip in other locales.
export type IncidentTimestampParts = {
  date: string;
  time: string;
  dateTime: string;
};

export const formatIncidentTimestamp = (
  value: Date | string | number,
): IncidentTimestampParts => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "—", time: "—", dateTime: "—" };
  }

  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);

  // hourCycle (not hour12: false) guarantees midnight renders as "00:05",
  // never "24:05" — hour12: false leaves that choice to the JS engine.
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(parsed);

  const year = parsed.getFullYear();

  return {
    date,
    time,
    dateTime: `${date}, ${year} at ${time}`,
  };
};
