"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { MonitorPageData, MonitorState } from "./types";

type Tab = "all" | MonitorState;

interface Props {
  data: MonitorPageData[];
  active: Tab;
  onChange: (tab: Tab) => void;
}

const DOT_COLOR: Record<MonitorState, string> = {
  up: "var(--color-sf-green)",
  down: "var(--color-sf-red)",
  degraded: "var(--color-sf-amber)",
  paused: "var(--color-sf-text-muted)",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "up", label: "Up" },
  { key: "down", label: "Down" },
  { key: "degraded", label: "Degraded" },
  { key: "paused", label: "Paused" },
];

const MonitorsFilterTabs = ({ data, active, onChange }: Props) => {
  const count = (tab: Tab) =>
    tab === "all" ? data.length : data.filter((d) => d.state === tab).length;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-sf-border">
      {/* State filter tabs */}
      <div className="flex items-center gap-1">
        {TABS.map(({ key, label }) => {
          const isActive = active === key;
          const n = count(key);
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sf border text-[12px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? "border-sf-text-sub bg-sf-border text-sf-text"
                  : "border-sf-border text-sf-text-sub hover:text-sf-text hover:border-sf-text-muted hover:bg-sf-border-faint"
              }`}
            >
              {key !== "all" && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: DOT_COLOR[key as MonitorState] }}
                />
              )}
              {label}
              <span
                className={`text-[11px] tabular-nums ${isActive ? "text-sf-text" : "text-sf-text-muted"}`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-sf-border rounded-sf bg-sf-surface text-sf-text-muted">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search monitors"
            className="text-[13px] bg-transparent outline-none placeholder:text-sf-text-muted text-sf-text w-44"
            disabled
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>
    </div>
  );
};

export default MonitorsFilterTabs;
