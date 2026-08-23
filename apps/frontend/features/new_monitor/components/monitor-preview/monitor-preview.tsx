import { Activity, Info } from "lucide-react";

interface MonitorPreviewProps {
  monitorName?: string;
  url?: string;
  type: string;
  interval: string;
  method: string;
  statusCodes?: number[];
}

const checksPerDay = (interval: string): string => {
  const match = interval.match(/^(\d+)(s|m|h)$/);
  if (!match) return "—";
  const amount = Number(match[1]);
  const unitSeconds = match[2] === "s" ? 1 : match[2] === "m" ? 60 : 3600;
  return Math.round(86400 / (amount * unitSeconds)).toLocaleString();
};

const MonitorPreview = ({
  monitorName,
  url,
  type,
  interval,
  method,
  statusCodes,
}: MonitorPreviewProps) => {
  const hasName = Boolean(monitorName?.trim());
  const hasUrl = Boolean(url?.trim());
  const statusDisplay = statusCodes?.length ? statusCodes.join(", ") : "200";
  const perDay = checksPerDay(interval);

  return (
    <div className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex flex-col gap-2 border-b border-sf-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Activity className="size-3.5 text-sf-blue" />
          <span className="text-xs font-semibold text-sf-text">Configuration preview</span>
        </div>
        <span className={`rounded-sf border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${hasName && hasUrl ? "border-sf-green-border bg-sf-green-bg text-sf-green" : "border-sf-border bg-sf-bg text-sf-text-muted"}`}>
          {hasName && hasUrl ? "Ready" : "Draft"}
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-3 border-b border-sf-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sf-border" />
            <div className="min-w-0">
              <span
                className={`block truncate font-sans text-[14px] font-semibold ${
                  hasName ? "text-sf-text" : "text-sf-text-muted"
                }`}
              >
                {hasName ? monitorName : "Unnamed monitor"}
              </span>
              <span
                className={`mt-1 block truncate font-mono text-xs ${
                  hasUrl ? "text-sf-text-sub" : "text-sf-text-muted"
                }`}
              >
                {hasUrl ? url : "https://example.com/health"}
              </span>
            </div>
          </div>
          <span className="w-fit shrink-0 rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 font-mono text-xs font-medium text-sf-text-sub">
            {type}
          </span>
        </div>

        <dl className="divide-y divide-sf-border px-4">
          {[
            { label: "Interval", value: interval },
            { label: "Method", value: method.toUpperCase() },
            { label: "Expected statuses", value: statusDisplay },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <dt className="text-xs text-sf-text-muted">
                {label}
              </dt>
              <dd className="break-all text-right font-mono text-xs font-medium text-sf-text">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex items-start gap-2 border-t border-sf-border bg-sf-bg/50 px-4 py-3">
          <Info className="w-3.5 h-3.5 text-sf-text-muted shrink-0 mt-0.5" />
          <p className="text-[12px] font-sans text-sf-text-muted leading-snug">
            Runs every <strong>{interval}</strong>, approximately{" "}
            <strong>{perDay}</strong> checks per day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonitorPreview;
