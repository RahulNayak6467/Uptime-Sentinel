"use client";

import { channels } from "../data";

const IntegrationChannels = () => {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 pt-5">
      {channels.map(({ icon: Icon, label, active, soon }) => (
        <div
          key={label}
          className={`flex select-none items-center gap-2.5 rounded-sf-sm border px-4 py-2 text-[13px] font-medium ${
            active
              ? "cursor-pointer border-sf-blue/30 bg-sf-blue-bg text-sf-blue"
              : "cursor-default border-transparent text-sf-text-muted"
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className={active ? "text-sf-blue" : "text-sf-text-sub"}>
            {label}
          </span>
          {active && (
            <span className="rounded bg-sf-blue/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-sf-blue">
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
