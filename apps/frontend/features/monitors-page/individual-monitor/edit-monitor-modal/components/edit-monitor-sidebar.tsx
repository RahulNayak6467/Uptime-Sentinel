import { ShieldCheck } from "lucide-react";
import { editMonitorTabs } from "../constants";
import type { EditMonitorTabKey } from "../types";

export const EditMonitorSidebar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: EditMonitorTabKey;
  onTabChange: (tab: EditMonitorTabKey) => void;
}) => {
  const activeIndex = editMonitorTabs.findIndex((tab) => tab.key === activeTab);

  return (
    <aside className="border-b border-sf-border bg-sf-bg/25 p-3 lg:border-b-0 lg:border-r">
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:block lg:space-y-1 [&::-webkit-scrollbar]:hidden">
        {editMonitorTabs.map((tab, index) => {
          const Icon = tab.icon;
          const active = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex h-10 min-w-max cursor-pointer items-center gap-2 rounded-md px-3 text-left text-[13px] font-semibold transition-colors lg:w-full ${
                active
                  ? "bg-sf-surface text-sf-text shadow-sm ring-1 ring-sf-border"
                  : "text-sf-text-muted hover:bg-sf-surface/70 hover:text-sf-text"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
              {index > activeIndex && (
                <span className="ml-auto hidden rounded-full bg-sf-border-faint px-1.5 py-0.5 text-[10px] text-sf-text-muted lg:inline">
                  V7
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 hidden rounded-md border border-sf-border bg-sf-surface p-3 lg:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-sf-text">
          <ShieldCheck className="size-4 text-sf-blue" />
          Safe edit mode
        </div>
        <p className="mt-2 text-xs leading-5 text-sf-text-muted">
          Primary monitor type stays locked. HTTP, SSL, and DNS rules can be
          adjusted without changing historical check meaning.
        </p>
      </div>
    </aside>
  );
};

