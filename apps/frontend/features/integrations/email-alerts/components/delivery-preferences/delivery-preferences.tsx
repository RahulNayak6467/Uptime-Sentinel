"use client";

import { useState } from "react";
import { Clock, CalendarDays, LayoutGrid, LineChart } from "lucide-react";
import { renotifyOptions, groupOptions } from "../../data";
import { RenotifyOption, GroupOption } from "../../types";

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
      checked ? "bg-sf-toggle-on" : "bg-sf-toggle-off"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-sf-bg rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

const DeliveryPreferences = () => {
  const [renotify, setRenotify] = useState<RenotifyOption>("Off");
  const [groupAlerts, setGroupAlerts] = useState<GroupOption>("15m");
  const [dailyDigest, setDailyDigest] = useState(false);
  const [includeChart, setIncludeChart] = useState(true);

  return (
    <div className="w-full rounded-lg border border-sf-border bg-sf-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="py-3 px-4 border-b border-sf-border">
        <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
          Delivery preferences
        </h1>
        <p className="text-[12px] font-sans text-sf-text-sub">
          Control frequency and formatting of alert emails
        </p>
      </div>

      <div className="divide-y divide-sf-border">
        <div className="flex items-center gap-4 px-5 py-3.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-sf-border bg-sf-bg shrink-0">
            <Clock className="w-4 h-4 text-sf-text-muted" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-medium font-sans text-sf-text leading-none">
              Re-notify while down
            </span>
            <span className="text-[12px] font-sans text-sf-text-muted mt-0.5">
              Keep emailing on an interval until the incident resolves
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {renotifyOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setRenotify(opt)}
                className={`px-4 py-1 text-[13px] font-sans font-medium rounded-lg border transition-colors duration-150 cursor-pointer ${
                  renotify === opt
                    ? "bg-sf-text text-sf-btn-text border-sf-text"
                    : "bg-sf-surface text-sf-text border-sf-border hover:bg-sf-bg"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-3.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-sf-border bg-sf-bg shrink-0">
            <LayoutGrid className="w-4 h-4 text-sf-text-muted" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-medium font-sans text-sf-text leading-none">
              Group related alerts
            </span>
            <span className="text-[12px] font-sans text-sf-text-muted mt-0.5">
              Bundle alerts firing close together into one email
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {groupOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setGroupAlerts(opt)}
                className={`px-4 py-1 text-[13px] font-sans font-medium rounded-lg border transition-colors duration-150 cursor-pointer ${
                  groupAlerts === opt
                    ? "bg-sf-text text-sf-btn-text border-sf-text"
                    : "bg-sf-surface text-sf-text border-sf-border hover:bg-sf-bg"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-3.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-sf-border bg-sf-bg shrink-0">
            <CalendarDays className="w-4 h-4 text-sf-text-muted" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-medium font-sans text-sf-text leading-none">
              Daily digest
            </span>
            <span className="text-[12px] font-sans text-sf-text-muted mt-0.5">
              A 09:00 summary of uptime, incidents and response times
            </span>
          </div>
          <Toggle checked={dailyDigest} onChange={() => setDailyDigest((p) => !p)} />
        </div>

        <div className="flex items-center gap-4 px-5 py-3.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-sf-border bg-sf-bg shrink-0">
            <LineChart className="w-4 h-4 text-sf-text-muted" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-medium font-sans text-sf-text leading-none">
              Include response chart
            </span>
            <span className="text-[12px] font-sans text-sf-text-muted mt-0.5">
              Attach a 24h latency graph to every alert email
            </span>
          </div>
          <Toggle checked={includeChart} onChange={() => setIncludeChart((p) => !p)} />
        </div>
      </div>
    </div>
  );
};

export default DeliveryPreferences;
