"use client";
import { RefreshCw, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const MonitorsHeader = () => {
  const router = useRouter();
  return (
    <header className="flex min-h-[88px] items-center justify-between gap-6 border-b border-sf-border bg-sf-surface px-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-sf-tight text-sf-text">
          Monitors
        </h1>
        <p className="mt-1 truncate text-xs text-sf-text-muted">
          Manage endpoints and review their current health
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-sf-border bg-sf-surface text-sf-text-sub shadow-sm transition-all hover:border-sf-text-muted/50 hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25">
          <RefreshCw className="size-3.5" />
          <span className="sr-only">Refresh monitors</span>
        </button>
        <button
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_API_URL}/dashboard/newmonitor`,
            )
          }
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-sf-text px-4 text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          New Monitor
        </button>
      </div>
    </header>
  );
};

export default MonitorsHeader;
