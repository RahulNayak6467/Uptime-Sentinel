"use client";

import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  BellRing,
  Check,
  Clock3,
  History,
  LayoutGrid,
  MapPin,
  Network,
  RefreshCw,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  KeyValue,
  KeyValueList,
  Panel,
  PercentileStrip,
  Pill,
  TableScroll,
  type Tone,
} from "../monitor-detail-primitives";
import { TrendChart } from "../monitor-detail-charts";

/* Coming-soon badge (brand accent). */
const ComingSoon = () => (
  <span className="inline-flex items-center gap-1 rounded-sf border border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-[var(--sf-protocol-accent)]">
    Coming soon
  </span>
);

/* Blurs a card's data region while leaving the header + Coming-soon badge crisp. */
const BlurredContent = ({ children }: { children: ReactNode }) => (
  <div className="pointer-events-none select-none opacity-15 saturate-0">
    {children}
  </div>
);

const toneIconClass: Record<Tone, string> = {
  neutral: "text-sf-text-muted",
  info: "text-[var(--sf-protocol-accent)]",
  positive: "text-sf-green",
  warning: "text-sf-amber",
  negative: "text-sf-red",
};

const TcpPanelHeader = ({
  icon: Icon,
  title,
  meta,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  meta?: ReactNode;
  tone?: Tone;
}) => (
  <header className="flex min-h-11 flex-col items-start justify-between gap-1.5 border-b border-sf-border-faint px-4 py-2 sm:flex-row sm:items-center sm:gap-4">
    <div className="flex min-w-0 items-center gap-3">
      <Icon
        className={`size-4 shrink-0 ${toneIconClass[tone]}`}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <h3 className="truncate text-sm font-semibold tracking-[-0.015em] text-sf-text">
        {title}
      </h3>
    </div>
    {meta ? (
      <div className="text-left text-[11px] leading-relaxed text-sf-text-muted sm:shrink-0 sm:text-right">
        {meta}
      </div>
    ) : null}
  </header>
);

const TcpSection = ({
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section>
    <h2 className="sr-only">{title}</h2>
    <p className="sr-only">{description}</p>
    {children}
  </section>
);

/* Right-aligned footer row used to balance card heights. */
const FooterRow = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive";
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="text-[11px] text-sf-text-muted">{label}</span>
    <span className={`text-xs font-medium ${tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>
      {value}
    </span>
  </div>
);

const mockTcpMonitor = {
  host: "api.statusforge.io",
  port: 5432,
  service: "PostgreSQL",
  protocol: "TCP · IPv4",
  state: "Open",
  handshakeMs: 18,
  p95Ms: 38,
  socketErrors24h: 0,
  uptime30d: "99.99%",
  bannerMatched: "Matched",
  lastChecked: "40 seconds ago",
  nextCheck: "in 20 seconds",
  // Collapsed, feasible lifecycle. The reference's SYN / SYN-ACK / ACK split
  // isn't exposed by Node, so those become one "TCP handshake" phase.
  lifecycle: {
    totalMs: 18,
    phases: [
      { label: "DNS resolution", detail: "A record for api.statusforge.io", ms: 3, color: "bg-[var(--sf-protocol-accent)] opacity-40" },
      { label: "TCP handshake", detail: "SYN → SYN-ACK → ACK · socket ready", ms: 11, color: "bg-[var(--sf-protocol-accent)] opacity-70" },
      { label: "Banner read", detail: "Expected pattern ^PostgreSQL", ms: 3, color: "bg-[var(--sf-protocol-accent)]" },
      { label: "Close", detail: "FIN · no socket left half-open", ms: 1, color: "bg-sf-text-muted" },
    ],
  },
  retry: {
    attemptsNote: "3 attempts · 20s apart",
    attempts: [
      { n: 1, label: "Attempt 1", status: "Connected", ms: "18ms", tone: "positive" as Tone },
      { n: 2, label: "Attempt 2", status: "Not needed", ms: "—", tone: "neutral" as Tone },
      { n: 3, label: "Attempt 3", status: "Not needed", ms: "—", tone: "neutral" as Tone },
    ],
    result: "Reported up",
    connectTimeout: "5s",
    slowThreshold: "200ms",
  },
  distribution: [
    { label: "p50", ms: 18 },
    { label: "p75", ms: 23 },
    { label: "p90", ms: 31 },
    { label: "p95", ms: 38 },
    { label: "p99", ms: 47 },
    { label: "p99.9", ms: 55 },
    { label: "max", ms: 61 },
  ],
  distributionNote: "Last 24h · 2,880 checks",
  slowThresholdMs: 200,
  connectionTrend: {
    values: [
      19, 18, 20, 17, 24, 19, 18, 22, 20, 19, 144, 18,
      21, 17, 19, 25, 20, 22, 19, 18, 24, 20, 19, 18,
    ],
    categories: [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
      "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
      "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00", "now",
    ],
    latestMs: 18,
    averageMs: 25,
    p50Ms: 18,
    p75Ms: 23,
    p90Ms: 31,
    p95Ms: 38,
    p99Ms: 47,
    p999Ms: 55,
    maxMs: 61,
  },
  protocolCheck: {
    banner: "PostgreSQL ready",
    bannerBytes: "11 bytes · 4ms",
    checks: [
      { label: "Socket accepted", description: "Three-way handshake completed", status: "Pass" },
      { label: "Banner received", description: "Data arrived within the 2s read timeout", status: "Pass" },
      { label: "Expected pattern matched", description: "Response starts with ^PostgreSQL", status: "Pass" },
      { label: "Plain TCP", description: "No TLS negotiated · certificate checks skipped", status: "Pass" },
    ],
  },
  socketErrors: [
    { code: "ECONNREFUSED", meaning: "Connection refused", cause: "Nothing listening, or a firewall sent a reset", count: 0 },
    { code: "ETIMEDOUT", meaning: "Connect timeout", cause: "No SYN-ACK within the 5s connect timeout", count: 0 },
    { code: "EHOSTUNREACH", meaning: "Host unreachable", cause: "No route to the host from the probe", count: 0 },
    { code: "ECONNRESET", meaning: "Reset by peer", cause: "Accepted, then closed abruptly mid-handshake", count: 0 },
    { code: "ENETUNREACH", meaning: "Network unreachable", cause: "Probe network could not reach the destination", count: 0 },
    { code: "EMFILE", meaning: "Descriptor limit", cause: "Probe ran out of file descriptors", count: 0 },
  ],
  // Multi-region — needs real regional probes, hence blurred / coming-soon.
  perRegion: [
    { region: "US-East", location: "Ashburn, VA", connectMs: 18 },
    { region: "US-West", location: "Portland, OR", connectMs: 22 },
    { region: "EU-West", location: "Dublin, IE", connectMs: 29 },
    { region: "EU-Central", location: "Frankfurt, DE", connectMs: 31 },
    { region: "AP-South", location: "Mumbai, IN", connectMs: 43 },
    { region: "SA-East", location: "São Paulo, BR", connectMs: 56 },
  ],
  heatmapRegions: ["US-East", "US-West", "EU-West", "EU-Central", "AP-South", "SA-East"],
  config: {
    host: "api.statusforge.io",
    port: "5432 · PostgreSQL",
    resolvedAddress: "76.76.21.21",
    ipVersion: "IPv4 · prefer A record",
    connectTimeout: "5s",
    readTimeout: "2s",
    slowThreshold: "200ms",
    checkInterval: "30s",
    expectedPattern: "^PostgreSQL",
    keepAlive: "Disabled · socket closed each check",
    addressPinning: "Alert if resolved IP changes",
  },
  history: [
    { id: "tcp-h-1", type: "Recovered", description: "Handshake back under threshold at 18ms after the failover completed.", occurredAt: "Jul 24 · 04:18", tone: "positive" as Tone },
    { id: "tcp-h-2", type: "Slow connect", description: "Connect time 144ms during a primary failover. No incident opened.", occurredAt: "Jul 24 · 04:02", tone: "warning" as Tone },
    { id: "tcp-h-3", type: "Address changed", description: "Resolved address 76.76.21.18 → 76.76.21.21. Snapshot updated.", occurredAt: "Jul 11 · 16:45", tone: "neutral" as Tone },
    { id: "tcp-h-4", type: "Port opened", description: "Monitor created · first successful handshake in 18ms.", occurredAt: "Jun 02 · 11:20", tone: "neutral" as Tone },
  ],
  alertRules: [
    { label: "Connection failure", description: "The port stops accepting TCP connections.", enabled: true },
    { label: "Slow connection", description: "Connection time reaches the configured slow threshold.", enabled: true },
    { label: "Socket error", description: "A timeout, reset, or unreachable-host error is recorded.", enabled: true },
    { label: "Banner mismatch", description: "The received service banner no longer matches the expected pattern.", enabled: true },
    { label: "Address changed", description: "The hostname resolves to a different IP address.", enabled: false },
    { label: "Recovery", description: "The port accepts connections again after a failure.", enabled: true },
  ],
} as const;

const dotTone: Record<Tone, string> = {
  neutral: "bg-sf-text-muted",
  info: "bg-[var(--sf-protocol-accent)]",
  positive: "bg-sf-green",
  warning: "bg-sf-amber",
  negative: "bg-sf-red",
};

const summaryStats = [
  {
    label: "Handshake",
    value: mockTcpMonitor.handshakeMs,
    unit: "ms",
    tone: "neutral" as Tone,
    hint: "Threshold 200ms",
  },
  {
    label: "p95 · 24h",
    value: mockTcpMonitor.p95Ms,
    unit: "ms",
    tone: "neutral" as Tone,
    hint: "Stable",
  },
  {
    label: "Banner",
    value: mockTcpMonitor.bannerMatched,
    tone: "neutral" as Tone,
    hint: "^PostgreSQL",
  },
  {
    label: "Socket errors",
    value: mockTcpMonitor.socketErrors24h,
    tone: "neutral" as Tone,
    hint: "Last 24 hours",
  },
  {
    label: "Uptime · 30d",
    value: mockTcpMonitor.uptime30d,
    tone: "neutral" as Tone,
    hint: "Target 99.9%",
  },
  {
    label: "State",
    value: mockTcpMonitor.state,
    tone: "positive" as Tone,
    hint: "Accepting",
  },
] as const;

const TcpStatusSummary = () => (
  <div className="space-y-2.5">
    <Panel className="relative bg-sf-surface">
      <div className="flex flex-col gap-3 px-[18px] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-sf-green-border bg-sf-green-bg text-sf-green">
            <Network className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
                Port open
              </h1>
              <Pill tone="positive" dot>
                Accepting
              </Pill>
              <Pill tone="neutral">
                Port {mockTcpMonitor.port} · {mockTcpMonitor.service}
              </Pill>
              <Pill tone="neutral">{mockTcpMonitor.protocol}</Pill>
            </div>
            <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
              {mockTcpMonitor.host}:{mockTcpMonitor.port}
            </p>
            <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
              The three-way handshake completes cleanly, the banner matches the
              expected pattern, and no socket errors were recorded in 24 hours.
            </p>
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 divide-x divide-sf-border-faint">
          <div className="min-w-32 px-4 py-1">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
              <Clock3 className="size-3" aria-hidden="true" />
              Last check
            </dt>
            <dd className="mt-1.5 text-xs font-medium text-sf-text">
              {mockTcpMonitor.lastChecked}
            </dd>
          </div>
          <div className="min-w-32 px-4 py-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
              Next check
            </dt>
            <dd className="mt-1.5 text-xs font-medium text-[var(--sf-protocol-accent)]">
              {mockTcpMonitor.nextCheck}
            </dd>
          </div>
        </dl>
      </div>
    </Panel>

    <Panel>
      <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
            <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-sf-text-muted">
              {stat.tone === "positive" ? (
                <span className="size-1.5 rounded-full bg-sf-green" />
              ) : null}
              {stat.label}
            </dt>
            <dd
              className={`mt-2 truncate text-[23px] font-semibold leading-none tracking-[-0.035em] tabular-nums ${
                stat.tone === "positive"
                  ? "text-sf-green"
                  : "text-sf-text"
              }`}
            >
              {stat.value}
              {"unit" in stat ? (
                <span className="ml-1 text-xs font-medium tracking-normal text-sf-text-muted">
                  {stat.unit}
                </span>
              ) : null}
            </dd>
            <dd className="mt-1.5 text-[11px] leading-relaxed text-sf-text-muted">
              {stat.hint}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  </div>
);

/* ------------------------------------------------------------------ */
/* Connection & lifecycle                                              */
/* ------------------------------------------------------------------ */

const TcpLifecycleCard = () => {
  const { lifecycle } = mockTcpMonitor;
  const total = lifecycle.totalMs;
  const rows = lifecycle.phases.map((phase, index) => ({
    ...phase,
    start: lifecycle.phases
      .slice(0, index)
      .reduce((elapsed, previousPhase) => elapsed + previousPhase.ms, 0),
  }));
  return (
    <Panel>
      <TcpPanelHeader
        icon={Zap}
        tone="info"
        title="Socket lifecycle"
        meta={<span className="tabular-nums">Last check · {total}ms total</span>}
      />
      <div className="hidden grid-cols-[minmax(180px,0.85fr)_minmax(180px,1.35fr)_48px] items-center gap-4 px-4 pb-1 pt-2 text-[10px] uppercase tracking-[0.08em] text-sf-text-muted sm:grid">
        <span />
        <span className="flex items-center justify-between">
          <span>0</span>
          <span>{Math.round(total / 2)}ms</span>
          <span>{total}ms</span>
        </span>
        <span className="text-right">Time</span>
      </div>
      <div className="divide-y divide-sf-border-faint px-4 pb-1">
        {rows.map((phase) => (
          <div
            key={phase.label}
            className="grid gap-2 py-1.5 sm:grid-cols-[minmax(180px,0.85fr)_minmax(180px,1.35fr)_48px] sm:items-center sm:gap-4"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-sf-text">{phase.label}</p>
              <p className="mt-0.5 truncate text-[11px] text-sf-text-muted">{phase.detail}</p>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-sf-bg">
              <div
                className={`absolute h-full rounded-full ${phase.color}`}
                style={{
                  left: `${(phase.start / total) * 100}%`,
                  width: `${(phase.ms / total) * 100}%`,
                }}
              />
            </div>
            <span className="shrink-0 text-right tabular-nums text-xs font-medium text-sf-text">
              {phase.ms}ms
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const TcpRetryLadderCard = () => {
  const { retry } = mockTcpMonitor;
  return (
    <Panel>
      <TcpPanelHeader
        icon={RefreshCw}
        title="Retry ladder"
        meta={<span className="tabular-nums">{retry.attemptsNote}</span>}
      />
      <div className="divide-y divide-sf-border-faint px-4">
        {retry.attempts.map((attempt) => (
          <div key={attempt.n} className="grid grid-cols-[24px_minmax(0,1fr)_48px] items-center gap-3 py-2 sm:grid-cols-[24px_minmax(90px,1fr)_auto_48px]">
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${attempt.tone === "positive" ? "border-sf-green-border bg-sf-green-bg text-sf-green" : "border-sf-border bg-sf-bg text-sf-text-muted"}`}>
              {attempt.n}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-sf-text">{attempt.label}</span>
              <span className={`mt-0.5 block truncate text-[11px] sm:hidden ${attempt.tone === "positive" ? "text-sf-green" : "text-sf-text-muted"}`}>{attempt.status}</span>
            </span>
            <span className={`hidden text-[11px] sm:block ${attempt.tone === "positive" ? "text-sf-green" : "text-sf-text-muted"}`}>{attempt.status}</span>
            <span className="text-right tabular-nums text-xs font-medium text-sf-text">{attempt.ms}</span>
          </div>
        ))}
        <div className="grid grid-cols-[24px_minmax(90px,1fr)_auto] items-center gap-3 py-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-sf-green-border bg-sf-green-bg text-sf-green">
            <ShieldCheck className="size-3" strokeWidth={2} />
          </span>
          <span className="text-xs font-semibold text-sf-text">Result</span>
          <span className="text-[11px] font-semibold text-sf-green">{retry.result}</span>
        </div>
      </div>
      <div className="border-t border-sf-border-faint px-4">
        <FooterRow label="Connect timeout" value={retry.connectTimeout} />
        <FooterRow label="Slow threshold" value={retry.slowThreshold} />
      </div>
    </Panel>
  );
};

const TcpDistributionCard = () => {
  const max = Math.max(...mockTcpMonitor.distribution.map((d) => d.ms));
  return (
    <Panel>
      <TcpPanelHeader
        icon={BarChart3}
        tone="info"
        title="Handshake distribution"
        meta={<span className="tabular-nums">{mockTcpMonitor.distributionNote}</span>}
      />
      <div className="divide-y divide-sf-border-faint px-4 py-1">
        {mockTcpMonitor.distribution.map((d) => (
          <div key={d.label} className="flex items-center gap-4 py-1.5">
            <span className="w-8 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-sf-text-muted">{d.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sf-border-faint">
              <div className="h-full rounded-full bg-[var(--sf-protocol-accent)]" style={{ width: `${(d.ms / max) * 100}%` }} />
            </div>
            <span className="w-12 shrink-0 text-right tabular-nums text-xs font-medium text-sf-text">{d.ms}ms</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-sf-border-faint px-4 py-2 text-[11px] text-sf-text-muted">
        <span className="h-px w-5 bg-sf-amber" />
        {mockTcpMonitor.slowThresholdMs}ms slow-connection threshold
      </div>
    </Panel>
  );
};

const TcpConnectionTrendCard = () => {
  const { connectionTrend } = mockTcpMonitor;

  return (
    <Panel>
      <TcpPanelHeader
        icon={Activity}
        tone="info"
        title="Connection latency"
        meta={
          <span className="inline-flex overflow-hidden rounded-sf border border-sf-border text-[11px] font-semibold">
            {["24h", "7d", "30d"].map((range) => (
              <span
                key={range}
                className={`px-2 py-0.5 ${
                  range === "24h"
                    ? "bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]"
                    : "text-sf-text-muted"
                }`}
              >
                {range}
              </span>
            ))}
          </span>
        }
      />
      <div className="px-4 pb-2 pt-2.5">
        <TrendChart
          series={[
            { name: "p50", values: [...connectionTrend.values] },
            { name: "p95", values: connectionTrend.values.map((value) => Math.round(value * 1.45)) },
          ]}
          categories={[...connectionTrend.categories]}
          threshold={mockTcpMonitor.slowThresholdMs}
          tone="info"
          height={200}
          area={false}
        />
      </div>
      <PercentileStrip
        ariaLabel="TCP connection latency summary for the last 24 hours"
        metrics={[
          { label: "Latest", value: connectionTrend.latestMs, unit: "ms" },
          { label: "Average", value: connectionTrend.averageMs, unit: "ms" },
          { label: "p50", value: connectionTrend.p50Ms, unit: "ms", color: "var(--sf-protocol-accent)" },
          { label: "p75", value: connectionTrend.p75Ms, unit: "ms" },
          { label: "p90", value: connectionTrend.p90Ms, unit: "ms" },
          { label: "p95", value: connectionTrend.p95Ms, unit: "ms", color: "var(--sf-percentile-p95)" },
          { label: "p99", value: connectionTrend.p99Ms, unit: "ms", color: "var(--sf-percentile-p99)" },
          { label: "p99.9", value: connectionTrend.p999Ms, unit: "ms", color: "var(--sf-percentile-p999)" },
          { label: "Max", value: connectionTrend.maxMs, unit: "ms" },
        ]}
      />
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Verification & errors                                               */
/* ------------------------------------------------------------------ */

const TcpProtocolCheckCard = () => {
  const { protocolCheck } = mockTcpMonitor;
  return (
    <Panel>
      <TcpPanelHeader
        icon={ShieldCheck}
        title="Protocol check"
        meta={<Pill tone="positive">Pattern matched</Pill>}
      />
      <div className="px-4 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Bytes read from socket</p>
        <div className="mt-2 rounded-lg border border-sf-border bg-sf-bg px-3 py-2.5">
          <span className="font-mono text-[11px] font-semibold text-sf-green">{protocolCheck.banner}</span>
          <span className="ml-2 font-mono text-[11px] text-sf-text-muted">· {protocolCheck.bannerBytes}</span>
        </div>
      </div>
      <div className="divide-y divide-sf-border-faint px-4 pb-1">
        {protocolCheck.checks.map((check) => (
          <div key={check.label} className="flex items-center gap-3 py-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-sf-green-border bg-sf-green-bg text-sf-green">
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sf-text">{check.label}</p>
              <p className="mt-0.5 truncate text-[11px] text-sf-text-muted">{check.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const TcpSocketErrorsCard = () => (
  <Panel>
    <TcpPanelHeader
      icon={TriangleAlert}
      title="Socket errors"
      meta={<Pill tone="positive">None in 24h</Pill>}
    />
    <TableScroll>
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Code</th>
            <th className="px-3 py-2.5 font-semibold">Meaning</th>
            <th className="px-3 py-2.5 font-semibold">Cause</th>
            <th className="px-4 py-2.5 text-right font-semibold">24h</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockTcpMonitor.socketErrors.map((err) => (
            <tr key={err.code} className="transition-colors hover:bg-sf-bg/60">
              <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-sf-text">{err.code}</td>
              <td className="px-3 py-2.5 font-medium text-sf-text">{err.meaning}</td>
              <td className="px-3 py-2.5 text-sf-text-muted">{err.cause}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sf-text-muted">{err.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Regional reachability (multi-region — blurred / coming-soon)        */
/* ------------------------------------------------------------------ */

const TcpRegionCard = () => {
  const max = Math.max(...mockTcpMonitor.perRegion.map((r) => r.connectMs));
  return (
    <Panel>
      <TcpPanelHeader
        icon={MapPin}
        tone="info"
        title="Port reachability by region"
        meta={<ComingSoon />}
      />
      <div className="relative overflow-hidden">
        <BlurredContent>
          <TableScroll>
            <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-sf-border bg-sf-bg/70 text-[10px] uppercase tracking-[0.1em] text-sf-text-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Region</th>
                <th className="px-3 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">SYN-ACK</th>
                <th className="px-3 py-2.5 font-semibold">Connect</th>
                <th className="px-4 py-2.5 text-right font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sf-border-faint">
              {mockTcpMonitor.perRegion.map((row) => (
                <tr key={row.region}>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2 font-medium text-sf-text">
                      <span className="size-2 rounded-full bg-sf-green" />
                      {row.region}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-sf-text-muted">{row.location}</td>
                  <td className="px-3 py-2.5 text-sf-green">yes</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-sf-border-faint">
                        <div className="h-full rounded-full bg-[var(--sf-protocol-accent)]" style={{ width: `${(row.connectMs / max) * 100}%` }} />
                      </div>
                      <span className="tabular-nums text-sf-text-muted">{row.connectMs}ms</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right"><Pill tone="positive">Open</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          </TableScroll>
        </BlurredContent>
        <div className="absolute inset-0 flex items-center justify-center bg-sf-surface/90 p-6">
          <div className="max-w-sm px-5 py-4 text-center">
            <MapPin className="mx-auto size-5 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-sf-text">Regional probes are coming soon</p>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">
              Per-region reachability and latency will appear here when multi-region monitoring is available.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

/* Single-region uptime strip — buildable in V7 (one cell per recent check for
   THIS monitor). The per-region version lands with multi-region monitoring. */
const TcpUptimeStripCard = () => (
  <Panel>
    <TcpPanelHeader
      icon={LayoutGrid}
      title="Connect results"
      meta={<span className="tabular-nums">One cell per check · Last 24h</span>}
    />
    <div className="px-4 py-3">
      <div className="flex gap-1" aria-label="48 successful TCP connection checks">
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="h-5 min-w-1 flex-1 rounded-[3px] bg-sf-green" />
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-sf-text-muted">
        <span>24h ago</span>
        <span>12h ago</span>
        <span>now</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sf-border-faint pt-2.5 text-[11px] text-sf-text-muted">
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-[3px] bg-sf-green" /> Operational</span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-[3px] bg-sf-amber" /> Degraded</span>
        <span className="flex items-center gap-2"><span className="size-2.5 rounded-[3px] bg-sf-red" /> Failing</span>
      </div>
    </div>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Operations                                                          */
/* ------------------------------------------------------------------ */

const TcpConfigCard = () => (
  <Panel>
    <TcpPanelHeader
      icon={Settings2}
      title="Port & probe configuration"
      meta="Read-only settings"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Host" mono>{mockTcpMonitor.config.host}</KeyValue>
        <KeyValue label="Resolved address" mono>{mockTcpMonitor.config.resolvedAddress}</KeyValue>
        <KeyValue label="Connect timeout">{mockTcpMonitor.config.connectTimeout}</KeyValue>
        <KeyValue label="Slow threshold">{mockTcpMonitor.config.slowThreshold}</KeyValue>
        <KeyValue label="Expected pattern" mono>{mockTcpMonitor.config.expectedPattern}</KeyValue>
      </KeyValueList>
      <KeyValueList className="[&>div]:py-2.5 [&>div>dd]:!text-xs [&>div>dt]:!text-xs">
        <KeyValue label="Port">{mockTcpMonitor.config.port}</KeyValue>
        <KeyValue label="IP version">{mockTcpMonitor.config.ipVersion}</KeyValue>
        <KeyValue label="Read timeout">{mockTcpMonitor.config.readTimeout}</KeyValue>
        <KeyValue label="Check interval">{mockTcpMonitor.config.checkInterval}</KeyValue>
        <KeyValue label="Keep-alive">{mockTcpMonitor.config.keepAlive}</KeyValue>
        <KeyValue label="Address pinning" tone="info">{mockTcpMonitor.config.addressPinning}</KeyValue>
      </KeyValueList>
    </div>
  </Panel>
);

const TcpHistoryCard = () => (
  <Panel>
    <TcpPanelHeader
      icon={History}
      title="Connection history"
      meta="State changes only · repeats collapsed"
    />
    <div className="px-4 py-1">
      {mockTcpMonitor.history.map((event, index) => (
        <div key={event.id} className="relative py-2.5 pl-8">
          {index < mockTcpMonitor.history.length - 1 ? (
            <span className="absolute bottom-0 left-[7px] top-7 w-px bg-sf-border" />
          ) : null}
          <span className={`absolute left-0 top-[18px] size-3.5 rounded-full border-[3px] border-sf-surface ${dotTone[event.tone]}`} />
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={`text-xs font-semibold ${event.tone === "warning" ? "text-sf-amber" : event.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{event.type}</p>
              <time className="font-mono text-[11px] tabular-nums text-sf-text-muted">{event.occurredAt}</time>
            </div>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const TcpAlertRulesCard = () => {
  const activeCount = mockTcpMonitor.alertRules.filter((rule) => rule.enabled).length;

  return (
    <Panel>
      <TcpPanelHeader
        icon={BellRing}
        title="TCP alert rules"
        meta={`${activeCount} of ${mockTcpMonitor.alertRules.length} active · duplicates suppressed`}
      />
      <div className="grid md:grid-cols-2">
        {mockTcpMonitor.alertRules.map((rule) => (
          <div
            key={rule.label}
            className="flex items-start gap-2.5 border-b border-sf-border-faint px-4 py-2.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-r-sf-border-faint"
          >
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${rule.enabled ? "bg-sf-green" : "border border-sf-border bg-sf-bg"}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
                <span className={`shrink-0 text-[10.5px] font-medium ${rule.enabled ? "text-sf-green" : "text-sf-text-muted"}`}>
                  {rule.enabled ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TcpMonitor = () => (
  <section id="tcp-monitoring" className="protocol-detail-theme scroll-mt-16 space-y-3">
    <TcpStatusSummary />

    <TcpSection
      icon={Zap}
      title="Connection & lifecycle"
      description="Per-phase timing of the last connection and the retry ladder that produced the verdict."
    >
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <TcpLifecycleCard />
        <TcpRetryLadderCard />
      </div>
      <div className="mt-3">
        <TcpUptimeStripCard />
      </div>
    </TcpSection>

    <TcpSection
      icon={BarChart3}
      title="Performance & verification"
      description="The 24-hour connection trend, connect-time percentiles, protocol verification, and socket errors."
    >
      <TcpConnectionTrendCard />
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <TcpDistributionCard />
        <TcpProtocolCheckCard />
      </div>
      <div className="mt-3">
        <TcpSocketErrorsCard />
      </div>
    </TcpSection>

    <TcpSection
      icon={MapPin}
      title="Regional reachability"
      description="Per-region port reachability from probes in each source network."
    >
      <TcpRegionCard />
    </TcpSection>

    <TcpSection
      icon={Activity}
      title="Operations & activity"
      description="Monitor configuration and the meaningful connection-state transitions for this port."
    >
      <TcpConfigCard />
      <div className="mt-3">
        <TcpAlertRulesCard />
      </div>
      <div className="mt-3">
        <TcpHistoryCard />
      </div>
    </TcpSection>
  </section>
);

export default TcpMonitor;
