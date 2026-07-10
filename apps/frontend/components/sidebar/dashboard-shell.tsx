"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import LiveTabStatus from "@/components/live-tab-status";
import SSEStatusProvider from "@/components/sse/sse-status-provider";
import UptimeSentinelImage from "@/components/ui/uptime-sentinel";
import Sidebar from "./sidebar";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SSEStatusProvider>
      <section className="flex min-h-dvh w-full bg-sf-bg md:h-screen md:overflow-hidden">
        <LiveTabStatus />

        <div className="hidden h-full w-60 shrink-0 md:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sf-border bg-sf-surface/95 px-4 backdrop-blur md:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
              <UptimeSentinelImage />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-sf-text">
                  UptimeSentinel
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
                  Monitoring
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              className="flex size-9 items-center justify-center rounded-[4px] border border-sf-border bg-sf-surface text-sf-text-sub shadow-sm transition-colors hover:bg-sf-bg hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
            >
              <Menu className="size-4" />
            </button>
          </header>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 cursor-default bg-black/35"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-[min(20rem,86vw)] bg-sf-surface shadow-2xl">
                <div className="flex h-14 items-center justify-between border-b border-sf-border px-4">
                  <div className="flex items-center gap-2.5">
                    <UptimeSentinelImage />
                    <span className="text-sm font-bold text-sf-text">
                      UptimeSentinel
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                    className="flex size-8 items-center justify-center rounded-[4px] text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/25"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto">
                  <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </div>
              </div>
            </div>
          )}

          <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </section>
    </SSEStatusProvider>
  );
};

export default DashboardShell;
