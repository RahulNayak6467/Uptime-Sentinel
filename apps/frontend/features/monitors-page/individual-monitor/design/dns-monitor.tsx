"use client";

import type { ReactNode } from "react";
import {
  Activity,
  BellRing,
  Globe2,
  History,
  ListTree,
  Mail,
  Network,
  Pin,
  Route,
  Server,
  Settings2,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import {
  CheckRow,
  KeyValue,
  KeyValueList,
  Panel,
  PercentileStrip,
  Pill,
  StatusBanner,
  TableScroll,
  type HeaderStat,
  type Tone,
} from "../monitor-detail-primitives";
import { TrendChart } from "../monitor-detail-charts";

/* ------------------------------------------------------------------ */
/* Coming-soon badge (brand accent) — on cards the V7 checker can't     */
/* yet back: raw-DNS answer flags, DNSSEC chain, delegation, region.    */
/* ------------------------------------------------------------------ */

const ComingSoon = () => (
  <span className="inline-flex items-center gap-1 rounded-sf border border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-[var(--sf-protocol-accent)]">
    Coming soon
  </span>
);

/* Blurs a card's data region while leaving the header (title + Coming-soon
   badge) crisp — signals "not wired yet" without hiding what the section is. */
const BlurredContent = ({ children }: { children: ReactNode }) => (
  <div className="pointer-events-none select-none opacity-15 saturate-0">
    {children}
  </div>
);

/* Record types are informational, so highlighted types use the brand accent
   rather than semantic health colors. */
const recordTypeBadge: Record<string, string> = {
  A: "border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]",
  AAAA:
    "border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]",
  MX: "border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]",
  NS: "border-[var(--sf-protocol-accent-border)] bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]",
};
const badgeClass = (type: string) =>
  recordTypeBadge[type] ?? "border-sf-border bg-sf-bg text-sf-text-sub";

const toneIconClass: Record<Tone, string> = {
  neutral: "text-sf-text-muted",
  info: "text-[var(--sf-protocol-accent)]",
  positive: "text-sf-green",
  warning: "text-sf-amber",
  negative: "text-sf-red",
};

/** Compact DNS header matching the density used by the TCP detail panels. */
const DnsPanelHeader = ({
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
      <h3 className="truncate text-[13px] font-semibold text-sf-text">{title}</h3>
      {description ? <span className="sr-only">{description}</span> : null}
    </div>
    {action ? (
      <div className="text-left text-[11.5px] leading-relaxed text-sf-text-muted sm:shrink-0 sm:text-right">
        {action}
      </div>
    ) : null}
  </header>
);

/** Preserve section semantics without adding another large visual heading. */
const DnsSection = ({
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section>
    <h2 className="sr-only">{title}</h2>
    <p className="sr-only">{description}</p>
    {children}
  </section>
);

const mockDnsMonitor = {
  hostname: "statusforge.dev",
  status: "Healthy",
  responseCode: "NOERROR",
  queryTimeMs: 18,
  p95Ms: 34,
  recordCount: 9,
  lastChecked: "1 minute ago",
  lastChange: "42 days ago",
  nextCheck: "in 3 minutes",
  resolversAgree: "6/6",
  nameserversResponding: "4/4",
  ttlSeconds: 300,
  monitoredRecordTypes: ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "CAA", "SOA"],
  queryTimeTrend: [
    19, 18, 20, 16, 22, 18, 17, 21, 19, 18, 24, 17, 20, 16, 18, 23, 17, 19, 18,
    16, 21, 18, 17, 18,
  ] as (number | null)[],
  latency: {
    latestMs: 18,
    averageMs: 19,
    p50Ms: 18,
    p75Ms: 22,
    p90Ms: 29,
    p95Ms: 34,
    p99Ms: 46,
    p999Ms: 52,
    maxMs: 54,
  },
  configuration: {
    resolver: "1.1.1.1 · Cloudflare",
    checkInterval: "5 minutes",
    queryTimeout: "5 seconds",
    changeDetection: "Enabled",
  },
  lastAnswer: {
    section: "api.statusforge.io. 300 IN A 76.76.21.21",
    expected: "76.76.21.21",
    matchMode: "Exact · all answers",
    authoritative: "Yes · AA flag",
    truncated: "No · TC clear",
    messageSize: "96 bytes",
    transport: "UDP · EDNS0 (4096)",
    resolver: "1.1.1.1 · Cloudflare",
    queryTimeMs: 18,
  },
  delegationTrace: {
    endToEndMs: 18,
    hops: [
      { level: "Root · .", detail: "a.root-servers.net → referral to com.", ms: 2 },
      { level: "TLD · com.", detail: "a.gtld-servers.net → referral to ns1", ms: 7 },
      { level: "Authoritative · statusforge.io", detail: "Answer returned with the AA flag set", ms: 9 },
    ],
  },
  dnssec: {
    status: "Validated",
    algorithm: "ECDSAP256SHA256",
    keyTag: "2371",
    digestType: "SHA-256",
    nsec3: "Opt-out disabled · no zone walking",
    lastRollover: "ZSK · Jun 01 · no validation gap",
    validatingResolvers: "6 of 6 accept the signature",
  },
  dnssecChain: [
    { zone: ". (root)", detail: "Trust anchor · KSK 2017" },
    { zone: "com.", detail: "DS → RSASHA256 · verified" },
    { zone: "zone", detail: "DNSKEY ECDSAP256SHA256 · KSK+ZSK" },
    { zone: "RRSIG", detail: "A-record signature valid for 21 days" },
  ],
  records: [
    { type: "A", name: "api.statusforge.io", value: "76.76.21.21", ttl: 300, cacheLeft: 286 },
    { type: "AAAA", name: "api.statusforge.io", value: "2606:4700:3033::ac43:a2f1", ttl: 300, cacheLeft: 286 },
    { type: "CNAME", name: "www.statusforge.io", value: "statusforge.io", ttl: 3600, cacheLeft: 2140 },
    { type: "MX", name: "statusforge.io", value: "10 mail.statusforge.io", ttl: 3600, cacheLeft: 1980, priority: 10 },
    { type: "TXT", name: "statusforge.io", value: "v=spf1 include:_spf.google.com ~all", ttl: 3600, cacheLeft: 3120 },
    { type: "NS", name: "statusforge.io", value: "ns1.statusforge-dns.com", ttl: 86400, cacheLeft: 51200 },
    { type: "CAA", name: "statusforge.io", value: '0 issue "letsencrypt.org"', ttl: 3600, cacheLeft: 2600 },
  ],
  nameservers: [
    { hostname: "ns1.statusforge-dns.com", latencyMs: 18, role: "Primary · SOA source" },
    { hostname: "ns2.statusforge-dns.com", latencyMs: 24, role: "Secondary · AXFR" },
    { hostname: "ns3.statusforge-dns.com", latencyMs: 31, role: "Secondary · AXFR" },
    { hostname: "ns4.statusforge-dns.com", latencyMs: 29, role: "Secondary · AXFR" },
  ],
  delegation: "Consistent with parent",
  serialAgreement: "All NS on 2026070801",
  distinctNetworks: "3 ASNs · no single point of failure",
  propagation: {
    agreement: "6 of 6 agree",
    cacheAgreement: "100%",
    observedMinTtl: 129,
    resolvers: [
      { resolver: "Cloudflare", address: "1.1.1.1", answer: "76.76.21.21", ttlLeft: 286, queryMs: 14 },
      { resolver: "Google", address: "8.8.8.8", answer: "76.76.21.21", ttlLeft: 241, queryMs: 21 },
      { resolver: "Quad9", address: "9.9.9.9", answer: "76.76.21.21", ttlLeft: 198, queryMs: 26 },
      { resolver: "OpenDNS", address: "208.67.222.222", answer: "76.76.21.21", ttlLeft: 174, queryMs: 33 },
      { resolver: "AdGuard", address: "94.140.14.14", answer: "76.76.21.21", ttlLeft: 150, queryMs: 41 },
      { resolver: "Yandex", address: "77.88.8.8", answer: "76.76.21.21", ttlLeft: 129, queryMs: 58 },
    ],
  },
  perRegion: [
    { region: "US-East", resolver: "1.1.1.1", answer: "76.76.21.21", queryMs: 14 },
    { region: "US-West", resolver: "8.8.8.8", answer: "76.76.21.21", queryMs: 19 },
    { region: "EU-West", resolver: "1.1.1.1", answer: "76.76.21.21", queryMs: 11 },
    { region: "EU-Central", resolver: "9.9.9.9", answer: "76.76.21.21", queryMs: 16 },
    { region: "AP-South", resolver: "1.1.1.1", answer: "76.76.21.21", queryMs: 38 },
    { region: "SA-East", resolver: "8.8.8.8", answer: "76.76.21.21", queryMs: 44 },
  ],
  history: [
    { id: "dns-history-1", type: "Record changed", description: "A record 76.76.21.18 → 76.76.21.21. Change alert sent to the on-call rotation.", occurredAt: "Jun 13 · 08:20", tone: "warning" as Tone },
    { id: "dns-history-2", type: "TTL lowered", description: "A record TTL 3600s → 300s ahead of the migration window.", occurredAt: "Jun 13 · 08:02", tone: "neutral" as Tone },
    { id: "dns-history-3", type: "DNSSEC rollover", description: "ZSK rolled without a validation gap. Chain of trust stayed intact.", occurredAt: "Jun 01 · 03:15", tone: "neutral" as Tone },
    { id: "dns-history-4", type: "Resolved", description: "Resolution recovered after SERVFAIL on ns2.statusforge-dns.com.", occurredAt: "May 02 · 14:11", tone: "positive" as Tone },
    { id: "dns-history-5", type: "Nameserver added", description: "ns3.statusforge-dns.com added to the delegation set.", occurredAt: "Apr 18 · 09:35", tone: "neutral" as Tone },
  ],
  alertRules: [
    { label: "Resolution failure", description: "The hostname no longer returns a successful DNS response.", enabled: true },
    { label: "Record changed", description: "A monitored record is added, removed, or modified.", enabled: true },
    { label: "Nameserver failure", description: "An authoritative nameserver stops responding.", enabled: true },
    { label: "Resolver inconsistency", description: "Public resolvers return different answers.", enabled: true },
    { label: "Email auth broken", description: "SPF, DMARC, or MTA-STS stops validating.", enabled: false },
    { label: "Record left allowlist", description: "A pinned record resolves to an unexpected value.", enabled: true },
  ],
  emailAuth: [
    { mechanism: "SPF", status: "Pass", summary: "One record · ends in ~all · 4 of 10 lookups" },
    { mechanism: "DKIM", status: "Pass", summary: "Selector google._domainkey · RSA 2048 · record present" },
    { mechanism: "DMARC", status: "Pass", summary: "p=reject · pct=100 · rua reporting on" },
    { mechanism: "MTA-STS", status: "Pass", summary: "Policy mode enforce · max_age 604800" },
    { mechanism: "BIMI", status: "Warn", summary: "No record · brand indicators unavailable" },
  ],
  emailFooter: {
    reportsTo: "dmarc@statusforge.io",
    reverseDns: "edge-01.statusforge.io",
    mxUnchanged: "128 days",
    asn: "AS13335 · Cloudflare",
  },
  pinnedRecords: [
    { type: "A", name: "statusforge.io", expected: "76.76.21.21", current: "76.76.21.21", matches: true },
    { type: "NS", name: "statusforge.io", expected: "ns1/ns2.statusforge-dns.com", current: "ns1/ns2.statusforge-dns.com", matches: true },
    { type: "MX", name: "statusforge.io", expected: "mail.statusforge.io", current: "mail.statusforge.io", matches: true },
  ],
  ttlFindings: [
    { record: "A · api.statusforge.io", ttl: 300, verdict: "ok", note: "Balanced for failover and cache efficiency" },
    { record: "MX · statusforge.io", ttl: 3600, verdict: "ok", note: "Stable record, long cache is fine" },
    { record: "NS · statusforge.io", ttl: 86400, verdict: "high", note: "24h TTL slows any nameserver migration" },
  ],
  caaCrossCheck: {
    authorized: true,
    caaIssuers: ["letsencrypt.org"],
    certificateIssuer: "Let's Encrypt R11",
    note: "The live certificate's issuer is permitted by the CAA policy.",
  },
  soa: {
    zone: "statusforge.io",
    primaryNs: "ns1.statusforge-dns.com",
    admin: "hostmaster@statusforge.io",
    serial: "2026070801",
    refreshRetry: "7200s / 3600s",
    expire: "1209600s · 14d",
    minimumTtl: "300s",
    recordType: "A",
    followCname: "Enabled",
    recursion: "Enabled · RD flag",
  },
} as const;

const QUERY_THRESHOLD_MS = 60;

const authTone: Record<"Pass" | "Warn" | "Fail", Tone> = {
  Pass: "positive",
  Warn: "warning",
  Fail: "negative",
};

const dotTone: Record<Tone, string> = {
  neutral: "bg-sf-text-muted",
  info: "bg-[var(--sf-protocol-accent)]",
  positive: "bg-sf-green",
  warning: "bg-sf-amber",
  negative: "bg-sf-red",
};

const headerStats: HeaderStat[] = [
  { label: "Query time", value: mockDnsMonitor.queryTimeMs, hint: `p95 ${mockDnsMonitor.p95Ms}ms · 24h` },
  { label: "Resolvers agree", value: mockDnsMonitor.resolversAgree, hint: "all public resolvers match" },
  { label: "Nameservers", value: mockDnsMonitor.nameserversResponding, hint: "same serial · 3 ASNs" },
  { label: "TTL", value: `${mockDnsMonitor.ttlSeconds}s`, hint: "negative cache 300s" },
  { label: "DNSSEC", value: "Valid", tone: "positive", hint: "chain verified to root" },
  { label: "Last change", value: mockDnsMonitor.lastChange, hint: "A · 76.76.21.21" },
];

const DnsStatusSummary = () => (
  <div className="space-y-2.5">
    <Panel className="relative bg-sf-surface">
      <div className="flex items-start gap-3.5 px-[18px] py-4">
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-sf-green-border bg-sf-green-bg text-sf-green">
          <Globe2 className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
              Resolving correctly
            </h1>
            <Pill tone="positive">{mockDnsMonitor.responseCode}</Pill>
            <Pill tone="positive">DNSSEC valid</Pill>
          </div>
          <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
            {mockDnsMonitor.hostname}
          </p>
          <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
            The A record resolves to the expected address from all public resolvers ·
            consistent and unchanged for 42 days
          </p>
        </div>
      </div>
    </Panel>

    <Panel>
      <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
        {headerStats.map((stat) => (
          <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-sf-text-muted">
              {stat.tone === "positive" ? (
                <span className="size-1.5 rounded-full bg-sf-green" />
              ) : null}
              {stat.label}
            </dt>
            <dd
              className={`mt-1.5 truncate text-[21px] font-semibold leading-[1.1] tracking-[-0.02em] tabular-nums ${
                stat.tone === "positive" ? "text-sf-green" : "text-sf-text"
              }`}
            >
              {stat.value}
            </dd>
            {stat.hint ? (
              <dd className="mt-1 text-[11.5px] leading-relaxed text-sf-text-muted">
                {stat.hint}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </Panel>
  </div>
);

/* Small right-aligned footer row used to balance card heights (matches the
   reference's card footers). */
const FooterRow = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive";
}) => (
  <div className="flex items-center justify-between gap-3 py-1.5">
    <span className="text-xs text-sf-text-muted">{label}</span>
    <span className={`text-[12.5px] font-medium ${tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>
      {value}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Record inventory                                                    */
/* ------------------------------------------------------------------ */

const DnsRecordCard = () => {
  return (
    <Panel>
      <DnsPanelHeader
        icon={ListTree}
        title="Zone records"
        description="Latest normalized answer set, diffed each check"
        action={<span className="tabular-nums">{mockDnsMonitor.records.length} answers</span>}
      />
      <TableScroll>
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead className="border-b border-sf-border bg-sf-bg/70 text-[10.5px] uppercase tracking-[0.07em] text-sf-text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Value</th>
              <th className="px-3 py-2 text-right font-semibold">TTL</th>
              <th className="px-4 py-2 text-right font-semibold">Cache left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {mockDnsMonitor.records.map((record) => (
              <tr key={`${record.type}-${record.name}-${record.value}`} className="transition-colors hover:bg-sf-bg/50">
                <td className="px-4 py-[9px]">
                  <span className={`rounded-sf border px-2 py-0.5 font-mono text-[11px] font-semibold ${badgeClass(record.type)}`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-3 py-[9px] font-medium text-sf-text">{record.name}</td>
                <td className="max-w-[280px] truncate px-3 py-[9px] font-mono text-xs text-sf-text">{record.value}</td>
                <td className="px-3 py-[9px] text-right tabular-nums text-sf-text-muted">{record.ttl}s</td>
                <td className="px-4 py-[9px]">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-[5px] w-14 overflow-hidden rounded-[3px] bg-sf-border-faint">
                      <div className="h-full rounded-full bg-sf-text-sub" style={{ width: `${Math.max((record.cacheLeft / record.ttl) * 100, 6)}%` }} />
                    </div>
                    <span className="w-14 text-right tabular-nums text-sf-text-muted">{record.cacheLeft}s</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Resolution & performance                                            */
/* ------------------------------------------------------------------ */

const DnsQueryTrendCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={Activity}
      title="Resolution time"
      description="Lookup latency for the monitored hostname"
      action={
        <span className="inline-flex overflow-hidden rounded-sf border border-sf-border text-[11px] font-semibold">
          {["24h", "7d", "30d"].map((range) => (
            <span key={range} className={`px-2 py-0.5 ${range === "24h" ? "bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]" : "text-sf-text-muted"}`}>
              {range}
            </span>
          ))}
        </span>
      }
    />
    <div className="px-4 pb-2 pt-2.5">
      <TrendChart
        series={[
          { name: "p50", values: [...mockDnsMonitor.queryTimeTrend] },
          { name: "p95", values: mockDnsMonitor.queryTimeTrend.map((value) => value === null ? null : Math.round(value * 1.55)) },
        ]}
        threshold={QUERY_THRESHOLD_MS}
        tone="info"
        height={200}
      />
    </div>
    <PercentileStrip
      ariaLabel="DNS query latency summary for the last 24 hours"
      metrics={[
        { label: "Latest", value: mockDnsMonitor.latency.latestMs, unit: "ms" },
        { label: "Average", value: mockDnsMonitor.latency.averageMs, unit: "ms" },
        { label: "p50", value: mockDnsMonitor.latency.p50Ms, unit: "ms", color: "var(--sf-protocol-accent)" },
        { label: "p75", value: mockDnsMonitor.latency.p75Ms, unit: "ms" },
        { label: "p90", value: mockDnsMonitor.latency.p90Ms, unit: "ms" },
        { label: "p95", value: mockDnsMonitor.latency.p95Ms, unit: "ms", color: "var(--sf-percentile-p95)" },
        { label: "p99", value: mockDnsMonitor.latency.p99Ms, unit: "ms", color: "var(--sf-percentile-p99)" },
        { label: "p99.9", value: mockDnsMonitor.latency.p999Ms, unit: "ms", color: "var(--sf-percentile-p999)" },
        { label: "Max", value: mockDnsMonitor.latency.maxMs, unit: "ms" },
      ]}
    />
  </Panel>
);

const DnsLastAnswerCard = () => {
  const a = mockDnsMonitor.lastAnswer;
  return (
    <Panel>
      <DnsPanelHeader
        icon={Network}
        title="Last answer"
        description="The most recent authoritative resolver reply"
        action={<Pill tone="positive">{mockDnsMonitor.responseCode}</Pill>}
      />
      <div className="px-4 pt-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-sf-text-muted">Answer section</p>
        <div className="mt-2 rounded-lg border border-sf-border-faint bg-sf-bg px-3 py-2.5 font-mono text-[11.5px] text-sf-text">
          {a.section}
        </div>
      </div>
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="Expected value" mono>{a.expected}</KeyValue>
        <KeyValue label="Match mode">{a.matchMode}</KeyValue>
        <KeyValue label="Authoritative">{a.authoritative}</KeyValue>
        <KeyValue label="Truncated" tone="positive">{a.truncated}</KeyValue>
        <KeyValue label="Message size">{a.messageSize}</KeyValue>
        <KeyValue label="Transport">{a.transport}</KeyValue>
        <KeyValue label="Resolver">{a.resolver}</KeyValue>
        <KeyValue label="Query time">{a.queryTimeMs}ms</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

const DnsDelegationTraceCard = () => {
  const { delegationTrace } = mockDnsMonitor;
  const max = Math.max(...delegationTrace.hops.map((h) => h.ms));
  return (
    <Panel>
      <DnsPanelHeader
        icon={Route}
        title="Delegation trace"
        description="Recursion replayed from the root"
        action={
          <span className="flex items-center gap-2">
            <span className="tabular-nums text-sf-text-muted">{delegationTrace.endToEndMs}ms end to end</span>
            <ComingSoon />
          </span>
        }
      />
      <div className="relative overflow-hidden">
        <BlurredContent>
          <div className="flex items-center justify-between px-4 pt-3 text-[10.5px] uppercase tracking-[0.06em] text-sf-text-muted">
            <span>0</span>
            <span>{Math.round(max / 2)}ms</span>
            <span>{max}ms</span>
          </div>
          <div className="space-y-2 px-4 py-2.5">
            {delegationTrace.hops.map((hop) => (
              <div key={hop.level} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-sf-text">{hop.level}</p>
                  <p className="mt-0.5 truncate text-[11px] text-sf-text-muted">{hop.detail}</p>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-[3px] bg-sf-border-faint">
                    <div className="h-full rounded-full bg-[var(--sf-protocol-accent)]" style={{ width: `${(hop.ms / max) * 100}%` }} />
                  </div>
                </div>
                <span className="shrink-0 tabular-nums text-xs font-semibold text-sf-text">{hop.ms}ms</span>
              </div>
            ))}
          </div>
        </BlurredContent>
        <div className="absolute inset-0 flex items-center justify-center bg-sf-surface/90 p-6">
          <div className="max-w-sm px-5 py-4 text-center">
            <Route className="mx-auto size-5 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-sf-text">Delegation tracing is coming soon</p>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">
              The complete recursive path from the root to the authoritative answer will appear here.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Propagation & authority                                             */
/* ------------------------------------------------------------------ */

const DnsPropagationCard = () => {
  const { propagation } = mockDnsMonitor;
  const maxTtl = Math.max(...propagation.resolvers.map((r) => r.ttlLeft));
  return (
    <Panel>
      <DnsPanelHeader
        icon={Globe2}
        title="Propagation · public resolvers"
        description="Answer agreement across commonly used public DNS resolvers"
        action={<Pill tone="positive">{propagation.agreement}</Pill>}
      />
      <div className="px-4 pt-3">
        <div className="flex gap-1">
          {propagation.resolvers.map((r) => (
            <div key={r.address} className="h-[5px] flex-1 rounded-[3px] bg-sf-green" />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11.5px] text-sf-text-muted">
          <span>Cache agreement <span className="font-semibold text-sf-text">{propagation.cacheAgreement}</span></span>
          <span>Configured TTL 300s · observed min {propagation.observedMinTtl}s</span>
        </div>
      </div>
      <TableScroll>
        <table className="mt-2 w-full min-w-[640px] text-left text-[12.5px]">
          <thead className="border-b border-sf-border bg-sf-bg/70 text-[10.5px] uppercase tracking-[0.07em] text-sf-text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Resolver</th>
              <th className="px-3 py-2 font-semibold">Address</th>
              <th className="px-3 py-2 font-semibold">Answer</th>
              <th className="px-3 py-2 font-semibold">TTL left</th>
              <th className="px-3 py-2 text-right font-semibold">Query</th>
              <th className="px-4 py-2 text-right font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {propagation.resolvers.map((r) => (
              <tr key={r.address}>
                <td className="px-4 py-[9px]">
                  <span className="flex items-center gap-2 font-semibold text-sf-text">
                    <span className="size-1.5 rounded-full bg-sf-green" />
                    {r.resolver}
                  </span>
                </td>
                <td className="px-3 py-[9px] font-mono text-xs text-sf-text-muted">{r.address}</td>
                <td className="px-3 py-[9px] font-mono text-xs text-sf-text">{r.answer}</td>
                <td className="px-3 py-[9px]">
                  <div className="flex items-center gap-2">
                    <div className="h-[5px] w-14 overflow-hidden rounded-[3px] bg-sf-border-faint">
                      <div className="h-full rounded-full bg-sf-text-sub" style={{ width: `${(r.ttlLeft / maxTtl) * 100}%` }} />
                    </div>
                    <span className="tabular-nums text-sf-text-muted">{r.ttlLeft}s</span>
                  </div>
                </td>
                <td className="px-3 py-[9px] text-right tabular-nums text-sf-text-muted">{r.queryMs}ms</td>
                <td className="px-4 py-[9px] text-right"><Pill tone="positive">Match</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </Panel>
  );
};

const DnsNameserverCard = () => {
  const maxLatency = Math.max(...mockDnsMonitor.nameservers.map((n) => n.latencyMs));
  return (
    <Panel>
      <DnsPanelHeader
        icon={Server}
        title="Authoritative nameservers"
        description="Availability, response time, and serial agreement per server"
        action={<Pill tone="positive">{mockDnsMonitor.nameserversResponding} responding</Pill>}
      />
      <div className="divide-y divide-sf-border-faint px-4">
        {mockDnsMonitor.nameservers.map((ns) => (
          <div key={ns.hostname} className="py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-mono text-[11px] font-semibold text-sf-text">
                <span className="size-1.5 rounded-full bg-sf-green" />
                {ns.hostname}
              </span>
              <span className="shrink-0 tabular-nums text-xs font-semibold text-sf-text">{ns.latencyMs}ms</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-sm bg-sf-border-faint">
              <div className="h-full rounded-full bg-sf-text-sub" style={{ width: `${(ns.latencyMs / maxLatency) * 100}%` }} />
            </div>
            <p className="mt-1 text-right text-[11px] text-sf-text-muted">{ns.role}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-sf-border-faint px-4">
        <FooterRow label="Delegation" value={mockDnsMonitor.delegation} tone="positive" />
        <FooterRow label="Serial agreement" value={mockDnsMonitor.serialAgreement} tone="positive" />
        <FooterRow label="Distinct networks" value={mockDnsMonitor.distinctNetworks} />
      </div>
    </Panel>
  );
};

const DnsPerRegionCard = () => {
  const maxQuery = Math.max(...mockDnsMonitor.perRegion.map((r) => r.queryMs));
  return (
    <Panel>
      <DnsPanelHeader
        icon={Globe2}
        title="Resolution per probe region"
        description="Each probe queries from its own network"
        action={<ComingSoon />}
      />
      <div className="relative overflow-hidden">
        <BlurredContent>
          <TableScroll>
            <table className="w-full min-w-[600px] text-left text-[12.5px]">
          <thead className="border-b border-sf-border bg-sf-bg/70 text-[10.5px] uppercase tracking-[0.07em] text-sf-text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Region</th>
              <th className="px-3 py-2 font-semibold">Resolver</th>
              <th className="px-3 py-2 font-semibold">Answer</th>
              <th className="px-3 py-2 font-semibold">Query time</th>
              <th className="px-4 py-2 text-right font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {mockDnsMonitor.perRegion.map((row) => (
              <tr key={row.region}>
                <td className="px-4 py-[9px] font-medium text-sf-text">{row.region}</td>
                <td className="px-3 py-[9px] font-mono text-xs text-sf-text-muted">{row.resolver}</td>
                <td className="px-3 py-[9px] font-mono text-xs text-sf-text">{row.answer}</td>
                <td className="px-3 py-[9px]">
                  <div className="flex items-center gap-2">
                    <div className="h-[5px] w-14 overflow-hidden rounded-[3px] bg-sf-border-faint">
                      <div className="h-full rounded-full bg-[var(--sf-protocol-accent)]" style={{ width: `${(row.queryMs / maxQuery) * 100}%` }} />
                    </div>
                    <span className="tabular-nums text-sf-text-muted">{row.queryMs}ms</span>
                  </div>
                </td>
                <td className="px-4 py-[9px] text-right"><Pill tone="positive">Match</Pill></td>
              </tr>
            ))}
          </tbody>
            </table>
          </TableScroll>
        </BlurredContent>
        <div className="absolute inset-0 flex items-center justify-center bg-sf-surface/90 p-6">
          <div className="max-w-sm px-5 py-4 text-center">
            <Globe2 className="mx-auto size-5 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-sf-text">Regional DNS probes are coming soon</p>
            <p className="mt-1 text-xs leading-5 text-sf-text-muted">
              Per-region answers and query latency will appear here when multi-region monitoring is available.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Integrity & policy                                                  */
/* ------------------------------------------------------------------ */

const DnsSecurityCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={ShieldCheck}
      title="DNSSEC chain of trust"
      description="Signature validation from the root trust anchor down"
      action={
        <span className="flex items-center gap-2">
          <Pill tone="positive">{mockDnsMonitor.dnssec.status}</Pill>
          <ComingSoon />
        </span>
      }
    />
    <div className="relative overflow-hidden">
      <BlurredContent>
        <div className="px-4 py-1">
          {mockDnsMonitor.dnssecChain.map((link, index) => (
            <div key={link.zone} className="relative grid gap-0.5 py-2 pl-7">
              {index < mockDnsMonitor.dnssecChain.length - 1 ? (
                <span className="absolute bottom-0 left-[9px] top-7 w-px bg-sf-border-faint" />
              ) : null}
              <span className="absolute left-0 top-2 flex size-[18px] items-center justify-center rounded-[5px] border border-sf-green-border bg-sf-green-bg text-sf-green">
                <ShieldCheck className="size-2.5" strokeWidth={2} />
              </span>
              <p className="font-mono text-[12.5px] font-semibold text-sf-text">{link.zone}</p>
              <p className="text-[11px] text-sf-text-muted">{link.detail}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-sf-border-faint px-4">
          <FooterRow label="NSEC3" value={mockDnsMonitor.dnssec.nsec3} />
          <FooterRow label="Last rollover" value={mockDnsMonitor.dnssec.lastRollover} />
          <FooterRow label="Validating resolvers" value={mockDnsMonitor.dnssec.validatingResolvers} />
        </div>
      </BlurredContent>
      <div className="absolute inset-0 flex items-center justify-center bg-sf-surface/90 p-6">
        <div className="max-w-sm px-5 py-4 text-center">
          <ShieldCheck className="mx-auto size-5 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold text-sf-text">DNSSEC validation is coming soon</p>
          <p className="mt-1 text-xs leading-5 text-sf-text-muted">
            The verified chain from the root trust anchor to this record will appear here.
          </p>
        </div>
      </div>
    </div>
  </Panel>
);

const DnsEmailAuthCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={Mail}
      title="Email authentication"
      description="SPF, DKIM presence, DMARC, and MTA-STS parsed from DNS"
      action="SPF · DKIM · DMARC"
    />
    <div className="divide-y divide-sf-border-faint px-4">
      {mockDnsMonitor.emailAuth.map((entry) => (
        <div key={entry.mechanism} className="py-0.5 [&>div]:!gap-2.5 [&>div]:!py-2 [&>div>span]:!size-[18px]">
          <CheckRow
            tone={authTone[entry.status as "Pass" | "Warn" | "Fail"]}
            title={entry.mechanism}
            description={entry.summary}
          />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-x-6 border-t border-sf-border-faint px-4 py-1 sm:grid-cols-2">
      <FooterRow label="Reports to" value={mockDnsMonitor.emailFooter.reportsTo} />
      <FooterRow label="MX unchanged" value={mockDnsMonitor.emailFooter.mxUnchanged} />
      <FooterRow label="Reverse DNS" value={mockDnsMonitor.emailFooter.reverseDns} />
      <FooterRow label="ASN" value={mockDnsMonitor.emailFooter.asn} />
    </div>
  </Panel>
);

const DnsConfigurationCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={Settings2}
      title="Zone, SOA & query configuration"
      description="Authority metadata and the monitor's query settings"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="Zone" mono>{mockDnsMonitor.soa.zone}</KeyValue>
        <KeyValue label="Primary NS" mono>{mockDnsMonitor.soa.primaryNs}</KeyValue>
        <KeyValue label="Zone admin" mono>{mockDnsMonitor.soa.admin}</KeyValue>
        <KeyValue label="Serial" mono>{mockDnsMonitor.soa.serial}</KeyValue>
        <KeyValue label="Refresh / retry">{mockDnsMonitor.soa.refreshRetry}</KeyValue>
        <KeyValue label="Minimum TTL">{mockDnsMonitor.soa.minimumTtl}</KeyValue>
      </KeyValueList>
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="Record type">{mockDnsMonitor.soa.recordType}</KeyValue>
        <KeyValue label="Follow CNAME">{mockDnsMonitor.soa.followCname}</KeyValue>
        <KeyValue label="Query timeout">{mockDnsMonitor.configuration.queryTimeout}</KeyValue>
        <KeyValue label="Check interval">{mockDnsMonitor.configuration.checkInterval}</KeyValue>
        <KeyValue label="Expire">{mockDnsMonitor.soa.expire}</KeyValue>
        <KeyValue label="Recursion">{mockDnsMonitor.soa.recursion}</KeyValue>
      </KeyValueList>
    </div>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Extra policy cards (kept from the original design)                  */
/* ------------------------------------------------------------------ */

const DnsPinnedRecordsCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={Pin}
      title="Record pinning"
      description="Alerts when a monitored record leaves its expected allowlist"
      action="Hijack detection"
    />
    <TableScroll>
      <table className="w-full min-w-[520px] text-left text-[12.5px]">
        <thead className="border-b border-sf-border bg-sf-bg/70 text-[10.5px] uppercase tracking-[0.07em] text-sf-text-muted">
          <tr>
            <th className="px-4 py-2 font-semibold">Record</th>
            <th className="px-3 py-2 font-semibold">Expected</th>
            <th className="px-3 py-2 font-semibold">Current</th>
            <th className="px-4 py-2 text-right font-semibold">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sf-border-faint">
          {mockDnsMonitor.pinnedRecords.map((record) => (
            <tr key={`${record.type}-${record.name}`} className={record.matches ? "" : "bg-sf-red-bg/40"}>
              <td className="px-4 py-[9px]">
                <span className={`rounded-sf border px-2 py-0.5 font-mono text-[11px] font-semibold ${badgeClass(record.type)}`}>
                  {record.type}
                </span>
              </td>
              <td className="px-3 py-[9px] font-mono text-xs text-sf-text-muted">{record.expected}</td>
              <td className="px-3 py-[9px] font-mono text-xs text-sf-text">{record.current}</td>
              <td className="px-4 py-[9px] text-right">
                <Pill tone={record.matches ? "positive" : "negative"}>{record.matches ? "Pinned" : "Drifted"}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  </Panel>
);

const DnsTtlCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={Timer}
      title="TTL sanity"
      description="Flags values too low for cache efficiency or too high for failover"
    />
    <div className="divide-y divide-sf-border-faint px-4">
      {mockDnsMonitor.ttlFindings.map((finding) => {
        const tone: Tone = finding.verdict === "ok" ? "positive" : "warning";
        const label = finding.verdict === "ok" ? "Healthy" : finding.verdict === "high" ? "High" : "Low";
        return (
          <div key={finding.record} className="flex items-center justify-between gap-4 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-sf-text">{finding.record}</p>
              <p className="mt-0.5 text-[11px] text-sf-text-muted">{finding.note}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs tabular-nums text-sf-text">{finding.ttl}s</p>
              <p className={`mt-0.5 text-[11px] font-semibold ${tone === "positive" ? "text-sf-green" : "text-sf-amber"}`}>{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  </Panel>
);

const DnsCaaCrossCheckCard = () => {
  const { caaCrossCheck } = mockDnsMonitor;
  const tone: Tone = caaCrossCheck.authorized ? "positive" : "negative";
  return (
    <Panel>
      <DnsPanelHeader
        icon={ShieldCheck}
        title="CAA ↔ certificate"
        description="Does the CAA policy authorize the live TLS certificate's issuer?"
        action={caaCrossCheck.authorized ? "Authorized" : "Unauthorized"}
      />
      <div className="[&>div]:!px-4 [&>div]:!py-2.5 [&>div>span]:!size-6">
        <StatusBanner tone={tone} title={caaCrossCheck.note} />
      </div>
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="CAA authorizes" mono>{caaCrossCheck.caaIssuers.join(", ")}</KeyValue>
        <KeyValue label="Live cert issuer">{caaCrossCheck.certificateIssuer}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Operations                                                          */
/* ------------------------------------------------------------------ */

const DnsHistoryCard = () => (
  <Panel>
    <DnsPanelHeader
      icon={History}
      title="Record change history"
      description="Meaningful additions, removals, and value changes"
      action="Answers diffed each check"
    />
    <div className="px-4 py-1">
      {mockDnsMonitor.history.map((event, index) => (
        <div key={event.id} className="relative py-2 pl-7">
          {index < mockDnsMonitor.history.length - 1 ? (
            <span className="absolute bottom-0 left-[6px] top-5 w-px bg-sf-border-faint" />
          ) : null}
          <span className={`absolute left-0 top-[13px] size-3 rounded-full border-2 border-sf-surface ${dotTone[event.tone]}`} />
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <p className={`text-xs font-semibold ${event.tone === "warning" ? "text-sf-amber" : event.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{event.type}</p>
              <time className="font-mono text-[11px] tabular-nums text-sf-text-muted">{event.occurredAt}</time>
            </div>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const DnsAlertRulesCard = () => {
  const activeCount = mockDnsMonitor.alertRules.filter((rule) => rule.enabled).length;

  return (
    <Panel>
      <DnsPanelHeader
        icon={BellRing}
        title="DNS alert rules"
        description="Read-only preview; alert persistence is not implemented"
        action={`${activeCount} of ${mockDnsMonitor.alertRules.length} active · duplicates suppressed`}
      />
      <div className="grid md:grid-cols-2">
        {mockDnsMonitor.alertRules.map((rule) => (
          <div
            key={rule.label}
            className="flex items-start gap-2.5 border-b border-sf-border-faint px-4 py-2.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-r-sf-border-faint"
          >
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${rule.enabled ? "bg-sf-green" : "border border-sf-border bg-sf-bg"}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
                <span className={`shrink-0 text-[10.5px] font-medium ${rule.enabled ? "text-sf-green" : "text-sf-text-muted"}`}>
                  {rule.enabled ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{rule.description}</p>
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

const DnsMonitor = () => (
  <section id="dns-monitoring" className="protocol-detail-theme scroll-mt-16 space-y-3">
    <DnsStatusSummary />

    <DnsSection
      icon={ListTree}
      title="Record inventory"
      description="The normalized record set currently published for this hostname."
      action={`${mockDnsMonitor.records.length} answers · ${mockDnsMonitor.monitoredRecordTypes.length} types`}
    >
      <DnsRecordCard />
    </DnsSection>

    <DnsSection
      icon={Activity}
      title="Resolution & performance"
      description="Lookup latency, the latest authoritative answer, and the delegation path from the root."
    >
      <div className="grid items-start gap-3 lg:grid-cols-2">
        <DnsQueryTrendCard />
        <DnsLastAnswerCard />
      </div>
      <div className="mt-3">
        <DnsDelegationTraceCard />
      </div>
    </DnsSection>

    <DnsSection
      icon={Globe2}
      title="Propagation & authority"
      description="Answer agreement across public resolvers, authoritative-nameserver health, and per-region resolution."
    >
      <DnsPropagationCard />
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <DnsSecurityCard />
        <DnsNameserverCard />
      </div>
      <div className="mt-3">
        <DnsPerRegionCard />
      </div>
    </DnsSection>

    <DnsSection
      icon={ShieldCheck}
      title="Integrity & policy"
      description="Mail authentication, zone authority, expected-value pins, TTL posture, and CA policy."
    >
      <div className="grid items-start gap-3 lg:grid-cols-2">
        <DnsEmailAuthCard />
        <DnsConfigurationCard />
      </div>
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <DnsPinnedRecordsCard />
        <DnsTtlCard />
      </div>
      <div className="mt-3">
        <DnsCaaCrossCheckCard />
      </div>
    </DnsSection>

    <DnsSection
      icon={History}
      title="Operations & activity"
      description="Meaningful DNS changes and the alert policy attached to this hostname."
    >
      <DnsHistoryCard />
      <div className="mt-3">
        <DnsAlertRulesCard />
      </div>
    </DnsSection>
  </section>
);

export default DnsMonitor;
