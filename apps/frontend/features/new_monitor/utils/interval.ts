import { checkIntervalsTypeProps } from "../types";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;

export const intervalToSeconds = (
  interval: checkIntervalsTypeProps,
): number => {
  const value = Number.parseInt(interval, 10);
  const unit = interval.at(-1);

  if (unit === "s") {
    return value;
  }

  if (unit === "m") {
    return value * SECONDS_PER_MINUTE;
  }

  return value * SECONDS_PER_HOUR;
};
