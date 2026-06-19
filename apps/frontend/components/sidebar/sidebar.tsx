"use client";

import { usePathname } from "next/navigation";
import UptimeSentinelImage from "../ui/uptime-sentinel";
import { configureItems, monitorItems, workspaceItems } from "./data";
import MonitorStats from "./monitor-stats";
import DarkModeToggle from "./dark-mode";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="w-full h-full px-4 pt-4 pb-4 bg-sf-surface border-r border-r-sf-border">
      <div className="h-full w-full flex flex-col">
        <div className="flex items-center gap-2">
          <UptimeSentinelImage />
          <div>
            <p className="text-sm text-sf-text font-bold font-sans">
              UptimeSentinel
            </p>
            <p className="text-[9.5px] text-sf-text-muted">UPTIME</p>
          </div>
        </div>
        <div className="flex w-full gap-2 items-center mt-2 border border-sf-border py-1.5 px-2 rounded-lg">
          <span className="w-5.5 h-5.5 rounded-sm bg-[#464fe5] flex items-center justify-center text-[11px] font-bold text-sf-bg">
            A
          </span>
          <p className="text-[12px] text-sf-text font-sans font-bold">
            Acme Inc
          </p>
        </div>

        <div className="mt-6">
          <h3 className="uppercase text-sf-text-sub font-sans text-[11px] tracking-wider">
            Monitoring
          </h3>
          <div className="mt-1">
            {monitorItems.map((item) => (
              <MonitorStats
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                number={item.number}
                color={item.color}
                backgroundColor={item.backgroundColor}
                comingSoon={item.comingSoon}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="uppercase text-sf-text-sub font-sans text-[11px] tracking-wider">
            Configure
          </h3>
          <div className="mt-1">
            {configureItems.map((item) => (
              <MonitorStats
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="uppercase text-sf-text-sub font-sans text-[11px] tracking-wider">
            Workspace
          </h3>
          <div className="mt-1">
            {workspaceItems.map((item) => (
              <MonitorStats
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                comingSoon={item.comingSoon}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-sf-border pt-2 flex flex-col gap-0.5">
            <DarkModeToggle />
            <button className="flex items-center gap-3 w-full px-2 py-1.5 rounded-sf text-sf-text-sub hover:bg-sf-bg hover:text-sf-text transition-colors cursor-pointer">
              <HelpIcon />
              <span className="text-[13.5px] font-sans">Help &amp; docs</span>
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1 px-2 py-1.5">
            <span className="w-8 h-8 rounded-full bg-[#4b5563] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
              DW
            </span>
            <div className="flex flex-col">
              <span className="text-[13.5px] font-semibold text-sf-text font-sans">
                Dana Whitman
              </span>
              <span className="text-[12px] text-sf-text-muted font-sans">
                Owner
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function HelpIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default Sidebar;
