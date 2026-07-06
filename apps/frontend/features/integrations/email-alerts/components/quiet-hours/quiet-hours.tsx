"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, TriangleAlert } from "lucide-react";
import { hours, dayOptions } from "../../data";
import { DayOption } from "../../types";

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

const TimeDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-sf-border rounded-[4px] text-[13px] font-sans font-medium text-sf-text bg-sf-surface hover:bg-sf-bg transition-colors cursor-pointer"
      >
        {value}
        <ChevronDown className="w-3.5 h-3.5 text-sf-text-muted" />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 w-28 max-h-56 overflow-y-auto bg-sf-surface border border-sf-border rounded-lg shadow-sf-card py-1">
          {hours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                onChange(h);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] font-sans text-sf-text hover:bg-sf-bg transition-colors cursor-pointer text-left"
            >
              <span className="w-3 shrink-0">
                {h === value && <Check className="w-3 h-3 text-sf-text" />}
              </span>
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const QuietHours = () => {
  const [enabled, setEnabled] = useState(true);
  const [startTime, setStartTime] = useState("22:00");
  const [endTime, setEndTime] = useState("07:00");
  const [dayScope, setDayScope] = useState<DayOption>("Every day");
  const [alwaysSendDown, setAlwaysSendDown] = useState(true);

  return (
    <div className="mt-6 w-full rounded-lg border border-sf-border bg-sf-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex items-start justify-between py-3 px-5">
        <div>
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Quiet hours
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Pause non-critical emails during set hours
          </p>
        </div>
        <Toggle checked={enabled} onChange={() => setEnabled((p) => !p)} />
      </div>

      {enabled && (
        <div className="border-t border-sf-border divide-y divide-sf-border">
          <div className="flex items-center gap-3 px-5 py-3.5 flex-wrap">
            <span className="text-[13px] font-medium font-sans text-sf-text shrink-0">
              Pause between
            </span>
            <TimeDropdown value={startTime} onChange={setStartTime} />
            <span className="text-[13px] font-sans text-sf-text-muted shrink-0">
              and
            </span>
            <TimeDropdown value={endTime} onChange={setEndTime} />
            <span className="text-[13px] font-medium font-sans text-sf-text shrink-0 ml-2">
              On
            </span>
            <div className="flex items-center gap-1">
              {dayOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDayScope(opt)}
                  className={`px-3 py-1 text-[13px] font-sans font-medium rounded-[4px] border transition-colors duration-150 cursor-pointer ${
                    dayScope === opt
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
            <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-sf-red-border bg-sf-red-bg shrink-0">
              <TriangleAlert className="w-4 h-4 text-sf-red" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13px] font-medium font-sans text-sf-text leading-none">
                Always send &ldquo;monitor down&rdquo; alerts
              </span>
              <span className="text-[12px] font-sans text-sf-text-muted mt-0.5">
                Critical down events ignore quiet hours and send immediately
              </span>
            </div>
            <Toggle
              checked={alwaysSendDown}
              onChange={() => setAlwaysSendDown((p) => !p)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuietHours;
