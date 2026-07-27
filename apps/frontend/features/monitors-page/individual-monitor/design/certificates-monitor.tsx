"use client";

import {
  Activity,
  Ban,
  BellRing,
  CalendarClock,
  Fingerprint,
  History,
  KeyRound,
  Link2,
  ListChecks,
  RefreshCw,
  ScrollText,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  mockTlsCertificate,
  mockTlsCertificateHistory,
  mockTlsRenewalComparison,
} from "../data";
import {
  CheckRow,
  DetailSection,
  KeyValue,
  KeyValueList,
  MiniStat,
  MonitorHeader,
  Panel,
  PanelHeader,
  Pill,
  StatusBanner,
  type HeaderStat,
  type Tone,
} from "../monitor-detail-primitives";
import { RadialGauge, TrendChart } from "../monitor-detail-charts";

/* ------------------------------------------------------------------ */
/* Tone helpers                                                        */
/* ------------------------------------------------------------------ */

const HANDSHAKE_THRESHOLD_MS = 200;

const findingTone: Record<"Pass" | "Warn" | "Fail", Tone> = {
  Pass: "positive",
  Warn: "warning",
  Fail: "negative",
};

const headerStats: HeaderStat[] = [
  { label: "Days left", value: mockTlsCertificate.daysRemaining, tone: "positive", hint: "until expiry" },
  { label: "Handshake p95", value: mockTlsCertificate.p95HandshakeTimeMs, hint: "ms · 24h" },
  { label: "Trust", value: "Trusted", tone: "positive", hint: "system store" },
  { label: "Renews", value: mockTlsCertificate.expiresAt.split(" · ")[0].replace(",", ""), hint: `warns at ${mockTlsCertificate.warningThresholdDays}d` },
];

/* ------------------------------------------------------------------ */
/* Hero — certificate lifetime gauge                                   */
/* ------------------------------------------------------------------ */

const TlsLifetimeHero = () => {
  const { certificateLifetimeDays, elapsedDays, warningThresholdDays, daysRemaining } =
    mockTlsCertificate;
  const usedPercent = Math.round((elapsedDays / certificateLifetimeDays) * 100);
  const warningPercent = Math.round(
    ((certificateLifetimeDays - warningThresholdDays) / certificateLifetimeDays) * 100,
  );
  const healthy = daysRemaining > warningThresholdDays;
  const tone: Tone = healthy ? "positive" : "warning";

  return (
    <Panel>
      <PanelHeader
        icon={CalendarClock}
        tone={tone}
        title="Certificate lifetime"
        description="Validity window with the configured warning boundary"
        action={
          <span className="tabular-nums">
            {certificateLifetimeDays}-day certificate
          </span>
        }
      />
      <div className="grid gap-6 px-5 py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-6">
        <RadialGauge
          percent={usedPercent}
          marker={warningPercent}
          tone={tone}
          value={daysRemaining}
          label="days left"
        />
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
                Valid from
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-sf-text">
                {mockTlsCertificate.validFrom.split(" · ")[0]}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
                Expires
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-sf-text">
                {mockTlsCertificate.expiresAt.split(" · ")[0]}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
                Elapsed
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-sf-text">
                {elapsedDays} / {certificateLifetimeDays} days
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
                Warning at
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-sf-amber">
                {warningThresholdDays} days left
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="relative h-2 overflow-hidden rounded-full bg-sf-border-faint">
              <div
                className="absolute inset-y-0 right-0 bg-sf-amber/15"
                style={{ width: `${100 - warningPercent}%` }}
              />
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${healthy ? "bg-sf-green" : "bg-sf-amber"}`}
                style={{ width: `${usedPercent}%` }}
              />
              <span
                className="absolute -top-1 h-4 w-px bg-sf-amber"
                style={{ left: `${warningPercent}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-sf-text-muted">
              Renewal alerts fire at {mockTlsCertificate.expiryAlertThresholds.join(", ")} days
              before expiry.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Main column — security posture                                      */
/* ------------------------------------------------------------------ */

const TlsHandshakeCard = () => (
  <Panel>
    <PanelHeader
      icon={Activity}
      tone="info"
      title="TLS handshake performance"
      description="Negotiation time, separate from HTTP response time"
      action={<span className="tabular-nums">{HANDSHAKE_THRESHOLD_MS}ms threshold</span>}
    />
    <div className="px-4 pb-2 pt-3 sm:px-5">
      <TrendChart
        values={[...mockTlsCertificate.handshakeTrend]}
        threshold={HANDSHAKE_THRESHOLD_MS}
        tone="info"
        height={188}
      />
    </div>
    <div className="grid grid-cols-3 divide-x divide-sf-border-faint border-t border-sf-border-faint py-4">
      <MiniStat label="Latest" value={mockTlsCertificate.handshakeTimeMs} unit="ms" />
      <MiniStat label="24h avg" value={mockTlsCertificate.averageHandshakeTimeMs} unit="ms" />
      <MiniStat label="24h p95" value={mockTlsCertificate.p95HandshakeTimeMs} unit="ms" />
    </div>
  </Panel>
);

const TlsValidationCard = () => (
  <Panel>
    <PanelHeader
      icon={ShieldCheck}
      tone="positive"
      title="Validation"
      description="Checks applied to the current certificate"
      action="All passing"
    />
    <div className="divide-y divide-sf-border-faint px-5">
      {mockTlsCertificate.validationChecks.map((check) => (
        <CheckRow
          key={check.label}
          tone="positive"
          title={check.label}
          description={check.description}
          status={check.status}
        />
      ))}
    </div>
  </Panel>
);

const TlsConfigScanCard = () => (
  <Panel>
    <PanelHeader
      icon={ListChecks}
      tone="positive"
      title="Protocol & cipher scan"
      description="What the server actually accepts, not just the negotiated session"
      action="Weak protocols refused"
    />
    <div className="border-b border-sf-border-faint px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-sf-text-muted">
        Offered protocols
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {mockTlsCertificate.offeredProtocols.map((protocol) => {
          if (!protocol.enabled) {
            return (
              <span
                key={protocol.name}
                className="rounded-full border border-sf-border bg-sf-bg px-2.5 py-0.5 text-[11px] font-semibold text-sf-text-muted line-through"
              >
                {protocol.name}
              </span>
            );
          }
          return (
            <Pill key={protocol.name} tone={protocol.secure ? "positive" : "negative"}>
              {protocol.name}
            </Pill>
          );
        })}
      </div>
    </div>
    <div className="divide-y divide-sf-border-faint px-5">
      {mockTlsCertificate.configFindings.map((finding) => (
        <CheckRow
          key={finding.label}
          tone={findingTone[finding.status as "Pass" | "Warn" | "Fail"]}
          title={finding.label}
          description={finding.description}
          status={finding.status}
        />
      ))}
    </div>
  </Panel>
);

const TlsCtLogCard = () => {
  const { certificateTransparency: ct } = mockTlsCertificate;
  return (
    <Panel>
      <PanelHeader
        icon={ScrollText}
        tone="positive"
        title="Certificate Transparency"
        description="Public CT-log presence for misissuance detection"
        action={
          <span className="tabular-nums">
            {ct.sctCount} SCTs · {ct.deliveryMethod}
          </span>
        }
      />
      <StatusBanner
        tone="positive"
        title={ct.status}
        description={`Present in ${ct.sctCount} independent logs; unexpected new entries can reveal misissuance.`}
      />
      <div className="divide-y divide-sf-border-faint px-5">
        {ct.logs.map((log) => (
          <div key={log.operator} className="flex items-center justify-between gap-4 py-3">
            <p className="text-xs font-medium text-sf-text">{log.operator}</p>
            <time className="shrink-0 text-[11px] tabular-nums text-sf-text-muted">
              {log.timestamp}
            </time>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const TlsRevocationCard = () => {
  const { revocation } = mockTlsCertificate;
  const revoked = revocation.revokedAt !== null;
  const tone: Tone = revoked ? "negative" : "positive";
  return (
    <Panel>
      <PanelHeader
        icon={Ban}
        tone={tone}
        title="Revocation status"
        description="OCSP and CRL checks, beyond system trust"
        action={revoked ? "Revoked" : "Not revoked"}
      />
      <StatusBanner
        tone={tone}
        icon={revoked ? Ban : ShieldCheck}
        title={`OCSP · ${revocation.ocspStatus}`}
        description={
          revocation.ocspStapled
            ? "Response is stapled to the handshake"
            : "Responder queried directly"
        }
      />
      <KeyValueList>
        <KeyValue label="OCSP stapling" tone={revocation.ocspStapled ? "positive" : undefined}>
          {revocation.ocspStapled ? "Enabled" : "Not stapled"}
        </KeyValue>
        <KeyValue label="OCSP responder" mono>{revocation.ocspResponder}</KeyValue>
        <KeyValue label="Checked">{revocation.ocspCheckedAt}</KeyValue>
        <KeyValue label="Next update">{revocation.ocspNextUpdate}</KeyValue>
        <KeyValue label="CRL status">{revocation.crlStatus}</KeyValue>
      </KeyValueList>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Aside — identity, chain, negotiated security, config                */
/* ------------------------------------------------------------------ */

const TlsIdentityCard = () => (
  <Panel>
    <PanelHeader icon={Shield} title="Certificate identity" />
    <KeyValueList>
      <KeyValue label="Common name">{mockTlsCertificate.subject}</KeyValue>
      <KeyValue label="Issuer">{mockTlsCertificate.issuer}</KeyValue>
      <KeyValue label="Public key">{mockTlsCertificate.publicKey}</KeyValue>
      <KeyValue label="Signature">{mockTlsCertificate.signatureAlgorithm}</KeyValue>
      <KeyValue label="Serial" mono>
        <span className="line-clamp-1" title={mockTlsCertificate.serialNumber}>
          {mockTlsCertificate.serialNumber}
        </span>
      </KeyValue>
      <KeyValue label="SHA-256" mono>
        <span className="line-clamp-1" title={mockTlsCertificate.fingerprintSha256}>
          {mockTlsCertificate.fingerprintSha256}
        </span>
      </KeyValue>
      <div className="py-3">
        <p className="text-xs text-sf-text-muted">Alternative names</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {mockTlsCertificate.subjectAlternativeNames.map((name) => (
            <span
              key={name}
              className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 font-mono text-[11px] text-sf-text"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </KeyValueList>
  </Panel>
);

const TlsChainCard = () => (
  <Panel>
    <PanelHeader
      icon={Link2}
      tone="positive"
      title="Chain & trust"
      description="Observed chain with system trust result"
      action="Trusted"
    />
    <div className="px-5 py-4">
      <div className="space-y-3">
        {mockTlsCertificate.chain.map((certificate, index) => (
          <div key={certificate.name} className="flex items-start gap-3" style={{ paddingLeft: `${index * 14}px` }}>
            <span className="mt-1 size-2 shrink-0 rounded-full bg-sf-green ring-2 ring-sf-green/15" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-sf-text">
                  {certificate.name}
                </span>
                <span className="shrink-0 text-[11px] text-sf-text-muted">
                  {certificate.role}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-sf-text-muted">
                <span className="tabular-nums">Expires {certificate.expiresAt}</span>
                <span className="font-mono">{certificate.fingerprint}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

const TlsSecurityCard = () => (
  <Panel>
    <PanelHeader
      icon={KeyRound}
      tone="positive"
      title="Negotiated security"
      description="Connection security from the latest handshake"
      action={mockTlsCertificate.forwardSecrecy ? "PFS active" : "No PFS"}
    />
    <KeyValueList>
      <KeyValue label="Protocol" tone="positive">{mockTlsCertificate.tlsVersion}</KeyValue>
      <KeyValue label="Cipher suite" mono>{mockTlsCertificate.cipherSuite}</KeyValue>
      <KeyValue label="Key exchange" mono>{mockTlsCertificate.keyExchange}</KeyValue>
      <KeyValue label="ALPN" mono>{mockTlsCertificate.alpnProtocol}</KeyValue>
      <KeyValue label="Forward secrecy" tone="positive">
        {mockTlsCertificate.forwardSecrecy ? "Enabled" : "Unavailable"}
      </KeyValue>
    </KeyValueList>
  </Panel>
);

const TlsPinningCard = () => {
  const { pinning } = mockTlsCertificate;
  const tone: Tone = pinning.matches ? "positive" : "negative";
  return (
    <Panel>
      <PanelHeader
        icon={Fingerprint}
        tone={tone}
        title="Fingerprint pin"
        description="Alerts on any unexpected certificate change"
        action={pinning.matches ? "Pin matches" : "Pin broken"}
      />
      <StatusBanner
        tone={tone}
        title={pinning.matches ? "Live certificate matches the pin" : "Live certificate does not match the pin"}
        description={
          pinning.autoRepinOnRenewal
            ? "Pin re-anchors automatically on detected renewals"
            : "Pin is fixed until manually updated"
        }
      />
      <div className="space-y-3 px-5 py-4">
        {[
          ["Pinned", pinning.pinnedFingerprint],
          ["Current", pinning.currentFingerprint],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sf-text-muted">
              {label}
            </p>
            <p className="mt-1 break-all font-mono text-[11px] text-sf-text">{value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const TlsConnectionCard = () => (
  <Panel>
    <PanelHeader
      icon={Server}
      title="Connection & schedule"
      description="Read-only prototype configuration"
    />
    <KeyValueList>
      <KeyValue label="Hostname" mono>{mockTlsCertificate.hostname}</KeyValue>
      <KeyValue label="Port">{mockTlsCertificate.port}</KeyValue>
      <KeyValue label="Connection timeout">{mockTlsCertificate.connectionTimeout}</KeyValue>
      <KeyValue label="Check interval">{mockTlsCertificate.checkInterval}</KeyValue>
      <KeyValue label="Last checked">{mockTlsCertificate.lastChecked}</KeyValue>
      <KeyValue label="Next check" tone="info">{mockTlsCertificate.nextCheck}</KeyValue>
      <KeyValue label="Next expiry alert">
        {mockTlsCertificate.nextExpiryAlert.estimatedAt} · in{" "}
        {mockTlsCertificate.nextExpiryAlert.dueInDays} days
      </KeyValue>
    </KeyValueList>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

const TlsRenewalComparisonCard = () => (
  <Panel>
    <PanelHeader
      icon={RefreshCw}
      title="Latest renewal comparison"
      description="What changed when the latest certificate was detected"
      action={mockTlsRenewalComparison.detectedAt}
    />
    <div className="grid gap-3 p-5 sm:grid-cols-2">
      {[
        { label: "Previous certificate", certificate: mockTlsRenewalComparison.previous },
        { label: "Current certificate", certificate: mockTlsRenewalComparison.current },
      ].map(({ label, certificate }) => (
        <div key={label} className="rounded-md border border-sf-border bg-sf-bg p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sf-text-muted">
            {label}
          </p>
          <dl className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Issuer</dt>
              <dd className="text-right font-medium text-sf-text">{certificate.issuer}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Expires</dt>
              <dd className="text-right font-medium tabular-nums text-sf-text">
                {certificate.expiresAt}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Fingerprint</dt>
              <dd className="font-mono text-[11px] text-sf-text">{certificate.fingerprint}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  </Panel>
);

const TlsHistoryCard = () => (
  <Panel>
    <PanelHeader
      icon={History}
      title="Snapshot & renewal history"
      description="Only meaningful certificate state changes are stored"
      action="Fingerprint and serial changes"
    />
    <div className="px-5 py-2">
      {mockTlsCertificateHistory.map((event, index) => (
        <div
          key={event.id}
          className="relative grid gap-3 py-3 pl-7 sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          {index < mockTlsCertificateHistory.length - 1 ? (
            <span className="absolute bottom-0 left-[7px] top-6 w-px bg-sf-border-faint" />
          ) : null}
          <span
            className={`absolute left-0 top-[17px] size-3.5 rounded-full border-2 border-sf-surface ${
              index < 2 ? "bg-sf-green" : "bg-sf-text-muted"
            }`}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-xs font-semibold ${index < 2 ? "text-sf-green" : "text-sf-text"}`}>
                {event.title}
              </p>
              <span className="rounded-sf bg-sf-bg px-1.5 py-0.5 text-[11px] text-sf-text-muted">
                {event.detail}
              </span>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">{event.description}</p>
          </div>
          <time className="text-[11px] tabular-nums text-sf-text-muted sm:text-right">
            {event.occurredAt}
          </time>
        </div>
      ))}
    </div>
  </Panel>
);

const TlsAlertRulesCard = () => (
  <Panel>
    <PanelHeader
      icon={BellRing}
      title="Alert rules"
      description="Read-only preview; per-rule editing can follow alert persistence"
      action="Duplicate alerts suppressed"
    />
    <div className="grid md:grid-cols-2">
      {mockTlsCertificate.alertRules.map((rule) => (
        <div
          key={rule.label}
          className="flex items-start gap-3 border-b border-sf-border-faint px-5 py-3.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:odd:border-r md:odd:border-r-sf-border-faint"
        >
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sf-green" aria-hidden="true" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-sf-green">
                Enabled
              </span>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">{rule.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CertificatesMonitor = () => (
  <section id="tls-monitoring" className="scroll-mt-16 space-y-4">
    <MonitorHeader
      icon={ShieldCheck}
      tone="positive"
      title="TLS certificate"
      status={<Pill tone="positive" dot>Valid</Pill>}
      target={`${mockTlsCertificate.hostname}:${mockTlsCertificate.port}`}
      meta={
        <>
          Checked {mockTlsCertificate.lastChecked} · next check{" "}
          {mockTlsCertificate.nextCheck}
        </>
      }
      stats={headerStats}
    />

    <TlsLifetimeHero />

    <DetailSection
      icon={Shield}
      title="Certificate identity & trust"
      description="The certificate presented by the endpoint, its identity claims, and the chain that anchors system trust."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 [&>.sf-panel]:h-full">
          <TlsIdentityCard />
        </div>
        <div className="lg:col-span-5 [&>.sf-panel]:h-full">
          <TlsChainCard />
        </div>
      </div>
    </DetailSection>

    <DetailSection
      icon={Activity}
      title="Handshake & transport"
      description="Negotiation latency and the protocol parameters observed during the latest successful TLS session."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 [&>.sf-panel]:h-full">
          <TlsHandshakeCard />
        </div>
        <div className="lg:col-span-4 [&>.sf-panel]:h-full">
          <TlsConnectionCard />
        </div>
      </div>
    </DetailSection>

    <DetailSection
      icon={ShieldCheck}
      title="Security posture"
      description="Trust validation, protocol hardening, revocation, transparency, and fingerprint integrity."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6 [&>.sf-panel]:h-full">
          <TlsValidationCard />
        </div>
        <div className="lg:col-span-6 [&>.sf-panel]:h-full">
          <TlsConfigScanCard />
        </div>
        <div className="lg:col-span-6 [&>.sf-panel]:h-full">
          <TlsRevocationCard />
        </div>
        <div className="lg:col-span-6 [&>.sf-panel]:h-full">
          <TlsPinningCard />
        </div>
        <div className="lg:col-span-7 [&>.sf-panel]:h-full">
          <TlsCtLogCard />
        </div>
        <div className="lg:col-span-5 [&>.sf-panel]:h-full">
          <TlsSecurityCard />
        </div>
      </div>
    </DetailSection>

    <DetailSection
      icon={History}
      title="Renewal & activity"
      description="Certificate changes, renewal context, and the alert policy protecting this endpoint."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 [&>.sf-panel]:h-full">
          <TlsRenewalComparisonCard />
        </div>
        <div className="lg:col-span-5 [&>.sf-panel]:h-full">
          <TlsHistoryCard />
        </div>
        <div className="lg:col-span-12">
          <TlsAlertRulesCard />
        </div>
      </div>
    </DetailSection>
  </section>
);

export default CertificatesMonitor;
