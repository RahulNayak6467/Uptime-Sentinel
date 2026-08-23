import type { DashboardOverviewResponse } from "@/features/Overview/types";
import { Activity, CircleCheck, CirclePause, TriangleAlert } from "lucide-react";

type MonitorSummaryProps = {
  data?: DashboardOverviewResponse;
  isLoading: boolean;
};

const SUMMARY_ITEMS = [
  {
    key: "total_monitors",
    label: "Total monitors",
    context: "Configured endpoints",
    icon: Activity,
    color: "var(--color-sf-text)",
  },
  {
    key: "up_count",
    label: "Up",
    context: "Passing their latest check",
    icon: CircleCheck,
    color: "var(--color-sf-green)",
  },
  {
    key: "down_count",
    label: "Down",
    context: "Need your attention",
    icon: TriangleAlert,
    color: "var(--color-sf-red)",
  },
  {
    key: "paused_monitors",
    label: "Paused",
    context: "Checks currently stopped",
    icon: CirclePause,
    color: "var(--color-sf-text-muted)",
  },
] as const;

const MonitorSummary = ({ data, isLoading }: MonitorSummaryProps) => {
  return (
    <section aria-labelledby="monitor-summary-title">
      <div className="mb-2.5 flex items-end justify-between gap-4">
        <h2
          id="monitor-summary-title"
          className="text-[13px] font-semibold text-sf-text"
        >
          Monitor summary
        </h2>
        <p className="hidden text-[11px] text-sf-text-muted sm:block">
          Current fleet status
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SUMMARY_ITEMS.map(({ key, label, context, icon: Icon, color }) => (
          <article
            key={key}
            className="flex min-h-[104px] flex-col justify-between rounded-[8px] border border-sf-border bg-sf-surface p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-sf-text-muted">{label}</p>
              <span className="flex size-7 items-center justify-center rounded-[5px] border border-sf-border-faint bg-sf-bg text-sf-text-muted">
                <Icon className="size-3.5" strokeWidth={1.8} />
              </span>
            </div>
            <div className="mt-2">
              {isLoading ? (
                <div
                  aria-hidden="true"
                  className="h-6 w-10 animate-pulse rounded-[3px] bg-sf-border-faint"
                />
              ) : (
                <p
                  className="text-[24px] font-semibold leading-none tracking-sf-tight tabular-nums"
                  style={{ color }}
                >
                  {data?.[key] ?? "—"}
                </p>
              )}
              <p className="mt-1.5 text-[10px] text-sf-text-muted">
                {context}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MonitorSummary;
