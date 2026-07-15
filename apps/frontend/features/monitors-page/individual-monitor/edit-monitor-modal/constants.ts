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
