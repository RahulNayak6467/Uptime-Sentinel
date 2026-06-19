import { RefreshCw } from "lucide-react";

const OverviewHeaders = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <h1 className="text-[16px] font-bold text-sf-text font-sans">
        Dashboard Overview
      </h1>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-4 py-1.5 text-[13px] font-semibold font-sans text-sf-text border border-sf-border rounded-lg hover:bg-sf-bg transition-colors cursor-pointer">
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold font-sans text-sf-btn-text bg-sf-text rounded-lg hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer">
          <span>+</span>
          <span>New Monitor</span>
        </button>
      </div>
    </header>
  );
};

export default OverviewHeaders;
