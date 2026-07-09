import { AlertTriangle } from "lucide-react";

type PageErrorProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

const PageError = ({
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again.",
  onRetry,
  retryLabel = "Retry",
}: PageErrorProps) => {
  return (
    <div
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-full border border-sf-border bg-sf-surface">
        <AlertTriangle className="size-7 text-sf-red" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-semibold text-sf-text">{title}</h2>
        <p className="max-w-md text-[13px] text-sf-text-muted">{description}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-[4px] border border-sf-border bg-sf-surface px-4 py-2 text-[13px] font-semibold text-sf-text transition-colors hover:border-sf-text-muted"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default PageError;
