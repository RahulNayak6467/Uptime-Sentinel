import { Skeleton } from "@/components/ui/skeleton";

const LoadingRegion = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">{label}</span>
    {children}
  </section>
);

const PageHeaderSkeleton = ({ actions = 2 }: { actions?: number }) => (
  <div className="flex min-h-[88px] items-center justify-between border-b border-sf-border bg-sf-surface px-6">
    <div>
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-2 h-3 w-56" />
    </div>
    <div className="flex gap-2">
      {Array.from({ length: actions }, (_, index) => (
        <Skeleton key={index} className="h-8 w-24" />
      ))}
    </div>
  </div>
);

export const MetricCardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-3 px-6 py-5 lg:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="rounded-sf border border-sf-border bg-sf-surface p-4"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="size-2.5 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-7 w-24" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
    ))}
  </div>
);

export const MonitorTableSkeleton = ({ rows = 7 }: { rows?: number }) => (
  <div className="px-6 py-4">
    <div className="overflow-hidden rounded-sf border border-sf-border bg-sf-surface">
      <div className="grid grid-cols-[40px_1.2fr_1.5fr_90px_90px_90px] gap-4 border-b border-sf-border px-4 py-3">
        <Skeleton className="size-4" />
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[40px_1.2fr_1.5fr_90px_90px_90px] items-center gap-4 border-b border-sf-border px-4 py-3 last:border-b-0"
        >
          <Skeleton className="size-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-3 w-40 max-w-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
    <div className="mt-3 flex justify-between px-1">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-8 w-44" />
      <Skeleton className="h-3 w-36" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-sf border border-sf-border bg-sf-surface p-4">
    <div className="flex items-start justify-between">
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-44" />
      </div>
      <Skeleton className="h-8 w-36" />
    </div>
    <div className="relative mt-8 h-56 overflow-hidden rounded-md border-b border-l border-sf-border-faint bg-[linear-gradient(to_right,var(--color-sf-border-faint)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-sf-border-faint)_1px,transparent_1px)] bg-[size:12.5%_25%]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-sf-text-muted/30"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 154 C55 148 76 104 128 121 S214 174 270 139 S355 74 414 102 S502 163 558 128 S650 58 704 92 S766 134 800 112"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 174 C74 160 97 139 152 151 S246 190 316 164 S421 115 482 137 S579 184 646 147 S742 104 800 125"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
);

export const OverviewLoading = () => (
  <LoadingRegion label="Loading dashboard overview">
    <div className="flex min-h-[88px] items-center justify-between border-b border-sf-border bg-sf-surface px-6">
      <div>
          <Skeleton className="h-5 w-52" />
          <Skeleton className="mt-2 h-3 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
    <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-6 pb-12">
      <div className="rounded-lg border border-sf-border bg-sf-surface p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-7 w-64" />
            <Skeleton className="mt-3 h-3 w-52" />
          </div>
          <div className="hidden grid-cols-3 gap-2 sm:grid">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-[62px] w-24 rounded-lg" />
            ))}
          </div>
        </div>
        <Skeleton className="mt-8 h-2 w-full rounded-full" />
      </div>
      <div className="-mx-6">
        <MetricCardsSkeleton />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(390px,0.9fr)]">
        <ChartSkeleton />
        <div className="rounded-xl border border-sf-border bg-sf-surface p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-64" />
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="mt-5 h-[18px] w-full" />
          ))}
        </div>
      </div>
      <div className="-mx-6">
        <MonitorTableSkeleton rows={5} />
      </div>
    </div>
  </LoadingRegion>
);

export const MonitorsLoading = () => (
  <LoadingRegion label="Loading monitors">
    <div className="flex min-h-[88px] items-center justify-between border-b border-sf-border bg-sf-surface px-6">
      <div>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-3 w-72" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="flex w-fit gap-1 rounded-sf-sm border border-sf-border bg-sf-border-faint p-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-7 w-16 rounded-[4px]" />
        ))}
      </div>
      <div className="-mx-6 mt-5">
        <MonitorTableSkeleton />
      </div>
    </div>
  </LoadingRegion>
);

export const MonitorDetailsLoading = () => (
  <LoadingRegion label="Loading monitor details">
    <div className="flex min-h-[88px] items-center justify-between border-b border-sf-border bg-sf-surface px-6">
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-5 w-52" />
      </div>
      <Skeleton className="h-9 w-32 rounded-lg" />
    </div>
    <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-6 pb-12">
      <div className="rounded-lg border border-sf-border bg-sf-surface p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-2 h-3 w-72" />
          </div>
          <Skeleton className="h-10 w-60" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-lg border border-sf-border bg-sf-surface p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-20" />
          </div>
        ))}
      </div>
      <ChartSkeleton />
      <div className="rounded-lg border border-sf-border bg-sf-surface p-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-2 h-3 w-64" />
        <Skeleton className="mt-5 h-9 w-full" />
      </div>
    </div>
  </LoadingRegion>
);

export const IncidentsLoading = () => (
  <LoadingRegion label="Loading incidents">
    <div className="flex min-h-[88px] items-center border-b border-sf-border bg-sf-surface px-6">
      <div>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-3 w-72" />
      </div>
    </div>
    <div className="mx-auto w-full max-w-7xl space-y-7 px-6 py-6 pb-12">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-72" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-lg border border-sf-border bg-sf-surface p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-80" />
        <div className="mt-3 flex flex-col gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-lg border border-sf-border bg-sf-surface px-5 py-4"
        >
          <Skeleton className="mt-1 size-2.5 rounded-full" />
          <div className="flex-1">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            <Skeleton className="mt-2 h-3 w-96 max-w-full" />
          </div>
        </div>
      ))}
        </div>
      </div>
    </div>
  </LoadingRegion>
);

export const EmailAlertsLoading = () => (
  <LoadingRegion label="Loading email alert settings">
    <PageHeaderSkeleton actions={1} />
    <div className="sf-page-content pb-12">
      <Skeleton className="h-9 w-72 rounded-sf-sm" />
      <div className="mt-4 rounded-lg border border-sf-border bg-sf-surface p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-10 w-full" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-sf border border-sf-border bg-sf-surface p-5"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-2 h-3 w-56 max-w-full" />
            {Array.from({ length: 3 }, (_, row) => (
              <div key={row} className="mt-4 flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </LoadingRegion>
);

export const NewMonitorLoading = () => (
  <LoadingRegion label="Loading new monitor form">
    <div className="flex min-h-[88px] items-center justify-between border-b border-sf-border bg-sf-surface px-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-3 w-56" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <Skeleton className="h-4 w-44" />
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-sf-border bg-sf-surface p-5"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-fit rounded-lg border border-sf-border bg-sf-surface p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-6 h-5 w-40" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-6 h-24 w-full" />
      </div>
    </div>
  </LoadingRegion>
);
