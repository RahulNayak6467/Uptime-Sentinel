"use client";

import { MonitorState } from "./types";

export type MonitorTab = "all" | MonitorState;

const DOT_COLOR: Record<MonitorState, string> = {
  up: "var(--color-sf-green)",
  down: "var(--color-sf-red)",
  degraded: "var(--color-sf-orange)",
  paused: "var(--color-sf-blue)",
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
      className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-sf-sm border border-sf-border bg-sf-border-faint p-1"
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
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              isActive
                ? "border-sf-border bg-sf-surface text-sf-text shadow-sm"
                : "border-transparent text-sf-text-sub hover:bg-sf-bg hover:text-sf-text"
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
                className={`text-[11px] tabular-nums ${isActive ? "text-sf-text" : "text-sf-text-muted"}`}
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
