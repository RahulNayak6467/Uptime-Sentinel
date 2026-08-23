"use client";

import type { ReactNode } from "react";
import worldMap from "@svg-maps/world";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BellRing,
  Clock3,
  Gauge,
  Globe2,
  History,
  MapPin,
  Route,
  Settings2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  KeyValue,
  KeyValueList,
  Panel,
  PercentileStrip,
  Pill,
  TableScroll,
  type HeaderStat,
  type Tone,
} from "../monitor-detail-primitives";
import { TrendChart } from "../monitor-detail-charts";

type HourlyRegionStatus = "UP" | "DEGRADED" | "DOWN";
type WorldMapLocation = { id: string; name: string; path: string };

const hourlyResults = (
  latest: HourlyRegionStatus[] = [],
): HourlyRegionStatus[] => [
  ...Array.from(
    { length: Math.max(0, 24 - latest.length) },
    () => "UP" as const,
  ),
  ...latest.slice(-24),
];

const toneIconClass: Record<Tone, string> = {
  neutral: "text-sf-text-muted",
  info: "text-[var(--sf-protocol-accent)]",
  positive: "text-sf-green",
  warning: "text-sf-amber",
  negative: "text-sf-red",
};

const RegionPanelHeader = ({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: Tone;
}) => (
  <header className="flex min-h-[42px] flex-col items-start justify-between gap-1.5 border-b border-sf-border-faint px-3.5 py-2 sm:flex-row sm:items-center sm:gap-4">
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        className={`size-3.5 shrink-0 ${toneIconClass[tone]}`}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <h3 className="truncate text-[13px] font-semibold text-sf-text">
        {title}
      </h3>
      {description ? <span className="sr-only">{description}</span> : null}
    </div>
    {action ? (
      <div className="text-left text-[11.5px] leading-relaxed text-sf-text-muted sm:shrink-0 sm:text-right">
        {action}
      </div>
    ) : null}
  </header>
);

const RegionSection = ({
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

const mockMultiRegionMonitor = {
  globalStatus: "Degraded",
  healthyRegions: 4,
  totalRegions: 6,
  reportingRegions: 6,
  requiredQuorum: 4,
  globalP95Ms: 263,
  availability30d: "99.94%",
  lastChecked: "45 seconds ago",
  nextCheck: "in 15 seconds",
  origin: {
    label: "Tokyo, JP",
    host: "api.statusforge.io",
    lat: 35.68,
    lng: 139.69,
    mapX: 850,
    mapY: 330,
  },
  // Recent global p95 across successful regions (oldest → newest, ms).
  globalLatencyTrend: [
    198, 205, 201, 210, 208, 214, 221, 236, 248, 255, 259, 263,
  ] as (number | null)[],
  globalLatencyPercentiles: {
    latestMs: 263,
    averageMs: 227,
    p50Ms: 221,
    p75Ms: 248,
    p90Ms: 263,
    p95Ms: 281,
    p99Ms: 336,
    p999Ms: 372,
    maxMs: 384,
  },
  configuration: {
    enabledRegions: "6 of 9",
    checkDistribution: "All enabled regions",
    perRegionInterval: "1 minute",
    probeTimeout: "10 seconds",
    ipVersion: "IPv4 + IPv6",
    agentVersion: "All reporting agents on v2.4.1",
    aggregationRule: "Quorum plus regional-failure detection",
    degradedAfter: "1 unhealthy region",
    downAfter: "Fewer than 4 healthy regions",
    percentileWindow: "Rolling 24 hours",
    retainedChecks: "30 days",
  },
  failureConfirmation: {
    downVotes: 1,
    downVoteQuorum: 3,
    retries: "3 attempts",
    retryDelay: "20 seconds",
    notificationDelay: "1 minute after confirmation",
    singleRegionFailure: "Logged; regional notification optional",
    globalOutage: "3 of 6 regions failing",
  },
  regionalSpread: {
    fastest: { code: "AP-South", value: 118 },
    slowest: { code: "SA-East", value: 287 },
    spreadMs: 169,
    jitterMs: 12,
    consistency: "5 reporting regions within 2.5× of the fastest",
    baselineDeviation: "+3% vs 7-day baseline",
    slowestAlert: "Fires above 3× the regional median",
  },
  regions: [
    {
      id: "ap-south",
      name: "Mumbai",
      code: "AP-South",
      provider: "AWS ap-south-1",
      status: "UP",
      latencyMs: 118,
      p50Ms: 118,
      p95Ms: 165,
      p99Ms: 182,
      p999Ms: 194,
      statusCode: 200,
      availability: { h24: "100.00%", d7: "100.00%", d30: "99.99%" },
      error: null,
      phases: { dns: 9, tcp: 17, tls: 31, ttfb: 61, total: 118 },
      hourlyResults: hourlyResults(),
    },
    {
      id: "ap-southeast",
      name: "Singapore",
      code: "AP-Southeast",
      provider: "GCP asia-southeast1",
      status: "UP",
      latencyMs: 142,
      p50Ms: 142,
      p95Ms: 198,
      p99Ms: 224,
      p999Ms: 242,
      statusCode: 200,
      availability: { h24: "100.00%", d7: "99.98%", d30: "99.97%" },
      error: null,
      phases: { dns: 11, tcp: 20, tls: 38, ttfb: 73, total: 142 },
      hourlyResults: hourlyResults(),
    },
    {
      id: "eu-central",
      name: "Frankfurt",
      code: "EU-Central",
      provider: "AWS eu-central-1",
      status: "UP",
      latencyMs: 187,
      p50Ms: 174,
      p95Ms: 226,
      p99Ms: 262,
      p999Ms: 289,
      statusCode: 200,
      availability: { h24: "100.00%", d7: "99.97%", d30: "99.95%" },
      error: null,
      phases: { dns: 13, tcp: 25, tls: 47, ttfb: 102, total: 187 },
      hourlyResults: hourlyResults(),
    },
    {
      id: "us-east",
      name: "Virginia",
      code: "US-East",
      provider: "AWS us-east-1",
      status: "DOWN",
      latencyMs: null,
      p50Ms: null,
      p95Ms: null,
      p99Ms: null,
      p999Ms: null,
      statusCode: null,
      availability: { h24: "79.17%", d7: "99.60%", d30: "99.71%" },
      error: "Request timed out after 10 seconds",
      phases: { dns: 18, tcp: null, tls: null, ttfb: null, total: null },
      hourlyResults: hourlyResults(["DOWN", "DOWN", "DOWN", "DOWN", "DOWN"]),
    },
    {
      id: "us-west",
      name: "Oregon",
      code: "US-West",
      provider: "GCP us-west1",
      status: "UP",
      latencyMs: 231,
      p50Ms: 161,
      p95Ms: 212,
      p99Ms: 249,
      p999Ms: 276,
      statusCode: 200,
      availability: { h24: "100.00%", d7: "99.98%", d30: "99.95%" },
      error: null,
      phases: { dns: 16, tcp: 31, tls: 55, ttfb: 129, total: 231 },
      hourlyResults: hourlyResults(),
    },
    {
      id: "sa-east",
      name: "São Paulo",
      code: "SA-East",
      provider: "AWS sa-east-1",
      status: "DEGRADED",
      latencyMs: 487,
      p50Ms: 287,
      p95Ms: 352,
      p99Ms: 421,
      p999Ms: 468,
      statusCode: 200,
      availability: { h24: "100.00%", d7: "99.96%", d30: "99.86%" },
      error: "Response exceeded the 400ms latency threshold",
      phases: { dns: 24, tcp: 48, tls: 83, ttfb: 332, total: 487 },
      hourlyResults: hourlyResults([
        "DEGRADED",
        "DEGRADED",
        "UP",
        "DEGRADED",
        "DEGRADED",
        "DEGRADED",
      ]),
    },
  ],
  incidents: [
    {
      id: "region-event-1",
      title: "US-East became unavailable",
      description: "Five consecutive checks timed out from Virginia.",
      occurredAt: "Jul 25, 2026 · 14:08 IST",
      status: "Active",
    },
    {
      id: "region-event-2",
      title: "SA-East latency degraded",
      description: "Regional latency crossed the configured 400ms threshold.",
      occurredAt: "Jul 25, 2026 · 13:54 IST",
      status: "Active",
    },
    {
      id: "region-event-3",
      title: "EU-Central recovered",
      description: "Frankfurt returned to normal after two failed checks.",
      occurredAt: "Jul 24, 2026 · 18:31 IST",
      status: "Recovered",
    },
  ],
  alertRules: [
    { label: "Quorum failure", description: "Enough regions agree that the monitor is down.", enabled: true },
    { label: "Single region down", description: "One probe fails; notification remains optional.", enabled: true },
    { label: "Regional slowdown", description: "A region exceeds 3× the regional median latency.", enabled: true },
    { label: "Region disagreement", description: "Regions return different status codes or response hashes.", enabled: true },
    { label: "Agent offline", description: "A regional probe stops reporting independently of target health.", enabled: true },
    { label: "Regional recovery", description: "A failed or degraded region becomes healthy again.", enabled: true },
  ],
  // Approximate probe coordinates for the geographic distribution map.
  geo: {
    "ap-south": { lat: 19.07, lng: 72.87, x: 668, y: 375 },
    "ap-southeast": { lat: 1.35, lng: 103.82, x: 720, y: 418 },
    "eu-central": { lat: 50.11, lng: 8.68, x: 500, y: 292 },
    "us-east": { lat: 39.04, lng: -77.49, x: 236, y: 321 },
    "us-west": { lat: 44.0, lng: -121.0, x: 155, y: 300 },
    "sa-east": { lat: -23.55, lng: -46.63, x: 316, y: 455 },
  } as Record<string, { lat: number; lng: number; x: number; y: number }>,
  // Body-hash comparison: are all regions serving identical content?
  bodyConsistency: {
    expectedHash: "9f2c4d…a4e1",
    expectedBytes: 1482,
    summary: "5 of 6 regions returned identical content; US-East is unreachable.",
    completedMatches: "5 of 5 completed responses",
    comparisonMethod: "SHA-256 body digest + response size",
    comparisonWindow: "Latest synchronized check batch",
    regions: [
      { id: "ap-south", code: "AP-South", hash: "9f2c4d…a4e1", bytes: 1482, matches: true },
      { id: "ap-southeast", code: "AP-Southeast", hash: "9f2c4d…a4e1", bytes: 1482, matches: true },
      { id: "eu-central", code: "EU-Central", hash: "9f2c4d…a4e1", bytes: 1482, matches: true },
      { id: "us-east", code: "US-East", hash: "—", bytes: null, matches: false },
      { id: "us-west", code: "US-West", hash: "9f2c4d…a4e1", bytes: 1482, matches: true },
      { id: "sa-east", code: "SA-East", hash: "9f2c4d…a4e1", bytes: 1482, matches: true },
    ],
  },
} as const;

const LATENCY_THRESHOLD_MS = 400;

type RegionStatus = (typeof mockMultiRegionMonitor.regions)[number]["status"];

const statusTone: Record<RegionStatus, Tone> = {
  UP: "positive",
  DEGRADED: "warning",
  DOWN: "negative",
};

const statusDot: Record<RegionStatus, string> = {
  UP: "bg-sf-green",
  DEGRADED: "bg-sf-amber",
  DOWN: "bg-sf-red",
};

const statusText: Record<RegionStatus, string> = {
  UP: "text-sf-green",
  DEGRADED: "text-sf-amber",
  DOWN: "text-sf-red",
};

const rowTint: Record<RegionStatus, string> = {
  UP: "",
  DEGRADED: "bg-sf-amber-bg/30",
  DOWN: "bg-sf-red-bg/30",
};

const headerStats: HeaderStat[] = [
  {
    label: "Reporting",
    value: `${mockMultiRegionMonitor.reportingRegions}/${mockMultiRegionMonitor.totalRegions}`,
    hint: "all probe agents online",
  },
  { label: "Healthy", value: `${mockMultiRegionMonitor.healthyRegions}/${mockMultiRegionMonitor.totalRegions}`, hint: `quorum ${mockMultiRegionMonitor.requiredQuorum}` },
  { label: "Global p95", value: `${mockMultiRegionMonitor.globalP95Ms}ms`, hint: "healthy regions" },
  { label: "Fastest p50", value: `${mockMultiRegionMonitor.regionalSpread.fastest.value}ms`, hint: mockMultiRegionMonitor.regionalSpread.fastest.code },
  { label: "Regional spread", value: `${mockMultiRegionMonitor.regionalSpread.spreadMs}ms`, hint: "slowest minus fastest" },
  { label: "30d availability", value: mockMultiRegionMonitor.availability30d, hint: "all regions" },
];

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

const RegionStatusSummary = () => (
  <div className="space-y-2.5">
    <Panel className="relative bg-sf-surface">
      <div className="flex flex-col gap-3 px-[18px] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-sf-amber-border bg-sf-amber-bg text-sf-amber">
            <Globe2 className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
                Regional degradation detected
              </h1>
              <Pill tone="warning" dot>{mockMultiRegionMonitor.globalStatus}</Pill>
              <Pill tone="neutral">V12 frontend preview</Pill>
            </div>
            <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
              {mockMultiRegionMonitor.origin.host} · configured origin {mockMultiRegionMonitor.origin.label}
            </p>
            <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
              The global quorum still passes, but US-East is unavailable and SA-East exceeds the latency threshold.
            </p>
          </div>
        </div>
        <dl className="grid shrink-0 grid-cols-2 divide-x divide-sf-border-faint">
          <div className="min-w-32 px-4 py-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Last check</dt>
            <dd className="mt-1.5 text-xs font-medium text-sf-text">{mockMultiRegionMonitor.lastChecked}</dd>
          </div>
          <div className="min-w-32 px-4 py-1">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">Next check</dt>
            <dd className="mt-1.5 text-xs font-medium text-[var(--sf-protocol-accent)]">{mockMultiRegionMonitor.nextCheck}</dd>
          </div>
        </dl>
      </div>
    </Panel>

    <Panel>
      <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
        {headerStats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
            <dt className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-sf-text-muted">{stat.label}</dt>
            <dd className="mt-1.5 truncate text-[21px] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums text-sf-text">{stat.value}</dd>
            {stat.hint ? <dd className="mt-1 text-[11.5px] leading-relaxed text-sf-text-muted">{stat.hint}</dd> : null}
          </div>
        ))}
      </dl>
    </Panel>
  </div>
);

const RegionHealthTable = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={Globe2}
      tone="warning"
      title="Regional health"
      description="Latest independent result and probe-agent state from every location"
      action={mockMultiRegionMonitor.lastChecked}
    />
    <TableScroll>
      <table className="w-full min-w-[760px] text-left text-xs">
        <thead className="border-b border-sf-border bg-sf-bg text-[11px] uppercase tracking-wide text-sf-text-muted">
          <tr>
            <th className="px-5 py-2.5 font-semibold">Region</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
            <th className="px-3 py-2.5 font-semibold">Latency</th>
            <th className="px-3 py-2.5 font-semibold">HTTP</th>
            <th className="px-3 py-2.5 font-semibold">30d</th>
            <th className="px-5 py-2.5 font-semibold">Probe detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockMultiRegionMonitor.regions.map((region) => (
            <tr key={region.id} className={rowTint[region.status]}>
              <td className="px-5 py-3">
                <p className="font-semibold text-sf-text">{region.name}</p>
                <p className="mt-0.5 text-[11px] text-sf-text-muted">
                  {region.code} · {region.provider}
                </p>
              </td>
              <td className="px-3 py-3">
                <Pill tone={statusTone[region.status]} dot>
                  {region.status}
                </Pill>
              </td>
              <td className={`px-3 py-3 tabular-nums ${statusText[region.status]}`}>
                {region.latencyMs === null ? "Failed" : `${region.latencyMs}ms`}
              </td>
              <td className="px-3 py-3 tabular-nums text-sf-text-muted">
                {region.statusCode ?? "—"}
              </td>
              <td className="px-3 py-3 tabular-nums text-sf-text">{region.availability.d30}</td>
              <td className="max-w-64 px-5 py-3 text-[11px] leading-relaxed text-sf-text-muted">
                {region.error ?? `Agent reporting · ${region.provider}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const HourlyResultsCard = () => (
  <Panel>
    <RegionPanelHeader
      icon={Activity}
      title="Check results by region"
      description="One aggregate cell per hour; the worst result in the hour wins"
      action="Last 24 hours"
    />
    <div className="space-y-2.5 px-4 py-3.5">
      {mockMultiRegionMonitor.regions.map((region) => (
        <div
          key={region.id}
          className="grid grid-cols-[82px_minmax(0,1fr)] items-center gap-3"
        >
          <span className="truncate text-[11.5px] font-medium text-sf-text-muted">
            {region.code}
          </span>
          <div className="grid grid-cols-[repeat(24,minmax(4px,1fr))] gap-1">
            {region.hourlyResults.map((status, hour) => (
              <span
                key={`${region.id}-${hour}`}
                title={`${region.code} · ${24 - hour}h ago · ${status}`}
                className={`h-5 rounded-[2px] ${statusDot[status]}`}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[82px_minmax(0,1fr)] gap-3 pt-0.5 text-[10.5px] text-sf-text-muted">
        <span />
        <div className="flex justify-between">
          <span>24h ago</span>
          <span>12h ago</span>
          <span>now</span>
        </div>
      </div>
    </div>
  </Panel>
);

const AvailabilityByRegionCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={BarChart3}
      title="Availability by region"
      description="Successful checks divided by completed checks in each reporting window"
      action="30d target · 99.9%"
    />
    <TableScroll>
      <table className="w-full min-w-[430px] text-xs">
        <thead className="border-b border-sf-border-faint bg-sf-bg text-[10.5px] uppercase tracking-[0.08em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Region</th>
            <th className="px-3 py-2 text-right font-semibold">24h</th>
            <th className="px-3 py-2 text-right font-semibold">7d</th>
            <th className="px-4 py-2 text-right font-semibold">30d</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockMultiRegionMonitor.regions.map((region) => (
            <tr key={region.id}>
              <td className="px-4 py-2.5 font-medium text-sf-text">{region.code}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text">{region.availability.h24}</td>
              <td className="px-3 py-2.5 text-right tabular-nums text-sf-text">{region.availability.d7}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-sf-text">{region.availability.d30}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
    <KeyValueList className="border-t border-sf-border-faint !px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
      <KeyValue label="Fleet availability">{mockMultiRegionMonitor.availability30d}</KeyValue>
      <KeyValue label="Lowest region">US-East · 99.71%</KeyValue>
      <KeyValue label="Below 99.9% target" tone="warning">2 regions</KeyValue>
    </KeyValueList>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Global latency trend (real chart)                                   */
/* ------------------------------------------------------------------ */

const GlobalLatencyTrendCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={Activity}
      tone="info"
      title="Global latency trend"
      description="Aggregated latency across healthy regions over the last 24 hours"
      action={<span className="tabular-nums">2,880 checks · {LATENCY_THRESHOLD_MS}ms threshold</span>}
    />
    <div className="px-4 pb-2 pt-3 sm:px-5">
      <TrendChart
        series={[
          { name: "p50", values: [...mockMultiRegionMonitor.globalLatencyTrend] },
          { name: "p95", values: mockMultiRegionMonitor.globalLatencyTrend.map((value) => value === null ? null : Math.round(value * 1.25)) },
        ]}
        threshold={LATENCY_THRESHOLD_MS}
        tone="warning"
        height={220}
      />
    </div>
    <PercentileStrip
      ariaLabel="Global multi-region latency summary for the last 24 hours"
      metrics={[
        { label: "Latest", value: mockMultiRegionMonitor.globalLatencyPercentiles.latestMs, unit: "ms" },
        { label: "Average", value: mockMultiRegionMonitor.globalLatencyPercentiles.averageMs, unit: "ms" },
        { label: "p50", value: mockMultiRegionMonitor.globalLatencyPercentiles.p50Ms, unit: "ms", color: "var(--sf-protocol-accent)" },
        { label: "p75", value: mockMultiRegionMonitor.globalLatencyPercentiles.p75Ms, unit: "ms" },
        { label: "p90", value: mockMultiRegionMonitor.globalLatencyPercentiles.p90Ms, unit: "ms" },
        { label: "p95", value: mockMultiRegionMonitor.globalLatencyPercentiles.p95Ms, unit: "ms", color: "var(--sf-percentile-p95)" },
        { label: "p99", value: mockMultiRegionMonitor.globalLatencyPercentiles.p99Ms, unit: "ms", color: "var(--sf-percentile-p99)" },
        { label: "p99.9", value: mockMultiRegionMonitor.globalLatencyPercentiles.p999Ms, unit: "ms", color: "var(--sf-percentile-p999)" },
        { label: "Max", value: mockMultiRegionMonitor.globalLatencyPercentiles.maxMs, unit: "ms" },
      ]}
    />
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Aggregation decision + comparisons                                  */
/* ------------------------------------------------------------------ */

const FailureConfirmationCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={ShieldCheck}
      tone="warning"
      title="Failure confirmation"
      description="How regional votes, retries, and delay rules produce one global decision"
      action={
        <span className="tabular-nums">
          {mockMultiRegionMonitor.failureConfirmation.downVotes} down · {mockMultiRegionMonitor.failureConfirmation.downVoteQuorum} required
        </span>
      }
    />
    <div className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-2">
        {mockMultiRegionMonitor.regions.map((region) => (
          <div
            key={region.id}
            className="flex min-w-[92px] flex-1 items-center gap-2 rounded-md border border-sf-border bg-sf-bg px-3 py-2.5"
          >
            <span className={`size-2 rounded-full ${statusDot[region.status]}`} />
            <div>
              <p className="text-[11px] font-semibold text-sf-text">{region.code}</p>
              <p className={`mt-0.5 text-[11px] font-semibold ${statusText[region.status]}`}>
                {region.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-sf-amber-border bg-sf-amber-bg px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sf-amber" />
          <div>
            <p className="text-xs font-semibold text-sf-amber">
              Quorum satisfied, but regional impact detected
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-sf-text-muted">
              Four regions are healthy, so the service is not globally down. US-East
              is unavailable and SA-East is slow, producing a DEGRADED global state.
            </p>
          </div>
        </div>
      </div>
    </div>
    <KeyValueList className="border-t border-sf-border-faint !px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
      <KeyValue label="Confirmation quorum">{mockMultiRegionMonitor.failureConfirmation.downVoteQuorum} of {mockMultiRegionMonitor.totalRegions} regions must agree</KeyValue>
      <KeyValue label="Current vote" tone="warning">{mockMultiRegionMonitor.failureConfirmation.downVotes} down · quorum not reached</KeyValue>
      <KeyValue label="Retries before failing">{mockMultiRegionMonitor.failureConfirmation.retries}</KeyValue>
      <KeyValue label="Retry delay">{mockMultiRegionMonitor.failureConfirmation.retryDelay}</KeyValue>
      <KeyValue label="Notification delay">{mockMultiRegionMonitor.failureConfirmation.notificationDelay}</KeyValue>
      <KeyValue label="Single-region failures">{mockMultiRegionMonitor.failureConfirmation.singleRegionFailure}</KeyValue>
      <KeyValue label="Escalate to global outage">{mockMultiRegionMonitor.failureConfirmation.globalOutage}</KeyValue>
    </KeyValueList>
  </Panel>
);

const RegionalLatencyCard = () => {
  const maxLatency = Math.max(
    ...mockMultiRegionMonitor.regions.map((region) => region.p999Ms ?? 0),
  );
  return (
    <Panel className="h-full">
      <RegionPanelHeader
        icon={Gauge}
        title="Latency by region"
        description="Median and tail latency from completed checks in the last 24 hours"
        action="p50 · p95 · p99 · p99.9"
      />
      <div className="space-y-3 px-4 py-3.5">
        {mockMultiRegionMonitor.regions.map((region) => {
          const p50Width = region.p50Ms === null ? 0 : (region.p50Ms / maxLatency) * 100;
          const p95Width = region.p95Ms === null ? 0 : (region.p95Ms / maxLatency) * 100;
          const p99Width = region.p99Ms === null ? 0 : (region.p99Ms / maxLatency) * 100;
          const p999Width = region.p999Ms === null ? 0 : (region.p999Ms / maxLatency) * 100;
          return (
            <div key={region.id}>
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 truncate text-xs font-medium text-sf-text-muted">
                  <i className={`size-1.5 shrink-0 rounded-full ${statusDot[region.status]}`} />
                  {region.code}
                </span>
                {region.p50Ms === null ? (
                  <span className="shrink-0 text-[11px] font-medium text-sf-text-muted">No completed checks</span>
                ) : (
                  <span className="flex max-w-[70%] flex-wrap justify-end gap-x-2.5 gap-y-1 tabular-nums text-[10.5px] font-medium text-sf-text">
                    <span><i className="not-italic text-sf-text-muted">p50</i> {region.p50Ms}ms</span>
                    <span><i className="not-italic text-sf-text-muted">p95</i> {region.p95Ms}ms</span>
                    <span><i className="not-italic text-sf-text-muted">p99</i> {region.p99Ms}ms</span>
                    <span><i className="not-italic text-sf-text-muted">p99.9</i> {region.p999Ms}ms</span>
                  </span>
                )}
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-sf-border-faint">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--sf-protocol-accent)] opacity-15"
                  style={{ width: `${p999Width}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--sf-protocol-accent)] opacity-25"
                  style={{ width: `${p99Width}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--sf-protocol-accent)] opacity-40"
                  style={{ width: `${p95Width}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--sf-protocol-accent)]"
                  style={{ width: `${p50Width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const RegionalSpreadCard = () => {
  const { regionalSpread } = mockMultiRegionMonitor;
  const metrics = [
    { label: "Fastest region", value: `${regionalSpread.fastest.value}ms`, context: regionalSpread.fastest.code, accent: true },
    { label: "Slowest region", value: `${regionalSpread.slowest.value}ms`, context: regionalSpread.slowest.code },
    { label: "Spread", value: `${regionalSpread.spreadMs}ms`, context: "maximum minus minimum" },
    { label: "Cross-region jitter", value: `${regionalSpread.jitterMs}ms`, context: "p50 sample variation" },
  ];

  return (
    <Panel className="h-full">
      <RegionPanelHeader
        icon={Activity}
        title="Regional spread"
        description="How widely latency differs across reporting regions"
        action="p50 · last 24h"
      />
      <div className="grid grid-cols-2 gap-px bg-sf-border-faint p-px">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-sf-surface px-4 py-3">
            <p className="text-[10.5px] font-medium text-sf-text-muted">{metric.label}</p>
            <p className={`mt-1 text-xl font-semibold tabular-nums ${metric.accent ? "text-[var(--sf-protocol-accent)]" : "text-sf-text"}`}>{metric.value}</p>
            <p className="mt-1 text-[11px] text-sf-text-muted">{metric.context}</p>
          </div>
        ))}
      </div>
      <KeyValueList className="!px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
        <KeyValue label="Consistency">{regionalSpread.consistency}</KeyValue>
        <KeyValue label="Baseline deviation">{regionalSpread.baselineDeviation}</KeyValue>
        <KeyValue label="Slowest-region alert">{regionalSpread.slowestAlert}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

const PhaseBreakdownCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={Route}
      title="Request phase breakdown"
      description="Where each region spent time during its latest check"
      action="Milliseconds"
    />
    <TableScroll>
      <table className="w-full min-w-[560px] text-xs">
        <thead className="border-b border-sf-border bg-sf-bg text-[11px] uppercase tracking-wide text-sf-text-muted">
          <tr>
            <th className="px-5 py-2.5 text-left font-semibold">Region</th>
            <th className="px-3 py-2.5 text-right font-semibold">DNS</th>
            <th className="px-3 py-2.5 text-right font-semibold">TCP</th>
            <th className="px-3 py-2.5 text-right font-semibold">TLS</th>
            <th className="px-3 py-2.5 text-right font-semibold">TTFB</th>
            <th className="px-5 py-2.5 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockMultiRegionMonitor.regions.map((region) => (
            <tr key={region.id}>
              <td className="px-5 py-3 font-medium text-sf-text">{region.code}</td>
              {(["dns", "tcp", "tls", "ttfb", "total"] as const).map((phase) => (
                <td
                  key={phase}
                  className="px-3 py-3 text-right tabular-nums text-sf-text-muted last:px-5 last:font-semibold last:text-sf-text"
                >
                  {region.phases[phase] === null ? "—" : region.phases[phase]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const RegionBodyConsistencyCard = () => {
  const { bodyConsistency } = mockMultiRegionMonitor;
  return (
    <Panel className="h-full">
      <RegionPanelHeader
        icon={ShieldCheck}
        tone="warning"
        title="Response consistency"
        description="Body-hash comparison to catch regions serving different content"
        action={<span className="font-mono">Expected {bodyConsistency.expectedHash}</span>}
      />
      <div className="flex items-start gap-3 border-b border-sf-border-faint bg-sf-amber-bg/40 px-5 py-3.5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sf-amber" />
        <p className="text-[11px] leading-relaxed text-sf-text-muted">
          {bodyConsistency.summary}
        </p>
      </div>
      <TableScroll>
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead className="border-b border-sf-border bg-sf-bg text-[11px] uppercase tracking-wide text-sf-text-muted">
            <tr>
              <th className="px-5 py-2.5 font-semibold">Region</th>
              <th className="px-3 py-2.5 font-semibold">Body hash</th>
              <th className="px-3 py-2.5 text-right font-semibold">Bytes</th>
              <th className="px-5 py-2.5 text-right font-semibold">Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {bodyConsistency.regions.map((region) => (
              <tr key={region.id} className={region.matches ? "" : "bg-sf-red-bg/30"}>
                <td className="px-5 py-3 font-medium text-sf-text">{region.code}</td>
                <td className="px-3 py-3 font-mono text-[11px] text-sf-text-muted">
                  {region.hash}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-sf-text-muted">
                  {region.bytes === null ? "—" : region.bytes}
                </td>
                <td className="px-5 py-3 text-right">
                  <Pill tone={region.matches ? "positive" : "negative"}>
                    {region.matches ? "Match" : "No response"}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
      <KeyValueList className="border-t border-sf-border-faint !px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
        <KeyValue label="Completed matches" tone="positive">{bodyConsistency.completedMatches}</KeyValue>
        <KeyValue label="Comparison method">{bodyConsistency.comparisonMethod}</KeyValue>
        <KeyValue label="Comparison window">{bodyConsistency.comparisonWindow}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Aside — geographic map + configuration                              */
/* ------------------------------------------------------------------ */

const mapStatusFill: Record<RegionStatus, string> = {
  UP: "var(--color-sf-green)",
  DEGRADED: "var(--color-sf-amber)",
  DOWN: "var(--color-sf-red)",
};

const connectionArc = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  index: number,
) => {
  const midpointX = (from.x + to.x) / 2;
  const lift = 52 + Math.abs(to.x - from.x) * 0.12 + index * 3;
  const controlY = Math.min(from.y, to.y) - lift;

  return `M ${from.x} ${from.y} Q ${midpointX} ${controlY} ${to.x} ${to.y}`;
};

const RegionMapCard = () => {
  const originPoint = {
    x: mockMultiRegionMonitor.origin.mapX,
    y: mockMultiRegionMonitor.origin.mapY,
  };

  return (
    <Panel>
      <RegionPanelHeader
        icon={MapPin}
        tone="info"
        title="Probe network"
        description="Configured probe locations and their latest reporting state"
        action={<Pill tone="positive">{mockMultiRegionMonitor.reportingRegions} of {mockMultiRegionMonitor.totalRegions} reporting</Pill>}
      />
      <div className="px-4 py-3.5">
        <div className="relative aspect-[1010/545] w-full overflow-hidden rounded-[10px] border border-[#202329] bg-[radial-gradient(circle_at_74%_43%,#101a1b_0%,#090b0d_38%,#060708_78%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
          <svg
            viewBox="0 55 1010 545"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 size-full"
            role="img"
            aria-labelledby="regional-map-title regional-map-description"
          >
            <title id="regional-map-title">Global probe network</title>
            <desc id="regional-map-description">
              Accurate country outlines with six regional probe locations connected to the configured origin in Tokyo. Connections are logical checks, not measured network routes.
            </desc>
            <defs>
              <radialGradient id="origin-glow">
                <stop offset="0%" stopColor="var(--sf-protocol-accent)" stopOpacity="0.34" />
                <stop offset="100%" stopColor="var(--sf-protocol-accent)" stopOpacity="0" />
              </radialGradient>
              <filter id="marker-shadow" x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            <circle cx={originPoint.x} cy={originPoint.y} r="82" fill="url(#origin-glow)" />

            <g stroke="#30343b" strokeWidth="0.65" vectorEffect="non-scaling-stroke">
              {worldMap.locations.map((country: WorldMapLocation) => (
                <path
                  key={country.id}
                  d={country.path}
                  fill={country.id === "jp" ? "#242a34" : "#17191e"}
                >
                  <title>{country.name}</title>
                </path>
              ))}
            </g>

            <g fill="none" strokeLinecap="round">
              {mockMultiRegionMonitor.regions.map((region, index) => {
                const coord = mockMultiRegionMonitor.geo[region.id];
                if (!coord) return null;
                const arc = connectionArc(coord, originPoint, index);
                return (
                  <g key={region.id}>
                    <path
                      d={arc}
                      stroke="var(--sf-protocol-accent)"
                      strokeWidth="4"
                      opacity="0.08"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={arc}
                      stroke="var(--sf-protocol-accent)"
                      strokeWidth="1.25"
                      strokeDasharray="4 5"
                      opacity="0.42"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </g>

            <g filter="url(#marker-shadow)">
              {mockMultiRegionMonitor.regions.map((region) => {
                const coord = mockMultiRegionMonitor.geo[region.id];
                if (!coord) return null;
                const fill = mapStatusFill[region.status];
                return (
                  <g
                    key={region.id}
                    role="img"
                    aria-label={`${region.code}: ${region.status}`}
                  >
                    <title>{region.code} · {region.name} · {region.status}</title>
                    <circle cx={coord.x} cy={coord.y} r="10" fill={fill} opacity="0.12" />
                    {region.status !== "UP" ? (
                      <circle cx={coord.x} cy={coord.y} r="8" fill="none" stroke={fill} strokeWidth="1.2" opacity="0.55" />
                    ) : null}
                    <circle cx={coord.x} cy={coord.y} r="4.5" fill={fill} stroke="#070809" strokeWidth="2.5" />
                    <text
                      x={coord.x}
                      y={coord.y + 18}
                      textAnchor="middle"
                      fill="#989da6"
                      fontSize="10.5"
                      fontWeight="550"
                    >
                      {region.code}
                    </text>
                  </g>
                );
              })}
            </g>

            <g filter="url(#marker-shadow)">
              <circle cx={originPoint.x} cy={originPoint.y} r="13" fill="var(--sf-protocol-accent)" opacity="0.14" />
              <rect
                x={originPoint.x - 5}
                y={originPoint.y - 5}
                width="10"
                height="10"
                rx="1"
                fill="#f7f8f8"
                stroke="#070809"
                strokeWidth="2"
                transform={`rotate(45 ${originPoint.x} ${originPoint.y})`}
              />
              <text
                x={originPoint.x - 14}
                y={originPoint.y - 13}
                textAnchor="end"
                fill="#f7f8f8"
                fontSize="11"
                fontWeight="650"
              >
                {mockMultiRegionMonitor.origin.label}
              </text>
            </g>
          </svg>
        </div>
        <div className="mt-3 flex flex-col gap-2 text-[10.5px] text-sf-text-muted xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-sf-green" /> Operational</span>
            <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-sf-amber" /> Degraded</span>
            <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-sf-red" /> Failing</span>
            <span className="flex items-center gap-1.5"><i className="size-2 rotate-45 border border-sf-text bg-sf-text" /> Configured origin</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 xl:justify-end">
            <span>Logical checks, not measured network routes</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/world"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--sf-protocol-accent)] hover:underline"
            >
              Map geometry · CC BY 4.0
            </a>
          </div>
        </div>
      </div>
    </Panel>
  );
};

const RegionConfigurationCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={Settings2}
      title="Regional configuration"
      description="Read-only preview of probe scheduling, runtime, and aggregation"
      action={mockMultiRegionMonitor.configuration.agentVersion}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
      <KeyValueList className="!px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
        <KeyValue label="Enabled regions">{mockMultiRegionMonitor.configuration.enabledRegions}</KeyValue>
        <KeyValue label="Check distribution">{mockMultiRegionMonitor.configuration.checkDistribution}</KeyValue>
        <KeyValue label="Per-region interval">{mockMultiRegionMonitor.configuration.perRegionInterval}</KeyValue>
        <KeyValue label="Probe timeout">{mockMultiRegionMonitor.configuration.probeTimeout}</KeyValue>
        <KeyValue label="Percentile window">{mockMultiRegionMonitor.configuration.percentileWindow}</KeyValue>
      </KeyValueList>
      <KeyValueList className="!px-4 [&>div]:!py-2 [&>div>dd]:!text-[12px] [&>div>dt]:!text-xs">
        <KeyValue label="IP version">{mockMultiRegionMonitor.configuration.ipVersion}</KeyValue>
        <KeyValue label="Aggregation">{mockMultiRegionMonitor.configuration.aggregationRule}</KeyValue>
        <KeyValue label="Degraded when">{mockMultiRegionMonitor.configuration.degradedAfter}</KeyValue>
        <KeyValue label="Down when">{mockMultiRegionMonitor.configuration.downAfter}</KeyValue>
        <KeyValue label="Check retention">{mockMultiRegionMonitor.configuration.retainedChecks}</KeyValue>
      </KeyValueList>
    </div>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

const RegionIncidentCard = () => (
  <Panel className="h-full">
    <RegionPanelHeader
      icon={History}
      title="Regional event history"
      description="Outages, degradation, and recoveries with geographic context"
      action="Latest first"
    />
    <div className="px-4 py-1">
      {mockMultiRegionMonitor.incidents.map((incident, index) => {
        const isActive = incident.status === "Active";
        return (
          <div
            key={incident.id}
            className="relative grid gap-2 py-2 pl-7 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            {index < mockMultiRegionMonitor.incidents.length - 1 ? (
              <span className="absolute bottom-0 left-[6px] top-5 w-px bg-sf-border-faint" />
            ) : null}
            <span
              className={`absolute left-0 top-[13px] size-3 rounded-full border-2 border-sf-surface ${
                isActive ? "bg-sf-red" : "bg-sf-green"
              }`}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-sf-text">{incident.title}</p>
                <Pill tone={isActive ? "negative" : "positive"}>{incident.status}</Pill>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{incident.description}</p>
            </div>
            <time className="text-[11px] tabular-nums text-sf-text-muted sm:text-right">
              {incident.occurredAt}
            </time>
          </div>
        );
      })}
    </div>
  </Panel>
);

const RegionAlertRulesCard = () => (
  <Panel>
    <RegionPanelHeader
      icon={BellRing}
      title="Multi-region alert rules"
      description="Read-only preview; quorum is evaluated before global alerts fire"
      action={`${mockMultiRegionMonitor.alertRules.filter((rule) => rule.enabled).length} active`}
    />
    <div className="grid md:grid-cols-2">
      {mockMultiRegionMonitor.alertRules.map((rule) => (
        <div
          key={rule.label}
          className="flex items-start gap-2.5 border-b border-sf-border-faint px-4 py-2.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-r-sf-border-faint"
        >
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${rule.enabled ? "bg-sf-green" : "border border-sf-border bg-sf-bg"}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
              <span className={`shrink-0 text-[10.5px] font-medium ${rule.enabled ? "text-sf-green" : "text-sf-text-muted"}`}>{rule.enabled ? "Active" : "Inactive"}</span>
            </div>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{rule.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const MultiRegionMonitor = () => (
  <section id="multi-region-monitoring" className="protocol-detail-theme scroll-mt-16 space-y-3">
    <RegionStatusSummary />

    <RegionSection
      icon={Globe2}
      title="Regional fleet"
      description="The latest independent result from every probe, including availability and recent state."
    >
      <RegionMapCard />
      <div className="mt-3"><HourlyResultsCard /></div>
      <div className="mt-3 grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <RegionHealthTable />
        <AvailabilityByRegionCard />
      </div>
    </RegionSection>

    <RegionSection
      icon={Gauge}
      title="Latency & geography"
      description="How performance varies across probe locations and where time is spent during each request."
    >
      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <GlobalLatencyTrendCard />
        <RegionalSpreadCard />
      </div>
      <div className="mt-3 grid items-stretch gap-3 lg:grid-cols-2">
        <RegionalLatencyCard />
        <PhaseBreakdownCard />
      </div>
    </RegionSection>

    <RegionSection
      icon={ShieldCheck}
      title="Consensus & integrity"
      description="How regional results become one global state and whether every location serves the same response."
    >
      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <FailureConfirmationCard />
        <RegionBodyConsistencyCard />
      </div>
    </RegionSection>

    <RegionSection
      icon={History}
      title="Operations & activity"
      description="Regional incidents, aggregation configuration, and the alert rules governing global state changes."
    >
      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <RegionIncidentCard />
        <RegionConfigurationCard />
      </div>
      <div className="mt-3">
        <RegionAlertRulesCard />
      </div>
    </RegionSection>

    <div className="flex items-center gap-2 rounded-lg border border-sf-border bg-sf-bg px-4 py-3 text-[11px] text-sf-text-muted">
      <Clock3 className="size-3.5 shrink-0" />
      This preview uses static data. Multi-region workers, aggregation, and
      persistence remain deferred to V12.
    </div>
  </section>
);

export default MultiRegionMonitor;
