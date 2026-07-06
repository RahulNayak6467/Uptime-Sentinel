import { AlertTriangle } from "lucide-react";

type IncidentStatsErrorProps = {
  onRetry: () => void;
};

const IncidentStatsError = ({ onRetry }: IncidentStatsErrorProps) => {
  return (
    <div className="w-full">
      <div
        role="alert"
        className="flex min-h-24 items-center justify-between gap-4 rounded-lg border border-sf-border bg-sf-surface px-5 py-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sf-red-bg">
            <AlertTriangle
              className="size-4 text-sf-red"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-sf-text">
              Couldn&apos;t load incident statistics
            </p>
            <p className="mt-0.5 text-[12px] text-sf-text-muted">
              The latest incident metrics are temporarily unavailable.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-[4px] border border-sf-border bg-sf-bg px-3 py-1.5 text-[12px] font-semibold text-sf-text transition-colors hover:border-sf-text-muted"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default IncidentStatsError;
