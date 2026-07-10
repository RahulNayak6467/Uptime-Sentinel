"use client";
import { RefreshCw, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const MonitorsHeader = ({
  onRefresh,
  isRefreshing,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
}) => {
  const router = useRouter();
  return (
    <header className="sf-page-header">
      <div className="min-w-0">
        <h1 className="sf-page-title">Monitors</h1>
        <p className="sf-page-subtitle truncate">
          Manage endpoints and review their current health
        </p>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-sf-border bg-sf-surface text-sf-text-sub shadow-sm transition-colors hover:border-sf-text-muted/50 hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25 disabled:cursor-default disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh monitors</span>
        </button>
        <button
          onClick={() => router.push("/dashboard/newmonitor")}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-4 text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 sm:flex-none"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          New Monitor
        </button>
      </div>
    </header>
  );
};

export default MonitorsHeader;
