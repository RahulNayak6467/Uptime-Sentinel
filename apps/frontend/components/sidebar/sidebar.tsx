"use client";

import { usePathname } from "next/navigation";
import UptimeSentinelImage from "../ui/uptime-sentinel";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { configureItems, monitorItems, workspaceItems } from "./data";
import MonitorStats from "./monitor-stats";
import DarkModeToggle from "./dark-mode";
import Spinner from "../ui/spinner";
import ConnectionStatus from "../sse/connection-status";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout, isPending } = useLogout();

  return (
    <aside className="h-full w-full border-r border-r-sf-border bg-sf-surface px-3.5 py-4">
      <div className="h-full w-full flex flex-col">
        <div className="flex items-center gap-2.5 px-1.5">
          <UptimeSentinelImage />
          <div>
            <p className="text-sm text-sf-text font-bold font-sans">
              UptimeSentinel
            </p>
            <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-sf-text-muted">Monitoring</p>
          </div>
        </div>
        <div className="mt-4 flex w-full items-center gap-2.5 rounded-sf-sm border border-sf-border bg-sf-bg/60 px-2.5 py-2">
          <span className="w-5.5 h-5.5 rounded-sm bg-[#464fe5] flex items-center justify-center text-[11px] font-bold text-white">
            A
          </span>
          <p className="text-[12px] text-sf-text font-sans font-bold">
            Acme Inc
          </p>
        </div>

        <div className="mt-6">
          <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
            Monitoring
          </h3>
          <div className="mt-1.5 space-y-0.5">
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
                isActive={
                  pathname === item.href ||
                  (item.href !== "/dashboard/overview" && pathname.startsWith(`${item.href}/`))
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
            Configure
          </h3>
          <div className="mt-1.5 space-y-0.5">
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

        <div className="mt-5">
          <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
            Workspace
          </h3>
          <div className="mt-1.5 space-y-0.5">
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
          <div className="mb-1 flex items-center justify-between pb-1">
            <span className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
              Real-time
            </span>
            <ConnectionStatus variant="compact" />
          </div>
          <div className="flex flex-col gap-0.5 border-t border-sf-border pt-2.5">
            <DarkModeToggle />
            <button className="flex min-h-9 w-full cursor-pointer items-center gap-3 rounded-sf-sm px-2.5 py-2 text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text">
              <HelpIcon />
              <span className="text-[13.5px] font-sans">Help &amp; docs</span>
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-3 rounded-sf-sm px-2 py-2 hover:bg-sf-bg/70">
            <span className="w-8 h-8 rounded-full bg-[#4b5563] flex items-center justify-center text-[12px] font-bold text-white shrink-0">
              DW
            </span>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13.5px] font-semibold text-sf-text font-sans truncate">
                Dana Whitman
              </span>
              <span className="text-[12px] text-sf-text-muted font-sans">
                Owner
              </span>
            </div>
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="shrink-0 text-sf-text-sub hover:text-sf-text transition-colors cursor-pointer disabled:opacity-50"
              title="Log out"
            >
              {isPending ? <Spinner label="Logging out" /> : <LogoutIcon />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

function LogoutIcon() {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

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
