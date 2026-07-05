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
    <div className="flex items-center gap-1 rounded-lg border border-sf-border bg-sf-surface p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        const count = counts?.[key];

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange?.(key)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-sf-sm border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              isActive
                ? "border-sf-blue/30 bg-sf-blue-bg text-sf-blue"
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
