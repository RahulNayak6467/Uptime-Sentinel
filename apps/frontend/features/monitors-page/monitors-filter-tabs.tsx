"use client";

import { MonitorState } from "./types";

export type MonitorTab = "all" | Exclude<MonitorState, "degraded">;

const DOT_COLOR: Record<MonitorState, string> = {
  up: "var(--color-sf-green)",
  down: "var(--color-sf-red)",
  degraded: "var(--color-sf-orange)",
  paused: "var(--color-sf-text-muted)",
  unknown: "var(--color-sf-amber)",
};

const TABS: { key: MonitorTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "up", label: "Up" },
  { key: "down", label: "Down" },
  { key: "unknown", label: "Unknown" },
  { key: "paused", label: "Paused" },
];

interface Props {
  active?: MonitorTab;
  counts?: Partial<Record<MonitorTab, number>>;
  onChange?: (tab: MonitorTab) => void;
}

const MonitorsFilterTabs = ({ active, counts, onChange }: Props) => {
  return (
    <div
      role="tablist"
      aria-label="Filter monitors by status"
      className="flex w-full max-w-full items-center gap-5 overflow-x-auto border-b border-sf-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        const count = counts?.[key];

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(key)}
            className={`relative flex h-9 shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-0.5 text-[12px] font-medium transition-colors ${
              isActive
                ? "border-sf-text text-sf-text"
                : "border-transparent text-sf-text-muted hover:text-sf-text"
            }`}
          >
            {key !== "all" && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: DOT_COLOR[key] }}
              />
            )}
            {label}
            {count !== undefined && (
              <span
                className={`min-w-4 text-center font-mono text-[10px] tabular-nums ${isActive ? "text-sf-text-sub" : "text-sf-text-muted"}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MonitorsFilterTabs;
