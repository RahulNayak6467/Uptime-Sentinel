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
    <div className="flex items-center gap-1 px-6 py-3 border-b border-sf-border">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        const count = counts?.[key];

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sf border text-[12px] font-medium transition-colors cursor-pointer ${
              isActive
                ? "border-sf-text-sub bg-sf-border text-sf-text"
                : "border-sf-border text-sf-text-sub hover:text-sf-text hover:border-sf-text-muted hover:bg-sf-border-faint"
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
