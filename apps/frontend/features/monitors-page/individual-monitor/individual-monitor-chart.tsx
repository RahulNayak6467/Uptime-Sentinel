"use client";

import { useState } from "react";
import { ResponseTimeTrend } from "./monitor-info-stats";
import { useParams } from "next/navigation";
import { useTimeRange } from "./hooks/useTimeRange";

const RANGES = ["1h", "24h", "7d", "30d"] as const;
const REGIONS = ["Global", "US", "EU", "Asia"] as const;

const IndividualMonitorCharts = () => {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1h");
  const params = useParams<{ id: string }>();
  const { data } = useTimeRange(params.id, range);

  return (
    <section id="response-time" className="scroll-mt-16 overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-sf-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[14px] font-semibold text-sf-text">
            Response time
          </p>
          <p className="mt-1 font-sans text-xs text-sf-text-muted">
            p50 median and p95 tail latency · last {range}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <div className="flex w-full overflow-x-auto rounded-sf-sm border border-sf-border bg-sf-border-faint p-0.5 sm:w-auto">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setRange(r)
                }
                className={`min-w-12 flex-1 cursor-pointer rounded-[4px] px-3 py-1 text-xs font-semibold transition-colors sm:flex-none ${
                  range === r
                    ? "bg-sf-surface text-sf-text shadow-sm"
                    : "text-sf-text-muted hover:text-sf-text"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex max-w-full items-center gap-2 overflow-x-auto">
            <span className="rounded-sf bg-sf-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
              Soon
            </span>
            <div className="flex min-w-max cursor-not-allowed overflow-hidden rounded-sf border border-sf-border bg-sf-surface opacity-50">
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-sf-border bg-sf-bg/25 px-5 py-3">
        {[
          ["p50 · median", "var(--color-sf-green)"],
          ["p95 · tail latency", "var(--color-sf-amber)"],
        ].map(([label, color], index) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              style={{ borderColor: color }}
              className={`w-5 border-t-2 ${index === 1 ? "border-dashed" : ""}`}
            />
            <p className="font-sans text-[11px] font-semibold text-sf-text-muted">
              {label}
            </p>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            style={{ borderColor: "var(--color-sf-red)" }}
            className="w-6 border-t border-dashed"
          />
          <p className="font-sans text-xs font-semibold text-sf-text-muted">
            {data
              ? `${data.responseTimeThresholdMS}ms threshold`
              : "Loading threshold…"}
          </p>
        </div>
        <span className="ml-auto text-[10px] text-sf-text-muted">
          Additional percentiles are shown below the chart
        </span>
      </div>
    </section>
  );
};

export default IndividualMonitorCharts;
