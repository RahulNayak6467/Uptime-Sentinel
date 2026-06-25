"use client";

import { useState } from "react";
import { ResponseTimeTrend } from "./monitor-info-stats";

const RANGES = ["1h", "24h", "7d", "30d"] as const;
const REGIONS = ["Global", "US", "EU", "Asia"] as const;

const IndividualMonitorCharts = () => {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1h");

  return (
    <div className="bg-sf-surface border border-sf-border mt-6 px-4 pt-4 pb-8 rounded-sf">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[14px] font-semibold font-sans text-sf-text">
            Response Time
          </p>
          <p className="text-[12px] font-semibold font-sans text-sf-text-muted">
            p50 (solid) vs p95 (dashed) · last {range}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex bg-sf-surface border border-sf-border rounded-sf overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setRange(r)
                }
                className={`px-4 py-1 text-[12px] font-sans font-semibold border-r border-sf-border last:border-r-0 transition-colors cursor-pointer ${
                  range === r
                    ? "bg-sf-text text-sf-btn-text"
                    : "text-sf-text-muted hover:text-sf-text hover:bg-sf-bg"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold font-sans px-1.5 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
              Soon
            </span>
            <div className="flex bg-sf-surface border border-sf-border rounded-sf overflow-hidden opacity-50 cursor-not-allowed">
              {REGIONS.map((region) => (
                <span
                  key={region}
                  className="px-3 py-1 text-[12px] font-sans font-semibold border-r border-sf-border last:border-r-0 text-sf-text-muted select-none"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <ResponseTimeTrend  currentRange={range}/>
      </div>
      <div className="flex gap-2 items-center mt-4">
        <div className="flex gap-1 items-center">
          <span
            style={{ backgroundColor: "var(--color-sf-green)" }}
            className="w-8 h-1 rounded-xs"
          ></span>
          <p className="text-[12px] text-sf-text-muted font-sans font-semibold">
            p50
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <span
            style={{ backgroundColor: "var(--color-sf-amber)" }}
            className="w-8 h-1 rounded-xs"
          ></span>
          <p className="text-[12px] text-sf-text-muted font-sans font-semibold">
            p95
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualMonitorCharts;
