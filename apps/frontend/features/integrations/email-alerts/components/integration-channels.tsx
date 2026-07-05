"use client";

import { channels } from "../data";

const IntegrationChannels = () => {
  return (
    <div className="mx-auto flex max-w-7xl px-6 pt-5">
      <div className="flex items-center gap-1 rounded-lg border border-sf-border bg-sf-border-faint p-1 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {channels.map(({ icon: Icon, label, active, soon }) => (
        <div
          key={label}
          className={`flex select-none items-center gap-2 rounded-sf-sm border px-3.5 py-1.5 text-[12px] font-medium ${
            active
              ? "cursor-pointer border-sf-border bg-sf-surface text-sf-text shadow-sm"
              : "cursor-default border-transparent text-sf-text-muted"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className={active ? "text-sf-text" : "text-sf-text-sub"}>
            {label}
          </span>
          {active && (
            <span className="size-1.5 rounded-full bg-sf-green" />
          )}
          {soon && (
            <span className="text-[12px] text-sf-text-muted font-normal">
              Soon
            </span>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default IntegrationChannels;
