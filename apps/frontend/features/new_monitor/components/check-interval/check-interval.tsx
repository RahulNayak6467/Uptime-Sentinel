"use client";

import { checkIntervals } from "../../data";
import SectionHeader from "../section-header";

const CheckInterval = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (interval: string) => void;
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="04" title="Check interval" description="Choose how frequently the endpoint is checked" />
        <div className="flex flex-wrap gap-2 p-5">
          {checkIntervals.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className={`cursor-pointer rounded-sf-sm border px-3 py-1 font-sans text-[12px] font-medium transition-colors duration-150 ${
                selected === label
                  ? "border-sf-blue bg-sf-blue text-white"
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
