import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const IncidentHistorySkeleton = () => (
  <section
    id="incidents"
    role="status"
    aria-live="polite"
    aria-busy="true"
    className="sf-panel scroll-mt-16 p-5 pb-6 shadow-sm"
  >
    <span className="sr-only">Loading incident history</span>

    <div className="flex items-start justify-between gap-4">
      <div>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-3 w-56" />
      </div>
      <Skeleton className="h-5 w-16 rounded-sf" />
    </div>

    <div className="mt-3 flex gap-3">
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-16" />
    </div>

    <div className="mt-4 overflow-hidden rounded-lg border border-sf-border bg-sf-surface">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={`grid gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${
            index > 0 ? "border-t border-sf-border" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-5 w-16 rounded-sf" />
            </div>
            <Skeleton className="mt-2 h-3 w-72 max-w-full" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const IncidentHistoryError = ({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) => (
  <section
    id="incidents"
    className="sf-panel scroll-mt-16 p-5 pb-6 shadow-sm"
  >
    <div>
      <h3 className="text-base font-semibold tracking-tight text-sf-text">
        Incident history
      </h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Outages and recoveries for this endpoint
      </p>
    </div>

    <div
      role="alert"
      className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-lg border border-sf-border bg-sf-surface px-6 py-10 text-center"
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-sf-red-border bg-sf-red-bg text-sf-red">
        <AlertTriangle className="size-[18px]" aria-hidden="true" />
      </span>
      <h4 className="mt-4 text-sm font-semibold text-sf-text">
        Couldn&apos;t load incident history
      </h4>
      <p className="mt-1.5 max-w-sm text-xs leading-5 text-sf-text-muted">
        The incident data could not be fetched. Check your connection and try
        again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-4 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-sf-border bg-sf-bg px-3 text-xs font-semibold text-sf-text transition-colors hover:border-sf-text-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </div>
  </section>
);

export const IncidentHistoryEmpty = () => (
  <div className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-sf-border bg-sf-bg/30 px-6 py-10 text-center">
    <span className="flex size-10 items-center justify-center rounded-lg border border-sf-green-border bg-sf-green-bg text-sf-green">
      <CheckCircle2 className="size-[18px]" aria-hidden="true" />
    </span>
    <h4 className="mt-4 text-sm font-semibold text-sf-text">
      No incidents recorded
    </h4>
    <p className="mt-1.5 max-w-sm text-xs leading-5 text-sf-text-muted">
      Outages and recovery events will appear here when this monitor changes
      state.
    </p>
  </div>
);
