import { AlertTriangle } from "lucide-react";

type IncidentListErrorProps = {
  onRetry: () => void;
};

const IncidentListError = ({ onRetry }: IncidentListErrorProps) => {
  return (
    <section className="w-full">
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-sf-border bg-sf-surface px-5 py-12 text-center shadow-sm"
      >
        <div className="flex size-9 items-center justify-center rounded-lg border border-sf-border bg-sf-bg">
          <AlertTriangle className="size-4 text-sf-red" aria-hidden="true" />
        </div>
        <p className="text-[14px] font-semibold text-sf-text">
          Couldn&apos;t load incidents
        </p>
        <p className="text-[12px] text-sf-text-muted">
          Something went wrong while fetching your incident history.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-[4px] border border-sf-border bg-sf-bg px-3 py-1.5 text-[12px] font-semibold text-sf-text transition-colors hover:border-sf-text-muted"
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default IncidentListError;
