"use client";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const OverviewHeaders = () => {
  const router = useRouter();
  return (
    <header className="sf-page-header">
      <div>
        <h1 className="sf-page-title">Overview</h1>
        <p className="sf-page-subtitle">Monitor health and recent activity at a glance</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex cursor-pointer items-center gap-1 rounded-sf-sm border border-sf-border px-4 py-1.5 font-sans text-[13px] font-semibold text-sf-text transition-colors hover:border-sf-blue hover:bg-sf-blue-bg hover:text-sf-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25">
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
        <button
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_API_URL}/dashboard/newmonitor`,
            )
          }
          className="flex cursor-pointer items-center gap-1.5 rounded-sf-sm bg-sf-text px-4 py-1.5 font-sans text-[13px] font-semibold text-sf-btn-text transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
        >
          <span>+</span>
          <span>New Monitor</span>
        </button>
      </div>
    </header>
  );
};

export default OverviewHeaders;
