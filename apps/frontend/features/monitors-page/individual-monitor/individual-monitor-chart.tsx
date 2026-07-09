"use client";

import { useState } from "react";
import { ResponseTimeTrend } from "./monitor-info-stats";

const RANGES = ["1h", "24h", "7d", "30d"] as const;
const REGIONS = ["Global", "US", "EU", "Asia"] as const;

const IndividualMonitorCharts = () => {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1h");

  return (
    <section id="response-time" className="scroll-mt-16 overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-sf-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[14px] font-semibold text-sf-text">
            Response time
          </p>
          <p className="mt-1 font-sans text-xs text-sf-text-muted">
            p50 (solid) vs p95 (dashed) · last {range}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex overflow-hidden rounded-sf-sm border border-sf-border bg-sf-border-faint p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setRange(r)
                }
                className={`cursor-pointer rounded-[4px] px-3 py-1 text-xs font-semibold transition-colors ${
                  range === r
                    ? "bg-sf-surface text-sf-text shadow-sm"
                    : "text-sf-text-muted hover:text-sf-text"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-sf bg-sf-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
              Soon
            </span>
            <div className="flex cursor-not-allowed overflow-hidden rounded-sf border border-sf-border bg-sf-surface opacity-50">
              {REGIONS.map((region) => (
                <span
                  key={region}
                  className="select-none border-r border-sf-border px-3 py-1 text-xs font-semibold text-sf-text-muted last:border-r-0"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pt-4">
        <ResponseTimeTrend  currentRange={range}/>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sf-border bg-sf-bg/25 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span
            style={{ backgroundColor: "var(--color-sf-green)" }}
            className="h-0.5 w-6 rounded-xs"
          />
          <p className="font-sans text-xs font-semibold text-sf-text-muted">
            p50 · median
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            style={{ borderColor: "var(--color-sf-amber)" }}
            className="w-6 border-t-2 border-dashed"
          />
          <p className="font-sans text-xs font-semibold text-sf-text-muted">
            p95 · tail latency
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            style={{ borderColor: "var(--color-sf-red)" }}
            className="w-6 border-t border-dashed"
          />
          <p className="font-sans text-xs font-semibold text-sf-text-muted">
            1000ms threshold
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndividualMonitorCharts;
