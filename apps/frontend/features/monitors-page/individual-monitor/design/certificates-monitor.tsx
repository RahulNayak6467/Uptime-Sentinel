"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  BellRing,
  Clock,
  FileText,
  History,
  Link2,
  Lock,
  MapPin,
  Pin,
  RefreshCw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  CheckRow,
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
import { useTlsDetail } from "../hooks/useTlsDetail";
import { useTlsHandshakeLatency } from "../hooks/useTlsHandshakeLatency";
import { useTlsHistory } from "../hooks/useTlsHistory";
import type { TlsLatencyRange } from "../types";
import {
  buildCertificateView,
  buildHandshakeTrendView,
  buildHistoryView,
  type CertificateView,
} from "./certificate-view";

const LATENCY_RANGES: TlsLatencyRange[] = ["7d", "30d", "90d", "1y"];

/* Subject Alternative Names — capped chip list with a "+N more" toggle. */
const SAN_VISIBLE_LIMIT = 6;

const SanList = ({ sans }: { sans: readonly string[] }) => {
  const [expanded, setExpanded] = useState(false);

  const hiddenCount = sans.length - SAN_VISIBLE_LIMIT;
  const visibleSans = expanded ? sans : sans.slice(0, SAN_VISIBLE_LIMIT);

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pt-3">
      {visibleSans.map((san) => (
        <span
          key={san}
          className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 font-mono text-[11px] text-sf-text-sub"
        >
          {san}
        </span>
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="rounded-sf border border-sf-border bg-sf-surface px-2 py-0.5 font-sans text-[11px] font-medium text-sf-text-sub transition-colors hover:text-sf-text"
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </div>
  );
};

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

const summaryToneClasses: Record<
  CertificateView["statusTone"],
  { border: string; bg: string; text: string }
> = {
  positive: { border: "border-sf-green-border", bg: "bg-sf-green-bg", text: "text-sf-green" },
  warning: { border: "border-sf-amber-border", bg: "bg-sf-amber-bg", text: "text-sf-amber" },
  negative: { border: "border-sf-red-border", bg: "bg-sf-red-bg", text: "text-sf-red" },
};

const TlsPanelHeader = ({
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

const TlsSection = ({
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
  value: ReactNode;
  tone?: "positive";
}) => (
  <div className="flex items-center justify-between gap-3 py-1.5">
    <span className="text-xs text-sf-text-muted">{label}</span>
    <span className={`text-right text-[12.5px] font-medium ${tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>
      {value}
    </span>
  </div>
);

const checkTone: Record<"Pass" | "Warn" | "Fail", Tone> = {
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

const TlsStatusSummary = ({ cert }: { cert: CertificateView }) => {
  const tone = summaryToneClasses[cert.statusTone];
  const headerStats: HeaderStat[] = [
    { label: "Days remaining", value: cert.daysRemaining, hint: `expires ${cert.expiresAt}` },
    { label: "Handshake", value: `${cert.handshakeMs}ms`, hint: `p95 ${cert.p95Ms}ms` },
    { label: "Protocol", value: cert.protocol, hint: cert.cipherSummary },
    { label: "Key", value: cert.key, hint: cert.keySummary },
    { label: "Renewals", value: cert.renewals, hint: "last 12 months" },
    { label: "Last scan", value: cert.lastScan, hint: "every 12h" },
  ];

  return (
    <div className="space-y-2.5">
      <Panel className="relative bg-sf-surface">
        <div className="flex items-start gap-3.5 px-[18px] py-4">
          <span className={`flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border ${tone.border} ${tone.bg} ${tone.text}`}>
            <ShieldCheck className="size-[17px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[16.5px] font-semibold leading-none tracking-[-0.015em] text-sf-text">
                {cert.statusLabel}
              </h1>
              <Pill tone={cert.statusTone}>Grade {cert.grade}</Pill>
              <Pill tone="neutral">{cert.protocol}</Pill>
            </div>
            <p className="mt-2 font-mono text-[11.5px] text-sf-text-sub">
              {cert.host}:{cert.port}
            </p>
            <p className="mt-1 max-w-4xl text-[12.5px] leading-[1.55] text-sf-text-muted">
              Live handshake against {cert.host}:{cert.port} · chain, hostname, expiry and revocation checked each scan.
            </p>
          </div>
        </div>
      </Panel>

      <Panel>
        <dl className="grid grid-cols-2 gap-px bg-sf-border-faint sm:grid-cols-3 xl:grid-cols-6">
          {headerStats.map((stat) => (
            <div key={stat.label} className="min-w-0 bg-sf-surface px-4 py-3">
              <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-sf-text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1.5 truncate text-[16px] font-semibold leading-[1.15] tracking-[-0.015em] tabular-nums text-sf-text">
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
};

const TlsLifetimeCard = ({ cert }: { cert: CertificateView }) => {
  const { lifetime } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={Clock}
        title="Certificate lifetime"
        description="Every certificate served by this host"
        action={<span className="text-sf-text-muted">diffed by fingerprint</span>}
      />
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-sf-border bg-sf-border-faint sm:grid-cols-5">
          {lifetime.certs.map((cert, index) => (
            <div
              key={`${cert.fp}-${index}`}
              className={`flex min-w-0 flex-col gap-1 px-3 py-2.5 ${
                cert.current ? "bg-sf-green-bg" : "bg-sf-bg"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 shrink-0 rounded-full ${cert.current ? "bg-sf-green" : "bg-sf-text-muted"}`} />
                <span className={`truncate text-[11.5px] ${cert.current ? "font-semibold text-sf-green" : "font-medium text-sf-text"}`}>
                  {cert.seen}
                </span>
                {cert.current ? (
                  <span className="ml-auto shrink-0 text-[9px] font-semibold uppercase tracking-wide text-sf-green">
                    Current
                  </span>
                ) : null}
              </div>
              <span className="truncate pl-3 font-mono text-[10.5px] tracking-tight text-sf-text-muted">
                {cert.fp}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 border-t border-sf-border-faint px-4 sm:grid-cols-3 sm:gap-x-6">
        <FooterRow label="Current certificate" value={lifetime.currentRange} />
        <FooterRow label="Remaining" value={lifetime.remaining} tone="positive" />
        <FooterRow label="Avg renewal lead" value={lifetime.avgRenewalLead} />
      </div>
    </Panel>
  );
};

const TlsHandshakeCard = ({ cert }: { cert: CertificateView }) => {
  const { handshake } = cert;
  const total = handshake.totalMs || 1;
  const rows = handshake.phases.map((phase, index) => ({
    ...phase,
    start: handshake.phases
      .slice(0, index)
      .reduce((elapsed, previousPhase) => elapsed + previousPhase.ms, 0),
  }));
  return (
    <Panel>
      <TlsPanelHeader
        icon={Zap}
        tone="info"
        title="Handshake"
        description="Per-phase timing of the last live scan"
        action={<span className="tabular-nums text-sf-text-muted">{handshake.totalMs}ms total</span>}
      />
      <div className="flex items-center justify-between px-4 pt-2.5 text-[10.5px] uppercase tracking-[0.06em] text-sf-text-muted">
        <span>0</span>
        <span>{Math.round(total / 2)}ms</span>
        <span>{total}ms</span>
      </div>
      <div className="space-y-2 px-4 py-2.5">
        {rows.map((phase, index) => (
          <div key={phase.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-sf-text">{phase.label}</p>
              <p className="mt-0.5 truncate text-[11px] text-sf-text-muted">{phase.detail}</p>
              <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded-[3px] bg-sf-border-faint">
                <div
                  className={`absolute h-full rounded-[3px] bg-[var(--sf-protocol-accent)] ${
                    index === 0 ? "opacity-40" : index === 1 ? "opacity-70" : "opacity-100"
                  }`}
                  style={{ left: `${(phase.start / total) * 100}%`, width: `${(phase.ms / total) * 100}%` }}
                />
              </div>
            </div>
            <span className="shrink-0 tabular-nums text-xs font-semibold text-sf-text">{phase.ms}ms</span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const TlsHandshakeLatencyCard = ({
  trend,
  range,
  onRangeChange,
}: {
  trend: ReturnType<typeof buildHandshakeTrendView> | null;
  range: TlsLatencyRange;
  onRangeChange: (range: TlsLatencyRange) => void;
}) => (
  <Panel>
    <TlsPanelHeader
      icon={Activity}
      tone="info"
      title="Handshake latency"
      description="Full handshake time over the selected window"
      action={
        <span className="inline-flex overflow-hidden rounded-sf border border-sf-border text-[11px] font-semibold">
          {LATENCY_RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`px-2 py-0.5 ${
                option === range
                  ? "bg-[var(--sf-protocol-accent-soft)] text-[var(--sf-protocol-accent)]"
                  : "text-sf-text-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </span>
      }
    />
    {trend ? (
      <>
        <div className="px-4 pb-2 pt-2.5">
          <TrendChart
            series={[
              { name: "p50", values: trend.values },
              { name: "p95", values: trend.p95Values },
            ]}
            categories={trend.categories}
            tone="info"
            height={200}
            area={false}
          />
        </div>
        <PercentileStrip
          ariaLabel="TLS handshake latency summary"
          metrics={[
            { label: "Latest", value: trend.latestMs, unit: "ms" },
            { label: "Average", value: trend.averageMs, unit: "ms" },
            { label: "p50", value: trend.p50Ms, unit: "ms", color: "var(--sf-protocol-accent)" },
            { label: "p75", value: trend.p75Ms, unit: "ms" },
            { label: "p90", value: trend.p90Ms, unit: "ms" },
            { label: "p95", value: trend.p95Ms, unit: "ms", color: "var(--sf-percentile-p95)" },
            { label: "p99", value: trend.p99Ms, unit: "ms", color: "var(--sf-percentile-p99)" },
            { label: "p99.9", value: trend.p999Ms, unit: "ms", color: "var(--sf-percentile-p999)" },
            { label: "Max", value: trend.maxMs, unit: "ms" },
          ]}
        />
      </>
    ) : (
      <div className="px-4 py-10 text-center text-[12px] text-sf-text-muted">Loading latency…</div>
    )}
  </Panel>
);

const TlsSecurityGradeCard = ({ cert }: { cert: CertificateView }) => {
  const { securityGrade } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={ShieldCheck}
        title="Security grade"
        description="Aggregate score recomputed every scan"
        action={<span className="text-sf-text-muted">recomputed every scan</span>}
      />
      <div className="flex items-start gap-3 px-4 pt-3">
        <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-sf-green-border bg-sf-green-bg">
          <span className="text-[25px] font-bold leading-none tracking-[-0.03em] text-sf-green">{securityGrade.grade}</span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-sf-green">Grade</span>
        </span>
        <p className="text-[11.5px] leading-relaxed text-sf-text-muted">{securityGrade.summary}</p>
      </div>
      <div className="space-y-2 px-4 py-3">
        {securityGrade.scores.map((score) => (
          <div key={score.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-sf-text">{score.label}</span>
              <span className="font-semibold tabular-nums text-sf-text">{score.value}</span>
            </div>
            <div className="mt-1 h-[5px] w-full overflow-hidden rounded-[3px] bg-sf-border-faint">
              <div className="h-full rounded-[3px] bg-sf-text-sub" style={{ width: `${score.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      {securityGrade.chips.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 border-t border-sf-border-faint px-4 py-2.5">
          {securityGrade.chips.map((chip) => (
            <Pill key={chip} tone="neutral">{chip}</Pill>
          ))}
        </div>
      ) : null}
    </Panel>
  );
};

const TlsLeafCard = ({ cert }: { cert: CertificateView }) => {
  const { leaf } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={FileText}
        title="Leaf certificate"
        description="The certificate presented for the monitored hostname"
      />
      <SanList sans={leaf.sans} />
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="Common name" mono>{leaf.commonName}</KeyValue>
        <KeyValue label="Issuer">{leaf.issuer}</KeyValue>
        <KeyValue label="Signature">{leaf.signature}</KeyValue>
        <KeyValue label="Public key">{leaf.publicKey}</KeyValue>
        <KeyValue label="Valid from">{leaf.validFrom}</KeyValue>
        <KeyValue label="Valid to">{leaf.validTo}</KeyValue>
        <KeyValue label="Serial" mono>{leaf.serial}</KeyValue>
        <KeyValue label="SHA-256" mono>{leaf.sha256}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

const TlsChainCard = ({ cert }: { cert: CertificateView }) => {
  const { chain } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={Link2}
        title="Chain of trust"
        description="Path from the leaf up to a trusted root"
        action={
          <span className="flex items-center gap-2">
            <Pill tone="positive">{chain.verified}</Pill>
            <span className="text-[11px] text-sf-text-muted">{chain.sent}</span>
          </span>
        }
      />
      <div className="px-4 py-1">
        {chain.links.map((link, index) => (
          <div key={link.name} className="relative grid gap-0.5 py-2 pl-7">
            {index < chain.links.length - 1 ? (
              <span className="absolute bottom-0 left-[9px] top-7 w-px bg-sf-border-faint" />
            ) : null}
            <span className="absolute left-0 top-2 flex size-[18px] items-center justify-center rounded-[5px] border border-sf-green-border bg-sf-green-bg text-sf-green">
              <ShieldCheck className="size-2.5" strokeWidth={2} />
            </span>
            <div className="flex items-center gap-2">
              <p className="text-[12.5px] font-semibold text-sf-text">{link.name}</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">{link.role}</span>
            </div>
            <p className="text-[11px] text-sf-text-muted">{link.detail}</p>
            <div className="mt-1 h-[5px] w-full overflow-hidden rounded-[3px] bg-sf-border-faint">
              <div className="h-full rounded-[3px] bg-sf-text-sub" style={{ width: `${link.fill}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-sf-border-faint px-4">
        <FooterRow label="Chain order" value={chain.order} tone="positive" />
        <FooterRow label="Hostname match" value={chain.hostnameMatch} tone="positive" />
        <FooterRow label="Path validation" value={chain.pathValidation} />
      </div>
    </Panel>
  );
};

const TlsProtocolCipherCard = ({ cert }: { cert: CertificateView }) => {
  const { protocolFooter } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={SlidersHorizontal}
        title="Protocol & cipher support"
        description="What the server actually accepts, probed each scan"
        action={<Pill tone="positive">{cert.protocol} negotiated</Pill>}
      />
      <TableScroll>
        <table className="w-full min-w-[720px] text-left text-[12.5px]">
          <thead className="border-b border-sf-border bg-sf-bg/70 text-[10.5px] uppercase tracking-[0.07em] text-sf-text-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Protocol</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Suite</th>
              <th className="px-4 py-2 text-right font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {cert.protocols.map((p) => (
              <tr key={p.name}>
                <td className="px-4 py-[9px]">
                  <span className={`flex items-center gap-2 font-semibold ${p.enabled ? "text-sf-text" : "text-sf-text-muted"}`}>
                    <span className={p.enabled ? "text-sf-green" : "text-sf-text-muted"}>{p.enabled ? "✓" : "✕"}</span>
                    {p.name}
                  </span>
                </td>
                <td className="px-3 py-[9px] text-sf-text-muted">{p.status}</td>
                <td className="px-3 py-[9px] font-mono text-xs text-sf-text">{p.cipherSuite ?? "—"}</td>
                <td className={`px-4 py-[9px] text-right font-semibold ${p.rating === "Fail" ? "text-sf-red" : p.rating === "Warn" ? "text-sf-amber" : "text-sf-green"}`}>{p.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
      <div className="grid grid-cols-1 border-t border-sf-border-faint px-4 sm:grid-cols-2 sm:gap-x-6">
        <FooterRow label="Forward secrecy" value={protocolFooter.forwardSecrecy} tone="positive" />
        <FooterRow label="ALPN" value={protocolFooter.alpn} />
      </div>
    </Panel>
  );
};

const TlsRegionCard = () => (
  <Panel>
    <TlsPanelHeader
      icon={MapPin}
      title="Certificate served per region"
      description="A mismatch means an edge node is serving an old certificate"
      action={<ComingSoon />}
    />
    <div className="relative overflow-hidden">
      <BlurredContent>
        <div className="h-40 w-full bg-sf-bg" />
      </BlurredContent>
      <div className="absolute inset-0 flex items-center justify-center bg-sf-surface/90 p-6">
        <div className="max-w-sm px-5 py-4 text-center">
          <MapPin className="mx-auto size-5 text-[var(--sf-protocol-accent)]" aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold text-sf-text">Regional certificate checks are coming soon</p>
          <p className="mt-1 text-xs leading-5 text-sf-text-muted">
            Certificate consistency and handshake latency by region will appear here when multi-region monitoring is available.
          </p>
        </div>
      </div>
    </div>
  </Panel>
);

const TlsValidationCard = ({ cert }: { cert: CertificateView }) => (
  <Panel>
    <TlsPanelHeader
      icon={ShieldCheck}
      title="Validation"
      description="Trust, expiry, and hostname checks · every scan"
      action="Every scan"
    />
    <div className="px-4">
      {cert.validation.map((check) => (
        <div key={check.label} className="border-b border-sf-border-faint py-0.5 last:border-b-0 [&>div]:!gap-2.5 [&>div]:!py-2 [&>div>span]:!size-[18px]">
          <CheckRow tone={checkTone[check.status]} title={check.label} description={check.description} />
        </div>
      ))}
    </div>
  </Panel>
);

const TlsRevocationCard = ({ cert }: { cert: CertificateView }) => {
  const { revocationFooter } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={Lock}
        title="Revocation, CT & issuance policy"
        description="OCSP, certificate transparency, and CAA issuance controls"
        action={<Pill tone="positive">Good</Pill>}
      />
      <div className="divide-y divide-sf-border-faint px-4">
        {cert.revocation.map((check) => (
          <div key={check.label} className="py-0.5 [&>div]:!gap-2.5 [&>div]:!py-2 [&>div>span]:!size-[18px]">
            <CheckRow tone={checkTone[check.status]} title={check.label} description={check.description} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 border-t border-sf-border-faint px-4 sm:grid-cols-2 sm:gap-x-6">
        <FooterRow label="OCSP responder" value={<span className="font-mono">{revocationFooter.ocspResponder}</span>} />
        <FooterRow label="Next OCSP update" value={revocationFooter.nextOcspUpdate} />
        <FooterRow label="CT logs" value={revocationFooter.ctLogs} />
        <FooterRow label="CAA iodef" value={<span className="font-mono">{revocationFooter.caaIodef}</span>} />
        <FooterRow label="Must-staple" value={revocationFooter.mustStaple} />
      </div>
    </Panel>
  );
};

const TlsHistoryCard = ({ history }: { history: ReturnType<typeof buildHistoryView> }) => (
  <Panel>
    <TlsPanelHeader
      icon={History}
      title="Certificate history"
      description="Renewals, protocol changes, and recovery events"
      action="Diffed by fingerprint · duplicates ignored"
    />
    <div className="px-4 py-1">
      {history.length === 0 ? (
        <p className="py-6 text-center text-[12px] text-sf-text-muted">No certificate events recorded yet.</p>
      ) : (
        history.map((event, index) => (
          <div key={event.id} className="relative py-2 pl-7">
            {index < history.length - 1 ? (
              <span className="absolute bottom-0 left-[6px] top-5 w-px bg-sf-border-faint" />
            ) : null}
            <span className={`absolute left-0 top-[13px] size-3 rounded-full border-2 border-sf-surface ${dotTone[event.tone]}`} />
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <p className={`text-xs font-semibold ${event.tone === "positive" ? "text-sf-green" : "text-sf-text"}`}>{event.type}</p>
                <time className="font-mono text-[11px] tabular-nums text-sf-text-muted">{event.occurredAt}</time>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{event.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </Panel>
);

const TlsRenewalComparisonCard = ({ cert }: { cert: CertificateView }) => {
  const { renewalComparison } = cert;
  if (!renewalComparison) {
    return (
      <Panel>
        <TlsPanelHeader
          icon={RefreshCw}
          tone="info"
          title="Latest renewal comparison"
          description="What changed at the most recent certificate rotation"
        />
        <p className="px-4 py-6 text-center text-[12px] text-sf-text-muted">
          No renewal observed yet — a comparison appears after the first rotation.
        </p>
      </Panel>
    );
  }
  const cols = [
    { key: "previous", label: "Previous", data: renewalComparison.previous, green: false },
    { key: "current", label: "Current", data: renewalComparison.current, green: true },
  ];
  return (
    <Panel>
      <TlsPanelHeader
        icon={RefreshCw}
        tone="info"
        title="Latest renewal comparison"
        description="What changed at the most recent certificate rotation"
        action={<span className="text-sf-text-muted">{renewalComparison.detectedAt}</span>}
      />
      <div className="grid grid-cols-1 divide-y divide-sf-border-faint sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {cols.map((col) => (
          <div key={col.key} className="px-4 py-3">
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${col.green ? "text-sf-green" : "text-sf-text-muted"}`}>
              {col.label}
            </p>
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3"><dt className="text-sf-text-muted">Issuer</dt><dd className="font-medium text-sf-text">{col.data.issuer}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-sf-text-muted">Expires</dt><dd className="font-medium text-sf-text">{col.data.expiresAt}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-sf-text-muted">Key</dt><dd className="font-medium text-sf-text">{col.data.key}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-sf-text-muted">Fingerprint</dt><dd className="font-mono text-[11px] text-sf-text">{col.data.fingerprint}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <div className="border-t border-sf-border-faint px-4 py-2.5">
        <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-sf-text-muted">
          What changed
        </p>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          {renewalComparison.changes.map((change) => (
            <div key={change.label} className="flex items-center justify-between gap-3 py-1">
              <span className="text-xs text-sf-text-muted">{change.label}</span>
              <span className="text-right text-[12px] font-medium text-sf-text">
                {change.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

const TlsPinningCard = ({ cert }: { cert: CertificateView }) => {
  const { pinning } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={Pin}
        title="Fingerprint pin"
        description="Alerts on any unexpected certificate change (MITM / misissuance)"
        action={<Pill tone={pinning.matches ? "positive" : "negative"}>{pinning.matches ? "Pin matches" : "Pin broken"}</Pill>}
      />
      <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
        <KeyValue label="Pinned fingerprint" mono>{pinning.pinnedFingerprint}</KeyValue>
        <KeyValue label="Current fingerprint" mono>{pinning.currentFingerprint}</KeyValue>
        <KeyValue label="Pinned at">{pinning.pinnedAt}</KeyValue>
        <KeyValue label="Last verified">{pinning.lastVerified}</KeyValue>
        <KeyValue label="Auto-repin">{pinning.autoRepin}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

const TlsConfigCard = ({ cert }: { cert: CertificateView }) => {
  const { config } = cert;
  return (
    <Panel>
      <TlsPanelHeader
        icon={Settings2}
        title="Connection & schedule"
        description="Certificate monitor settings and expiry-alert thresholds"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-sf-border-faint">
        <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
          <KeyValue label="Warning threshold">{config.warningThresholdDays}</KeyValue>
          <KeyValue label="Expiry alert thresholds">{config.expiryAlertThresholds}</KeyValue>
          <KeyValue label="Connection timeout">{config.connectionTimeout}</KeyValue>
          <KeyValue label="Min TLS version">{config.minTlsVersion}</KeyValue>
        </KeyValueList>
        <KeyValueList className="!px-4 [&>div]:!gap-4 [&>div]:!py-1.5 [&>div>dd]:!text-[12.5px] [&>div>dt]:!text-xs">
          <KeyValue label="Server name (SNI)" mono>{config.serverName}</KeyValue>
          <KeyValue label="Check interval">{config.checkInterval}</KeyValue>
          <KeyValue label="Next check" tone="info">{config.nextCheck}</KeyValue>
        </KeyValueList>
      </div>
    </Panel>
  );
};

const TlsAlertRulesCard = ({ cert }: { cert: CertificateView }) => {
  const activeCount = cert.alertRules.filter((rule) => rule.enabled).length;

  return (
    <Panel>
      <TlsPanelHeader
        icon={BellRing}
        title="Alert rules"
        description="Which alerts fire for this certificate"
        action={`${activeCount} of ${cert.alertRules.length} active · duplicates suppressed`}
      />
      <div className="grid md:grid-cols-2">
        {cert.alertRules.map((rule) => (
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

const TlsLoading = () => (
  <div className="protocol-detail-theme space-y-3">
    {[0, 1, 2].map((row) => (
      <Panel key={row}>
        <div className="h-28 w-full animate-pulse bg-sf-border-faint/40" />
      </Panel>
    ))}
  </div>
);

const TlsError = ({ onRetry }: { onRetry: () => void }) => (
  <Panel>
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <ShieldCheck className="size-6 text-sf-text-muted" aria-hidden="true" />
      <p className="text-sm font-semibold text-sf-text">Could not load certificate data</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-sf border border-sf-border bg-sf-surface px-3 py-1.5 text-xs font-semibold text-sf-text-sub transition-colors hover:text-sf-text"
      >
        Retry
      </button>
    </div>
  </Panel>
);

const CertificatesMonitor = ({ tlsMonitorId }: { tlsMonitorId: string }) => {
  const [range, setRange] = useState<TlsLatencyRange>("7d");

  const { data: detail, isLoading, isError, refetch } = useTlsDetail(tlsMonitorId);
  const { data: latency } = useTlsHandshakeLatency(tlsMonitorId, range);
  const { data: history } = useTlsHistory(tlsMonitorId);

  if (isLoading) return <TlsLoading />;
  if (isError || !detail) return <TlsError onRetry={() => refetch()} />;

  const cert = buildCertificateView(detail, latency);
  const trend = latency ? buildHandshakeTrendView(latency) : null;
  const historyView = history ? buildHistoryView(history) : [];

  return (
    <section id="infrastructure" className="protocol-detail-theme scroll-mt-16 space-y-3">
      <TlsStatusSummary cert={cert} />

      <TlsSection icon={Clock} title="Lifetime & handshake" description="Certificate rotation history, the last handshake breakdown, and the aggregate security grade.">
        <TlsLifetimeCard cert={cert} />
        <div className="mt-3">
          <TlsHandshakeLatencyCard trend={trend} range={range} onRangeChange={setRange} />
        </div>
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
          <TlsHandshakeCard cert={cert} />
          <TlsSecurityGradeCard cert={cert} />
        </div>
      </TlsSection>

      <TlsSection icon={FileText} title="Certificate & chain" description="The leaf certificate, its path to a trusted root, and the protocols and ciphers the server accepts.">
        <div className="grid items-start gap-3 lg:grid-cols-2">
          <TlsLeafCard cert={cert} />
          <TlsChainCard cert={cert} />
        </div>
        <div className="mt-3">
          <TlsProtocolCipherCard cert={cert} />
        </div>
      </TlsSection>

      <TlsSection icon={ShieldCheck} title="Regional & hardening" description="Per-region certificate consistency, validation and transport hardening, and revocation / CT / issuance policy.">
        <TlsRegionCard />
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
          <TlsValidationCard cert={cert} />
          <TlsRevocationCard cert={cert} />
        </div>
      </TlsSection>

      <TlsSection icon={RefreshCw} title="Renewal & pinning" description="The most recent rotation compared, and the fingerprint pin guarding against unexpected certificate changes.">
        <div className="grid items-start gap-3 lg:grid-cols-2">
          <TlsRenewalComparisonCard cert={cert} />
          <TlsPinningCard cert={cert} />
        </div>
      </TlsSection>

      <TlsSection icon={Settings2} title="Configuration & alerts" description="Monitor settings, expiry-alert thresholds, and the alert policy attached to this certificate.">
        <TlsConfigCard cert={cert} />
        <div className="mt-3">
          <TlsAlertRulesCard cert={cert} />
        </div>
      </TlsSection>

      <TlsSection icon={Activity} title="Activity" description="Renewals, protocol changes, and recovery events for this certificate.">
        <TlsHistoryCard history={historyView} />
      </TlsSection>
    </section>
  );
};

export default CertificatesMonitor;
