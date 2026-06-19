import { ArrowLeft } from "lucide-react";

const NewMonitorHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 text-sf-text-muted hover:text-sf-text-sub transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sf-label font-sans">Monitors</span>
        </button>
        <h1 className="text-[16px] font-bold text-sf-text font-sans">
          New monitor
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-1.5 text-sf-label font-semibold font-sans text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          Cancel
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-sf-label font-semibold font-sans text-white bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer">
          <span>+</span>
          <span>Create monitor</span>
        </button>
      </div>
    </header>
  );
};

export default NewMonitorHeader;
