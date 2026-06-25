import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ----- Header -----

export const HeaderSkeleton = () => (
  <header
    role="status"
    aria-busy="true"
    className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface"
  >
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3 w-20" />
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-2 rounded-full" />
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-8 w-24 rounded-sf" />
      ))}
    </div>
  </header>
);

export const HeaderError = ({ onRetry }: { onRetry?: () => void }) => (
  <header
    role="alert"
    className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface"
  >
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-sf-red" aria-hidden="true" />
      <p className="text-[13px] font-semibold text-sf-text">
        Couldn&apos;t load monitor details
      </p>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="text-[12px] font-semibold text-sf-text underline underline-offset-2 hover:text-sf-text-muted"
      >
        Retry
      </button>
    )}
  </header>
);

// ----- Operational strip -----

export const OperationalSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    className="border border-sf-border bg-sf-surface mt-6 rounded-sf"
  >
    <div className="px-4 py-2 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex gap-8 items-center">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const OperationalError = ({ onRetry }: { onRetry?: () => void }) => (
  <div
    role="alert"
    className="border border-sf-border bg-sf-surface mt-6 rounded-sf px-4 py-3 flex items-center justify-between"
  >
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 text-sf-red" aria-hidden="true" />
      <p className="text-[13px] font-semibold text-sf-text">
        Couldn&apos;t load monitor info
      </p>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="text-[12px] font-semibold text-sf-text underline underline-offset-2 hover:text-sf-text-muted"
      >
        Retry
      </button>
    )}
  </div>
);
