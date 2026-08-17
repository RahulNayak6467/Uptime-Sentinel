"use client";

import { useState } from "react";
import {
  Activity,
  Globe,
  MapPin,
  Plug,
  ShieldCheck,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import CertificatesMonitor from "./design/certificates-monitor";
import DnsMonitor from "./design/dns-monitor";
import TcpMonitor from "./design/tcp-monitor";
import MultiRegionMonitor from "./design/multi-region-monitor";

// VPS and Webhook Events are standalone monitor types, not request-diagnostic
// layers. Keep their complete preview components available while they remain
// outside the HTTP monitor detail flow.
// import VpsMonitor from "./design/vps-monitor";
// import WebhookEventsMonitor from "./design/webhook-events-monitor";

type CheckKey = "overview" | "dns" | "tcp" | "tls" | "region";
type DiagnosticKey = Exclude<CheckKey, "overview">;
type Tone = "positive" | "warn" | "negative";

type DiagnosticDef = {
  key: DiagnosticKey;
  icon: LucideIcon;
  label: string;
  status: string;
  summary: string;
  tone: Tone;
  facts: { label: string; value: string }[];
};

// Mock — replace each summary with the linked check's latest result.
// The full fact sets are deliberately retained for the overview and future
// data wiring; switching to tabs does not reduce the underlying report model.
const diagnostics: DiagnosticDef[] = [
  {
    key: "dns",
    icon: Globe,
    label: "DNS",
    status: "Healthy",
    summary: "12ms",
    tone: "positive",
    facts: [
      { label: "A record", value: "76.76.21.21" },
      { label: "Resolve", value: "12 ms" },
      { label: "Resolvers", value: "6/6 agree" },
      { label: "DNSSEC", value: "Validated" },
    ],
  },
  {
    key: "tcp",
    icon: Plug,
    label: "TCP",
    status: "Up",
    summary: "18ms",
    tone: "positive",
    facts: [
      { label: "Port", value: "443" },
      { label: "Connect", value: "18 ms" },
      { label: "Timeout", value: "5s" },
      { label: "Last", value: "Reported up" },
    ],
  },
  {
    key: "tls",
    icon: ShieldCheck,
    label: "TLS",
    status: "Valid",
    summary: "A+ · 62d",
    tone: "positive",
    facts: [
      { label: "Expires", value: "in 62 days" },
      { label: "Grade", value: "A+" },
      { label: "Issuer", value: "Let's Encrypt" },
      { label: "Chain", value: "Trusted" },
    ],
  },
  {
    key: "region",
    icon: MapPin,
    label: "Regions",
    status: "All healthy",
    summary: "5/5 up",
    tone: "positive",
    facts: [
      { label: "Regions", value: "5/5 up" },
      { label: "Fastest", value: "Frankfurt 21ms" },
      { label: "Slowest", value: "Mumbai 92ms" },
      { label: "Spread", value: "71 ms" },
    ],
  },
];

/*
const standaloneMonitorPreviews = [
  {
    key: "vps",
    label: "VPS monitoring",
    status: "Healthy",
    facts: [
      { label: "CPU", value: "37%" },
      { label: "Memory", value: "68%" },
      { label: "Disk", value: "54%" },
      { label: "Agent", value: "Connected" },
    ],
    panel: <VpsMonitor />,
  },
  {
    key: "webhook",
    label: "Webhook events",
    status: "Receiving",
    facts: [
      { label: "Last event", value: "24s ago" },
      { label: "Events · 24h", value: "1,248" },
      { label: "Valid", value: "99.8%" },
      { label: "Signature", value: "Verified" },
    ],
    panel: <WebhookEventsMonitor />,
  },
];
*/

const staticPanels: Record<Exclude<DiagnosticKey, "tls">, React.ReactNode> = {
  dns: <DnsMonitor />,
  tcp: <TcpMonitor />,
  region: <MultiRegionMonitor />,
};

const NoTlsPanel = () => (
  <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-sf-border bg-sf-surface px-6 py-10 text-center">
    <p className="text-sm font-semibold text-sf-text">No TLS monitoring for this host</p>
    <p className="max-w-sm text-xs leading-5 text-sf-text-muted">
      Enable the TLS certificate check for this monitor to see certificate expiry, chain, and validation here.
    </p>
  </div>
);

const toneDot: Record<Tone, string> = {
  positive: "bg-sf-green",
  warn: "bg-sf-amber",
  negative: "bg-sf-red",
};

const requestPhases = [
  { label: "DNS", value: 12, context: "Resolved" },
  { label: "TCP", value: 18, context: "Connected" },
  { label: "TLS", value: 84, context: "Negotiated TLS 1.3" },
  { label: "TTFB", value: 126, context: "Headers received" },
  { label: "Download", value: 31, context: "42.8 KB body" },
] as const;

const RequestOverview = ({ onOpen }: { onOpen: (key: DiagnosticKey) => void }) => {
  const total = requestPhases.reduce((sum, phase) => sum + phase.value, 0);

  return (
    <section className="overflow-hidden rounded-[8px] border border-sf-border bg-sf-surface">
      <header className="flex flex-col gap-2 border-b border-sf-border-faint px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <TimerReset className="mt-0.5 size-4 shrink-0 text-sf-blue" strokeWidth={1.8} />
          <div>
            <h3 className="text-sm font-semibold tracking-sf-tight text-sf-text">Latest request path</h3>
            <p className="mt-1 text-[11.5px] text-sf-text-muted">Where the most recent successful HTTP check spent its time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="size-1.5 rounded-full bg-sf-green" />
          <span className="font-medium text-sf-green">Completed in {total}ms</span>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-5">
        <div className="flex h-2 overflow-hidden rounded-[2px] bg-sf-border-faint" aria-label={`Total request time ${total} milliseconds`}>
          {requestPhases.map((phase, index) => (
            <span
              key={phase.label}
              className={index === 0 ? "bg-sf-blue" : index === 1 ? "bg-sf-green" : index === 2 ? "bg-sf-purple" : index === 3 ? "bg-sf-amber" : "bg-sf-text-muted/60"}
              style={{ width: `${(phase.value / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[5px] border border-sf-border-faint bg-sf-border-faint sm:grid-cols-5">
          {requestPhases.map((phase) => (
            <div key={phase.label} className="bg-sf-surface px-3 py-3">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">{phase.label}</p>
              <p className="mt-1.5 text-lg font-semibold leading-none tabular-nums text-sf-text">{phase.value}<span className="ml-0.5 text-[10px] font-medium text-sf-text-muted">ms</span></p>
              <p className="mt-1.5 truncate text-[10px] text-sf-text-muted">{phase.context}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-px border-t border-sf-border-faint bg-sf-border-faint sm:grid-cols-2 lg:grid-cols-4">
        {diagnostics.map((diagnostic) => (
          <button
            key={diagnostic.key}
            type="button"
            onClick={() => onOpen(diagnostic.key)}
            className="group bg-sf-surface px-4 py-3 text-left transition-colors hover:bg-sf-bg/55"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-sf-text-muted">{diagnostic.label}</span>
              <span className={`size-1.5 rounded-full ${toneDot[diagnostic.tone]}`} />
            </div>
            <p className="mt-1.5 text-xs font-medium text-sf-text">{diagnostic.status}</p>
            <p className="mt-1 truncate font-mono text-[10.5px] text-sf-text-muted">{diagnostic.facts.map((fact) => fact.value).slice(0, 2).join(" · ")}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

const MonitorChecksPanels = ({ tlsMonitorId }: { tlsMonitorId: string | null }) => {
  const [selected, setSelected] = useState<CheckKey>("overview");

  const tabs = [
    { key: "overview" as const, icon: Activity, label: "Overview", status: "Healthy", summary: "271ms", tone: "positive" as Tone },
    ...diagnostics,
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sf-blue">HTTP request</p>
          <h2 className="mt-1 text-sm font-semibold text-sf-text">Request diagnostics</h2>
        </div>
        <span className="text-[11px] text-sf-text-muted">DNS → TCP → TLS → HTTP response</span>
      </div>

      <nav aria-label="Request diagnostic reports" className="overflow-x-auto rounded-[7px] border border-sf-border bg-sf-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" className="flex min-w-[680px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = selected === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelected(tab.key)}
                aria-selected={active}
                aria-controls={`diagnostic-panel-${tab.key}`}
                id={`diagnostic-tab-${tab.key}`}
                role="tab"
                className={`relative flex min-h-[58px] min-w-0 flex-1 items-center gap-2.5 border-r border-sf-border-faint px-3.5 text-left transition-colors last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sf-blue/30 ${active ? "bg-sf-blue-bg/50" : "hover:bg-sf-bg/55"}`}
              >
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sf-blue" /> : null}
                <Icon className={`size-4 shrink-0 ${active ? "text-sf-blue" : "text-sf-text-muted"}`} strokeWidth={1.8} />
                <span className="min-w-0">
                  <span className={`block truncate text-[11.5px] font-semibold ${active ? "text-sf-blue" : "text-sf-text"}`}>{tab.label}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <span className={`size-1.5 shrink-0 rounded-full ${toneDot[tab.tone]}`} />
                    <span className="truncate font-mono text-[10px] text-sf-text-muted">{tab.summary}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div
        id={`diagnostic-panel-${selected}`}
        aria-labelledby={`diagnostic-tab-${selected}`}
        role="tabpanel"
      >
        {selected === "overview" ? (
          <RequestOverview onOpen={setSelected} />
        ) : selected === "tls" ? (
          tlsMonitorId ? (
            <CertificatesMonitor tlsMonitorId={tlsMonitorId} />
          ) : (
            <NoTlsPanel />
          )
        ) : (
          staticPanels[selected]
        )}
      </div>

    </section>
  );
};

export default MonitorChecksPanels;
