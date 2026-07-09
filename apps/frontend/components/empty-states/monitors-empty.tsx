import Link from "next/link";
import { Activity, Plus } from "lucide-react";

interface MonitorsEmptyProps {
  isFiltered?: boolean;
  onClearFilter?: () => void;
}

const MonitorsEmpty = ({
  isFiltered = false,
  onClearFilter,
}: MonitorsEmptyProps) => {
  return (
    <div className="w-full rounded-xl border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-sf-border bg-sf-bg">
          <Activity className="size-5 text-sf-blue" aria-hidden="true" />
        </div>

        <h2 className="text-sm font-semibold text-sf-text">
          {isFiltered ? "No monitors match this filter" : "No monitors yet"}
        </h2>
        <p className="mt-1.5 max-w-sm text-xs leading-5 text-sf-text-muted">
          {isFiltered
            ? "Try another status filter to find the monitor you're looking for."
            : "Create your first monitor to start tracking uptime, response times, and incidents."}
        </p>

        {isFiltered && onClearFilter ? (
          <button
            type="button"
            onClick={onClearFilter}
            className="mt-5 rounded-lg border border-sf-border px-4 py-2 text-xs font-semibold text-sf-text transition-colors hover:bg-sf-bg"
          >
            View all monitors
          </button>
        ) : (
          <Link
            href="/dashboard/newmonitor"
            className="mt-5 flex items-center gap-1.5 rounded-lg bg-sf-text px-4 py-2 text-xs font-semibold text-sf-btn-text transition-colors hover:bg-sf-btn-hover active:bg-sf-btn-active"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Create monitor
          </Link>
        )}
      </div>
    </div>
  );
};

export default MonitorsEmpty;
