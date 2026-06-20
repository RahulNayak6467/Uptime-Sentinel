import { ChevronLeft, Edit, Pause, RefreshCw } from "lucide-react";
import Link from "next/link";

const IndividualMonitorsHeaders = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <div className="flex flex-col gap-1.5 min-w-0">
        <Link
          href="/dashboard/monitors"
          className="flex items-center gap-1 w-fit text-[12px] font-sans font-medium text-sf-text-muted hover:text-sf-text transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Monitors
        </Link>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-sf-green shrink-0 shadow-[0_0_0_3px_var(--color-sf-green-bg)]" />
          <h1 className="text-[16px] font-bold text-sf-text truncate">
            StatusForge API
          </h1>
          <span className="text-[11px] font-semibold font-sans text-sf-green border border-sf-green/30 bg-sf-green-bg rounded-md px-2 py-0.5 shrink-0">
            Operational
          </span>
          <a className="hidden sm:block text-[12px] font-mono text-sf-text-muted truncate cursor-pointer hover:text-sf-text-sub transition-colors">
            statusforge.io
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          <Pause className="w-3.5 h-3.5" />
          Pause
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
    </header>
  );
};

export default IndividualMonitorsHeaders;
