"use client";
import { Activity, RefreshCw, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import ConnectionStatus from "@/components/sse/connection-status";

const OverviewHeaders = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching() > 0;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardOverview"] });
    queryClient.invalidateQueries({ queryKey: ["all monitors overview data"] });
    queryClient.invalidateQueries({ queryKey: ["incidents page stats card"] });
    queryClient.invalidateQueries({ queryKey: ["incidents data timeline"] });
  };

  return (
    <header className="flex min-h-[88px] items-center justify-between gap-6 border-b border-sf-border bg-sf-surface/85 px-6 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-sf-border-faint bg-sf-bg text-sf-blue shadow-sm sm:flex">
          <Activity className="size-[18px]" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-sf-tight text-sf-text">
              Operational overview
            </h1>
            <ConnectionStatus className="hidden md:inline-flex" />
          </div>
          <p className="mt-1 truncate text-xs text-sf-text-muted">
            Real-time health, performance, and incident activity
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={refresh}
          disabled={isFetching}
          aria-label="Refresh dashboard data"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-sf-border bg-sf-surface text-sf-text-sub shadow-sm transition-all hover:-translate-y-px hover:border-sf-text-muted/50 hover:text-sf-text hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25 disabled:cursor-default disabled:opacity-70"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span className="sr-only">Refresh</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/newmonitor")}
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-all hover:-translate-y-px hover:bg-sf-blue hover:text-white hover:shadow-md active:translate-y-0 active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>New Monitor</span>
        </button>
      </div>
    </header>
  );
};

export default OverviewHeaders;
