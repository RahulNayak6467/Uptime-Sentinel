"use client";
import { RefreshCw, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const MonitorsHeader = () => {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
      <h1 className="text-[16px] font-bold text-sf-text">Monitors</h1>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-lg hover:bg-sf-bg transition-colors cursor-pointer">
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
        <button
          onClick={() =>
            router.push(
              `${process.env.NEXT_PUBLIC_API_URL}/dashboard/newmonitor`,
            )
          }
          className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-sf-btn-text bg-sf-text rounded-lg hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          New Monitor
        </button>
      </div>
    </header>
  );
};

export default MonitorsHeader;
