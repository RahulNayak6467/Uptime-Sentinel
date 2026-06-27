import { Skeleton } from "@/components/ui/skeleton";

const RecentAlertsSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="w-full bg-sf-surface border border-sf-border rounded-lg mt-6"
    >
      <span className="sr-only">Loading recent alert emails</span>

      <div className="py-3 px-4 border-b border-sf-border flex items-start justify-between">
        <div>
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Recent alert emails
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">Last 7 days</p>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="px-4">
        <div className="grid grid-cols-[120px_1fr_120px_80px_100px] gap-4 py-2.5 border-b border-sf-border">
          {["Event", "Subject", "Recipients", "Sent", "Delivery"].map((col) => (
            <span
              key={col}
              className="text-[11px] font-semibold font-sans text-sf-text-muted uppercase tracking-widest"
            >
              {col}
            </span>
          ))}
        </div>

        <div className="divide-y divide-sf-border">
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[120px_1fr_120px_80px_100px] gap-4 py-3 items-center"
            >
              <Skeleton className="h-5 w-16 rounded-full" />

              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="h-3.5 w-40 max-w-full" />
                </div>
                <Skeleton className="h-3 w-24 ml-3.5" />
              </div>

              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentAlertsSkeleton;
