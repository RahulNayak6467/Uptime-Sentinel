import { Skeleton } from "@/components/ui/skeleton";

const IncidentListSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="w-full"
    >
      <span className="sr-only">Loading incidents</span>

      <div className="mb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-72" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-sf-border bg-sf-surface px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-48 max-w-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-2 h-3 w-64 max-w-full" />
              </div>

              <Skeleton className="mt-1 size-4 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-sf-border px-1 py-3">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-7 w-7 rounded-sf" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IncidentListSkeleton;
