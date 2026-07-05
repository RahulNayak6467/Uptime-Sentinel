"use client";

import { checkIntervals } from "../../data";

const CheckInterval = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (interval: string) => void;
}) => {
  return (
    <div className="mt-4 w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Check interval
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            How often to run this check from each selected region
          </p>
        </div>
        <div className="px-4 py-3 flex gap-2 flex-wrap">
          {checkIntervals.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className={`cursor-pointer rounded-sf-sm border px-3 py-1 font-sans text-[12px] font-medium transition-colors duration-150 ${
                selected === label
                  ? "bg-sf-text text-sf-btn-text border-sf-text"
                  : "bg-sf-surface text-sf-text border-sf-border hover:border-sf-text-sub"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckInterval;
