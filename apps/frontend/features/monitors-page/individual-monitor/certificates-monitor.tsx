"use client";

import { useParams } from "next/navigation";
import {
  BellRing,
  Check,
  Clock3,
  Gauge,
  History,
  KeyRound,
  Link2,
  MapPin,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../../Overview/components/error";
import MonitorUnchecked from "./monitor-unchecked";
import CheckTooltip from "./check-tooltip";
import { useLastChecks } from "./hooks/useLastChecks";
import {
  mockTlsCertificate,
  mockTlsCertificateHistory,
  mockTlsRenewalComparison,
  RegionalLatencyStats,
} from "./data";

const LastChecksSkeleton = () => (
  <div
    role="status"
    aria-busy="true"
    className="rounded-lg border border-sf-border bg-sf-surface p-5 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="mt-4 grid grid-cols-[repeat(30,minmax(2px,1fr))] gap-1 sm:grid-cols-[repeat(60,minmax(2px,1fr))] xl:grid-cols-[repeat(90,minmax(2px,1fr))]">
      {Array.from({ length: 90 }, (_, index) => (
        <Skeleton key={index} className="h-8 w-full rounded-[2px]" />
      ))}
    </div>
  </div>
);

const LastChecksBar = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useLastChecks(id);

  if (isLoading) return <LastChecksSkeleton />;

  if (isError || !data) {
    return <Error refetch={refetch} />;
  }

  if (data.data.state === "UNCHECKED") {
    return <MonitorUnchecked />;
  }

  const dataChecks = data.data.checks.toReversed().map((check) => ({
    ...check,
    isUp: check.current_status === "UP",
  }));
  const upCount = dataChecks.filter((check) => check.isUp).length;
  const uptimePct = dataChecks.length
    ? Math.round((upCount / dataChecks.length) * 100)
    : null;

  return (
    <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-sf-border px-5 py-4">
        <div>
          <h2 className="text-[14px] font-semibold text-sf-text">
            Recent checks
          </h2>
          <p className="mt-1 text-xs text-sf-text-muted">
            Latest {dataChecks.length} check results, oldest to newest
          </p>
        </div>
        {uptimePct !== null ? (
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-sf-text">
              {uptimePct}%
            </p>
            <p className="mt-0.5 text-xs text-sf-text-muted">
              {upCount}/{dataChecks.length} successful
            </p>
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(dataChecks.length, 1)}, minmax(3px, 1fr))`,
          }}
        >
          {dataChecks.map((check) => (
            <div
              key={`${check.checked_at}-${id}`}
              className={`group relative h-9 rounded-[2px] transition-[filter,transform] duration-150 hover:-translate-y-0.5 hover:brightness-110 ${
                check.isUp ? "bg-sf-green" : "bg-sf-red"
              }`}
            >
              <CheckTooltip
                status={check.current_status}
                responseTime={check.response_time}
                checkedAt={check.checked_at}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-sf-text-muted">
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-sf-green" /> Successful
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-sf-red" /> Failed
          </span>
        </div>
      </div>
    </section>
  );
};

const PlannedOverlay = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-sf-surface/70 backdrop-blur-[2px]">
    <span className="rounded-sf border border-sf-border bg-sf-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
      Coming soon
    </span>
  </div>
);

const SignalCard = ({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof Shield;
  rows: { label: string; value: string }[];
}) => (
  <section className="relative overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <PlannedOverlay />
    <div className="flex items-center gap-2 border-b border-sf-border px-4 py-3">
      <span className="flex size-7 items-center justify-center rounded-md border border-sf-border bg-sf-bg text-sf-text-muted">
        <Icon className="size-3.5" />
      </span>
      <h3 className="text-[13px] font-semibold text-sf-text">{title}</h3>
    </div>
    <dl className="divide-y divide-sf-border">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
          <dt className="text-xs text-sf-text-muted">{row.label}</dt>
          <dd className="text-right text-xs font-medium text-sf-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const TlsPanelHeading = ({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon: typeof Shield;
  action?: string;
}) => (
  <div className="flex items-start justify-between gap-4 border-b border-sf-border px-5 py-4">
    <div className="flex items-start gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-sf-border bg-sf-bg text-sf-text-muted">
        <Icon className="size-3.5" />
      </span>
      <div>
        <h3 className="text-[13px] font-semibold text-sf-text">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-sf-text-muted">{description}</p> : null}
      </div>
    </div>
    {action ? (
      <span className="text-right text-[11px] text-sf-text-muted">{action}</span>
    ) : null}
  </div>
);

const TlsMetricCard = ({
  label,
  value,
  context,
  positive = false,
}: {
  label: string;
  value: string;
  context: string;
  positive?: boolean;
}) => (
  <div className="rounded-lg border border-sf-border bg-sf-surface px-4 py-4 shadow-sm">
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">{label}</p>
    <p className={`mt-2 text-xl font-semibold tabular-nums ${positive ? "text-sf-green" : "text-sf-text"}`}>
      {value}
    </p>
    <p className="mt-1 text-xs text-sf-text-muted">{context}</p>
  </div>
);

const TlsLifetimeCard = () => {
  const usedPercentage = Math.round(
    (mockTlsCertificate.elapsedDays / mockTlsCertificate.certificateLifetimeDays) * 100,
  );
  const warningPercentage = Math.round(
    ((mockTlsCertificate.certificateLifetimeDays - mockTlsCertificate.warningThresholdDays) /
      mockTlsCertificate.certificateLifetimeDays) *
      100,
  );

  return (
    <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
      <TlsPanelHeading
        title="Certificate lifetime"
        description="Validity window and configured warning boundary"
        icon={Clock3}
        action={`${mockTlsCertificate.certificateLifetimeDays}-day certificate · warns at ${mockTlsCertificate.warningThresholdDays} days`}
      />
      <div className="px-5 py-5">
        <div className="relative h-2 overflow-hidden rounded-full bg-sf-border">
          <div
            className="absolute inset-y-0 right-0 bg-sf-amber-bg"
            style={{ width: `${100 - warningPercentage}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-sf-green"
            style={{ width: `${usedPercentage}%` }}
          />
          <span
            className="absolute -top-1 h-4 w-px bg-sf-amber"
            style={{ left: `${warningPercentage}%` }}
          />
        </div>
        <div className="mt-3 grid gap-2 text-xs text-sf-text-muted sm:grid-cols-3">
          <span>Valid from · {mockTlsCertificate.validFrom.split(" · ")[0]}</span>
          <strong className="text-sf-text sm:text-center">
            {mockTlsCertificate.daysRemaining} days remaining
          </strong>
          <span className="sm:text-right">Expires · {mockTlsCertificate.expiresAt.split(" · ")[0]}</span>
        </div>
      </div>
    </section>
  );
};

const TlsCertificateCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading title="Certificate identity" icon={Shield} />
    <dl className="space-y-3 px-5 py-4 text-xs">
      {[
        ["Common name", mockTlsCertificate.subject],
        ["Issuer", mockTlsCertificate.issuer],
        ["Public key", mockTlsCertificate.publicKey],
        ["Signature", mockTlsCertificate.signatureAlgorithm],
        ["Valid from", mockTlsCertificate.validFrom],
        ["Valid to", mockTlsCertificate.expiresAt],
      ].map(([label, value]) => (
        <div key={label} className="grid gap-1 sm:grid-cols-[125px_minmax(0,1fr)]">
          <dt className="text-sf-text-muted">{label}</dt>
          <dd className="text-right font-medium text-sf-text">{value}</dd>
        </div>
      ))}
      <div className="grid gap-2 border-t border-sf-border pt-3 sm:grid-cols-[125px_minmax(0,1fr)]">
        <dt className="text-sf-text-muted">Alternative names</dt>
        <dd className="flex flex-wrap justify-start gap-1.5 sm:justify-end">
          {mockTlsCertificate.subjectAlternativeNames.map((name) => (
            <span key={name} className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 font-mono text-[10px] text-sf-text">
              {name}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  </section>
);

const TlsChainCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="Chain and identity"
      description="Observed chain with system trust result"
      icon={Link2}
    />
    <div className="px-5 py-4">
      <div className="space-y-3">
        {mockTlsCertificate.chain.map((certificate, index) => (
          <div
            key={certificate.name}
            className="flex items-start gap-3"
            style={{ paddingLeft: `${index * 12}px` }}
          >
            <span className="mt-1 size-2 shrink-0 rounded-full bg-sf-green" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-sf-text">
                  {certificate.name}
                </span>
                <span className="text-[11px] text-sf-text-muted">{certificate.role}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-sf-text-muted">
                <span>Expires {certificate.expiresAt}</span>
                <span>{certificate.fingerprint}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <dl className="mt-5 space-y-3 border-t border-sf-border pt-4 text-xs">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-sf-text-muted">Trust result</dt>
          <dd className="font-semibold text-sf-green">Trusted by system</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-sf-text-muted">Serial</dt>
          <dd className="max-w-[70%] truncate font-mono text-sf-text" title={mockTlsCertificate.serialNumber}>
            {mockTlsCertificate.serialNumber}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-sf-text-muted">SHA-256</dt>
          <dd className="max-w-[70%] truncate font-mono text-sf-text" title={mockTlsCertificate.fingerprintSha256}>
            {mockTlsCertificate.fingerprintSha256}
          </dd>
        </div>
      </dl>
    </div>
  </section>
);

const TlsValidationCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading title="Validation" description="Checks applied to the current certificate" icon={ShieldCheck} />
    <div className="divide-y divide-sf-border px-5">
      {mockTlsCertificate.validationChecks.map((check) => (
        <div key={check.label} className="flex items-center gap-3 py-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-sf-green-border bg-sf-green-bg text-sf-green">
            <Check className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-sf-text">{check.label}</p>
            <p className="mt-0.5 text-[11px] text-sf-text-muted">{check.description}</p>
          </div>
          <span className="text-xs font-semibold text-sf-green">{check.status}</span>
        </div>
      ))}
    </div>
  </section>
);

const TlsConnectionCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading title="Connection and monitoring" description="Read-only prototype configuration" icon={Server} />
    <dl className="space-y-4 px-5 py-4 text-xs">
      {[
        ["Hostname", mockTlsCertificate.hostname],
        ["Port", String(mockTlsCertificate.port)],
        ["SNI server name", mockTlsCertificate.hostname],
        ["Connection timeout", mockTlsCertificate.connectionTimeout],
        ["Check interval", mockTlsCertificate.checkInterval],
        ["Expiry warning", `${mockTlsCertificate.warningThresholdDays} days before expiry`],
        ["Last checked", mockTlsCertificate.lastChecked],
        ["Last fully valid", mockTlsCertificate.lastSuccessfulValidation],
      ].map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-5">
          <dt className="text-sf-text-muted">{label}</dt>
          <dd className="text-right font-medium text-sf-text">{value}</dd>
        </div>
      ))}
    </dl>
  </section>
);

const TlsSecurityCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="TLS security"
      description="Negotiated connection security from the latest handshake"
      icon={KeyRound}
      action="No security warnings"
    />
    <div className="grid gap-3 p-5 sm:grid-cols-2">
      {[
        ["Protocol", mockTlsCertificate.tlsVersion],
        ["Cipher suite", mockTlsCertificate.cipherSuite],
        ["Key exchange", mockTlsCertificate.keyExchange],
        ["Application protocol", mockTlsCertificate.alpnProtocol],
      ].map(([label, value]) => (
        <div key={label} className="rounded-md border border-sf-border bg-sf-bg p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
            {label}
          </p>
          <p className="mt-1.5 break-all font-mono text-xs font-medium text-sf-text">
            {value}
          </p>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-3 border-t border-sf-border px-5 py-3.5">
      <span className="flex size-6 items-center justify-center rounded-full border border-sf-green-border bg-sf-green-bg text-sf-green">
        <Check className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-sf-text">Perfect Forward Secrecy</p>
        <p className="mt-0.5 text-[11px] text-sf-text-muted">
          Ephemeral key exchange is active for this connection
        </p>
      </div>
      <span className="text-xs font-semibold text-sf-green">
        {mockTlsCertificate.forwardSecrecy ? "Enabled" : "Unavailable"}
      </span>
    </div>
  </section>
);

const TlsHandshakeCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="TLS handshake performance"
      description="Certificate negotiation time, separate from HTTP response time"
      icon={Gauge}
      action="Latest check"
    />
    <div className="grid grid-cols-3 divide-x divide-sf-border px-2 py-5">
      {[
        ["Latest", mockTlsCertificate.handshakeTimeMs],
        ["24h average", mockTlsCertificate.averageHandshakeTimeMs],
        ["24h p95", mockTlsCertificate.p95HandshakeTimeMs],
      ].map(([label, value]) => (
        <div key={label} className="px-3 text-center">
          <p className="text-lg font-semibold tabular-nums text-sf-text">
            {value}
            <span className="ml-0.5 text-xs font-medium text-sf-text-muted">ms</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-sf-text-muted">
            {label}
          </p>
        </div>
      ))}
    </div>
    <div className="border-t border-sf-border px-5 py-3.5 text-xs text-sf-text-muted">
      Handshake latency is healthy and remains below the 200ms review threshold.
    </div>
  </section>
);

const TlsNextAlertCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="Next expiry alert"
      description="Preview of the next notification in the expiry schedule"
      icon={BellRing}
      action={mockTlsCertificate.nextExpiryAlert.estimatedAt}
    />
    <div className="px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-sf-text">
            In {mockTlsCertificate.nextExpiryAlert.dueInDays} days
          </p>
          <p className="mt-1 text-xs text-sf-text-muted">
            Sends the {mockTlsCertificate.nextExpiryAlert.thresholdDays}-day expiry warning
          </p>
        </div>
        <span className="w-fit rounded-full border border-sf-blue/30 bg-sf-blue-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sf-blue">
          Scheduled
        </span>
      </div>
      <div className="mt-5 flex items-center">
        {mockTlsCertificate.expiryAlertThresholds.map((threshold, index) => (
          <div key={threshold} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex size-7 items-center justify-center rounded-full border border-sf-border bg-sf-bg text-[10px] font-semibold text-sf-text">
                {threshold}
              </span>
              <span className="text-[9px] text-sf-text-muted">days</span>
            </div>
            {index < mockTlsCertificate.expiryAlertThresholds.length - 1 ? (
              <span className="mx-2 mb-4 h-px flex-1 bg-sf-border" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TlsRenewalComparisonCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="Latest renewal comparison"
      description="What changed when the latest certificate was detected"
      icon={RefreshCw}
      action={mockTlsRenewalComparison.detectedAt}
    />
    <div className="grid gap-3 p-5 sm:grid-cols-2">
      {[
        {
          label: "Previous certificate",
          certificate: mockTlsRenewalComparison.previous,
        },
        {
          label: "Current certificate",
          certificate: mockTlsRenewalComparison.current,
        },
      ].map(({ label, certificate }) => (
        <div key={label} className="rounded-md border border-sf-border bg-sf-bg p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
            {label}
          </p>
          <dl className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Issuer</dt>
              <dd className="text-right font-medium text-sf-text">{certificate.issuer}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Expires</dt>
              <dd className="text-right font-medium text-sf-text">{certificate.expiresAt}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sf-text-muted">Fingerprint</dt>
              <dd className="font-mono text-[10px] text-sf-text">{certificate.fingerprint}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  </section>
);

const TlsHistoryCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="Snapshot and renewal history"
      description="Only meaningful certificate state changes are stored"
      icon={History}
      action="Fingerprint and serial changes"
    />
    <div className="px-5 py-2">
      {mockTlsCertificateHistory.map((event, index) => (
        <div key={event.id} className="relative grid gap-3 py-3 pl-7 sm:grid-cols-[minmax(0,1fr)_auto]">
          {index < mockTlsCertificateHistory.length - 1 ? (
            <span className="absolute bottom-0 left-[7px] top-6 w-px bg-sf-border" />
          ) : null}
          <span className={`absolute left-0 top-[17px] size-3.5 rounded-full border-2 border-sf-surface ${index < 2 ? "bg-sf-green" : "bg-sf-text-muted"}`} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-xs font-semibold ${index < 2 ? "text-sf-green" : "text-sf-text"}`}>{event.title}</p>
              <span className="rounded-sf bg-sf-bg px-1.5 py-0.5 font-mono text-[10px] text-sf-text-muted">{event.detail}</span>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">{event.description}</p>
          </div>
          <time className="text-[11px] text-sf-text-muted sm:text-right">{event.occurredAt}</time>
        </div>
      ))}
    </div>
  </section>
);

const TlsAlertRulesCard = () => (
  <section className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <TlsPanelHeading
      title="Alert rules"
      description="Read-only preview; per-rule editing can follow alert persistence"
      icon={BellRing}
      action="Duplicate alerts suppressed"
    />
    <div className="grid gap-x-10 md:grid-cols-2">
      {mockTlsCertificate.alertRules.map((rule) => (
        <div key={rule.label} className="flex items-start gap-3 border-b border-sf-border px-5 py-4 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
          <span className="mt-0.5 flex h-5 w-9 shrink-0 items-center justify-end rounded-full bg-sf-blue p-0.5" aria-hidden="true">
            <span className="size-4 rounded-full bg-white shadow-sm" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold text-sf-text">{rule.label}</p>
              <span className="rounded-full border border-sf-green-border bg-sf-green-bg px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sf-green">Enabled</span>
            </div>
            <p className="mt-1 text-[11px] text-sf-text-muted">{rule.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const RegionalLatencyCard = () => (
  <section className="relative overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
    <PlannedOverlay />
    <div className="flex items-center gap-2 border-b border-sf-border px-4 py-3">
      <span className="flex size-7 items-center justify-center rounded-md border border-sf-border bg-sf-bg text-sf-text-muted">
        <MapPin className="size-3.5" />
      </span>
      <h3 className="text-[13px] font-semibold text-sf-text">Regional latency</h3>
    </div>
    <div className="space-y-2.5 px-4 py-3.5">
      {RegionalLatencyStats.map((region) => {
        const color =
          region.latencyMs <= 150
            ? "var(--color-sf-green)"
            : region.latencyMs <= 220
              ? "var(--color-sf-amber)"
              : "var(--color-sf-red)";
        return (
          <div key={region.id} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-medium text-sf-text-muted">
              {region.region}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sf-border">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((region.latencyMs / 320) * 100, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="w-11 text-right font-mono text-xs" style={{ color }}>
              {region.latency}
            </span>
          </div>
        );
      })}
    </div>
  </section>
);

const CertificatesMonitor = () => (
  <>
      <div id="recent-checks" className="scroll-mt-16">
        <LastChecksBar />
      </div>

      <section id="infrastructure" className="scroll-mt-16">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-sf-text">
                TLS certificate monitoring
              </h2>
              <span className="rounded-full border border-sf-green-border bg-sf-green-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-green">
                Tracking active
              </span>
            </div>
            <p className="mt-1 text-xs text-sf-text-muted">
              Certificate health, expiry alerts, validation, and renewal history
            </p>
          </div>
          <p className="text-xs text-sf-text-muted">
            Monitoring{" "}
            <span className="font-mono font-medium text-sf-text">
              {mockTlsCertificate.hostname}
            </span>
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <TlsMetricCard
            label="Days remaining"
            value={`${mockTlsCertificate.daysRemaining}`}
            context="Until expiry"
            positive
          />
          <TlsMetricCard
            label="Expires"
            value={mockTlsCertificate.expiresAt.split(" · ")[0]}
            context={mockTlsCertificate.expiresAt.split(" · ")[1]}
          />
          <TlsMetricCard
            label="Trust status"
            value="Trusted"
            context="System trust store"
            positive
          />
          <TlsMetricCard
            label="Warning threshold"
            value={`${mockTlsCertificate.warningThresholdDays} days`}
            context="Configurable"
          />
        </div>

        <div className="mt-3">
          <TlsLifetimeCard />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <TlsCertificateCard />
          <TlsChainCard />
          <TlsValidationCard />
          <TlsConnectionCard />
          <TlsSecurityCard />
          <TlsHandshakeCard />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <TlsNextAlertCard />
          <TlsRenewalComparisonCard />
        </div>

        <div className="mt-3 space-y-3">
          <TlsHistoryCard />
          <TlsAlertRulesCard />
        </div>
      </section>

      <section className="scroll-mt-16">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-sf-text">
              Other infrastructure signals
            </h2>
            <p className="mt-1 text-xs text-sf-text-muted">
              DNS health and regional availability context
            </p>
          </div>
          <span className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
            Planned
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <SignalCard
            title="DNS"
            icon={Wifi}
            rows={[
              { label: "Status", value: "Resolving" },
              { label: "Records tracked", value: "6 records" },
              { label: "Last change", value: "42 days ago" },
              { label: "Monitoring", value: "A · AAAA · CNAME · MX" },
            ]}
          />
          <RegionalLatencyCard />
        </div>
      </section>
  </>
);

export default CertificatesMonitor;
