"use client";
import { RefreshCw, Plus } from "lucide-react";
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
    <header className="sf-page-header bg-sf-surface/85 backdrop-blur-xl">
      <div className="flex min-w-0 items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="sf-page-title">
              Operational overview
            </h1>
            <ConnectionStatus className="hidden md:inline-flex" />
          </div>
          <p className="sf-page-subtitle truncate">
            Real-time health, performance, and incident activity
          </p>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          onClick={refresh}
          disabled={isFetching}
          aria-label="Refresh dashboard data"
          className="flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-sf-border bg-sf-surface text-sf-text-sub shadow-sm transition-all hover:-translate-y-px hover:border-sf-text-muted/50 hover:text-sf-text hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25 disabled:cursor-default disabled:opacity-70"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          <span className="sr-only">Refresh</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/newmonitor")}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-all hover:-translate-y-px hover:bg-sf-blue hover:text-white hover:shadow-md active:translate-y-0 active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 sm:flex-none"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          <span>New Monitor</span>
        </button>
      </div>
    </header>
  );
};

export default OverviewHeaders;
