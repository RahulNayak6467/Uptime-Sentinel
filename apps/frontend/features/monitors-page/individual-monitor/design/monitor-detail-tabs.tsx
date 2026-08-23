"use client";

import {
  EthernetPort,
  Globe2,
  LockKeyhole,
  Network,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import CertificatesMonitor from "./certificates-monitor";
import DnsMonitor from "./dns-monitor";
import MultiRegionMonitor from "./multi-region-monitor";
import TcpMonitor from "./tcp-monitor";
// import VpsMonitor from "./vps-monitor";
import { IndividualOverviewStatsProps } from "../types";

type DetailTab = "tls" | "dns" | "tcp" | "regions";

type DetailTabDefinition = {
  id: DetailTab;
  panelId: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const tabs: DetailTabDefinition[] = [
  {
    id: "tls",
    panelId: "tls-monitoring",
    label: "TLS",
    description: "Certificate health and renewal",
    icon: LockKeyhole,
  },
  {
    id: "dns",
    panelId: "dns-monitoring",
    label: "DNS",
    description: "Records and resolution health",
    icon: Network,
  },
  {
    id: "tcp",
    panelId: "tcp-monitoring",
    label: "TCP",
    description: "Port reachability and connection timing",
    icon: EthernetPort,
  },
  {
    id: "regions",
    panelId: "multi-region-monitoring",
    label: "Regions",
    description: "Geographic probes and aggregation",
    icon: Globe2,
  },
  // VPS is a standalone monitor type and is intentionally not mounted in
  // request diagnostics.
  // {
  //   id: "vps",
  //   panelId: "vps-monitoring",
  //   label: "VPS",
  //   description: "Host resources and agent health",
  //   icon: Server,
  // },
];

const getDefaultTab = (
  monitorType: IndividualOverviewStatsProps["monitorType"],
): DetailTab => {
  if (monitorType === "dns") return "dns";
  if (monitorType === "tls" || monitorType === "https") return "tls";
  return "regions";
};

const MonitorDetailTabs = ({
  monitorType,
  tlsMonitorId,
}: {
  monitorType: IndividualOverviewStatsProps["monitorType"];
  tlsMonitorId: string | null;
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>(() =>
    getDefaultTab(monitorType),
  );

  return (
    <section
      id="infrastructure"
      className="protocol-detail-theme scroll-mt-16"
    >
      <div className="border-b border-sf-border">
        <div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sf-text-muted">
              Diagnostics
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-sf-tight text-sf-text">
              Infrastructure health
            </h2>
            <p className="mt-1 text-xs text-sf-text-muted">
              Inspect the network layers behind this monitor
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Monitor infrastructure details"
          className="-mb-px flex min-w-0 gap-6 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={tab.panelId}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex min-w-fit cursor-pointer items-center gap-2.5 border-b-2 px-0.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sf-protocol-accent-border)] ${
                  isActive
                    ? "border-[var(--sf-protocol-accent)] text-sf-text"
                    : "border-transparent text-sf-text-muted hover:border-sf-border hover:text-sf-text"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${
                    isActive
                      ? "text-[var(--sf-protocol-accent)]"
                      : "text-sf-text-muted group-hover:text-sf-text-sub"
                  }`}
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">{tab.label}</span>
                  <span className="mt-0.5 hidden truncate text-[10px] text-sf-text-muted xl:block">
                    {tab.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5" role="tabpanel">
        {activeTab === "tls" && tlsMonitorId ? (
          <CertificatesMonitor tlsMonitorId={tlsMonitorId} />
        ) : null}
        {activeTab === "dns" ? <DnsMonitor /> : null}
        {activeTab === "tcp" ? <TcpMonitor /> : null}
        {activeTab === "regions" ? <MultiRegionMonitor /> : null}
        {/* {activeTab === "vps" ? <VpsMonitor /> : null} */}
      </div>
    </section>
  );
};

export default MonitorDetailTabs;
