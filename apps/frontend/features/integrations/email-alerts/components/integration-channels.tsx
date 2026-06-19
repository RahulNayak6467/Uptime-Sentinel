"use client";

import { channels } from "../data";

const IntegrationChannels = () => {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-sf-border">
      {channels.map(({ icon: Icon, label, active, soon }) => (
        <div
          key={label}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-sf border text-[13px] font-medium select-none ${
            active
              ? "bg-sf-text border-sf-text text-sf-surface cursor-pointer"
              : "border-sf-border text-sf-text-muted cursor-default"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className={active ? "text-sf-surface" : "text-sf-text-sub"}>
            {label}
          </span>
          {active && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sf-surface/20 text-sf-surface tracking-wide">
              ACTIVE
            </span>
          )}
          {soon && (
            <span className="text-[12px] text-sf-text-muted font-normal">
              Soon
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default IntegrationChannels;
