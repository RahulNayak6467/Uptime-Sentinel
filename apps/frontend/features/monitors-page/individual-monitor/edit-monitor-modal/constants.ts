export const formInputClass =
  "h-9 w-full rounded-md border border-sf-border bg-sf-surface px-3 text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:shadow-sf-focus";

export const secondaryButtonClass =
  "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-sf-border bg-sf-surface px-4 text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg";

export const editMonitorIntervals = [
  { label: "30s", value: "30s", seconds: 30 },
  { label: "1m", value: "1m", seconds: 60 },
  { label: "2m", value: "2m", seconds: 120 },
  { label: "5m", value: "5m", seconds: 300 },
  { label: "10m", value: "10m", seconds: 600 },
  { label: "30m", value: "30m", seconds: 1800 },
  { label: "1h", value: "1h", seconds: 3600 },
] as const;

// Slow-lane intervals for TLS monitors (hours-scale).
export const editTlsIntervals = [
  { label: "1h", value: "1h", seconds: 3600 },
  { label: "3h", value: "3h", seconds: 10800 },
  { label: "6h", value: "6h", seconds: 21600 },
  { label: "12h", value: "12h", seconds: 43200 },
  { label: "24h", value: "24h", seconds: 86400 },
] as const;
