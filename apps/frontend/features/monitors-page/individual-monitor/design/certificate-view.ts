import type {
  TlsDetailResponse,
  TlsDerivedInfo,
  TlsHandshakeLatencyResponse,
  TlsHistoryResponse,
} from "../types";
import type { Tone } from "../monitor-detail-primitives";
import { formatTimeAgo } from "@/utils/format-time-ago";
import { formatTimeUntil } from "@/utils/format-time-until";
import { formatCheckInterval } from "@/utils/format-check-interval";
import { formatIncidentTimestamp } from "@/utils/format-incident-timestamp";

const checkTone = (ok: boolean): "Pass" | "Fail" => (ok ? "Pass" : "Fail");

const protocolLabel = (version: string): string =>
  version.replace(/^TLSv/, "TLS ").replace(/^SSLv/, "SSL ");

const shortDate = (iso: string | null | undefined): string =>
  iso ? formatIncidentTimestamp(iso).date : "—";

const daysBetween = (from: string, to: string): number =>
  Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));

const asString = (value: string | string[] | null | undefined): string =>
  Array.isArray(value) ? value.join(", ") : value ?? "—";

const shortFingerprint = (fp: string | null | undefined): string => {
  if (!fp) return "—";
  const clean = fp.trim();
  return clean.length <= 29 ? clean : `${clean.slice(0, 17)}…${clean.slice(-11)}`;
};

const cleanCtOperator = (operator: string): string =>
  operator.replace(/'/g, "").replace(/\s+log$/i, "").trim();

const dnToString = (
  dn: string | { CN?: string; O?: string; OU?: string; [k: string]: string | undefined } | null | undefined,
): string => {
  if (!dn) return "—";
  if (typeof dn === "string") return dn;
  return dn.CN ?? dn.O ?? dn.OU ?? "—";
};

const statusView = (
  status: TlsDetailResponse["status"],
): { label: string; tone: "positive" | "warning" | "negative" } => {
  switch (status) {
    case "Valid":
      return { label: "Certificate valid", tone: "positive" };
    case "Expiring":
      return { label: "Certificate expiring", tone: "warning" };
    case "Expired":
      return { label: "Certificate expired", tone: "negative" };
    case "Invalid":
      return { label: "Certificate invalid", tone: "negative" };
    case "Unreachable":
      return { label: "Host unreachable", tone: "negative" };
    default:
      return { label: "Certificate status", tone: "warning" };
  }
};

type Signals = TlsDerivedInfo["securityGrade"]["signals"];

const buildGradeSummary = (signals: Signals | undefined): string => {
  if (!signals) return "Configuration reviewed each scan.";
  const clauses: string[] = [];
  if (signals.tlsVersionPrefferedSignal) clauses.push("modern TLS preferred");
  if (signals.forwardSecrecySignal) clauses.push("forward secrecy on every offered suite");
  if (signals.strongKeySignal) clauses.push("a strong key");
  if (signals.ocspStapledSignal) clauses.push("OCSP stapling");
  if (signals.mustStapleSignal) clauses.push("must-staple set");
  if (clauses.length === 0) return "Configuration reviewed each scan.";
  return `Configuration reviewed each scan — ${clauses.join(", ")}.`;
};

const buildGradeChips = (signals: Signals | undefined): string[] => {
  if (!signals) return [];
  const chips: string[] = [];
  if (signals.forwardSecrecySignal) chips.push("Forward secrecy");
  if (signals.ocspStapledSignal) chips.push("OCSP stapled");
  if (signals.strongKeySignal) chips.push("Strong key");
  if (signals.mustStapleSignal) chips.push("Must-staple");
  return chips;
};

const VALIDATION_LABELS: {
  key: keyof TlsDerivedInfo["validationChecks"];
  label: string;
  description: string;
}[] = [
  { key: "certificate_trust_check", label: "Chain verified", description: "Trusted root reached" },
  { key: "check_hostname_match", label: "Hostname match", description: "SNI / CN / SAN agree" },
  { key: "expiry_boundary_check", label: "Expiry boundary", description: "Not past valid-to" },
  { key: "validity_start_check", label: "Validity start", description: "Past valid-from" },
  { key: "self_signed_check", label: "Not self-signed", description: "Issued by a public CA" },
];

const ALERT_RULES: { key: string; label: string; description: string }[] = [
  { key: "expiring", label: "Expiring certificate", description: "Remaining days reach the warning threshold." },
  { key: "expired_or_invalid", label: "Expired or invalid", description: "Expiry, trust, or chain validation fails." },
  { key: "hostname_mismatch", label: "Hostname mismatch", description: "Certificate identity no longer matches the hostname." },
  { key: "renewal", label: "Certificate renewal", description: "Fingerprint or serial number changes." },
  { key: "revocation", label: "Revocation detected", description: "OCSP or CRL reports the certificate as revoked." },
  { key: "weak_config", label: "Weak TLS configuration", description: "A deprecated protocol or weak cipher becomes reachable." },
  { key: "pin_broken", label: "Fingerprint pin broken", description: "The live certificate no longer matches the pinned fingerprint." },
  { key: "recovery", label: "Recovery", description: "Certificate becomes valid again after a failure." },
];

export type CertificateView = ReturnType<typeof buildCertificateView>;

export const buildCertificateView = (
  detail: TlsDetailResponse,
  latency: TlsHandshakeLatencyResponse | undefined,
) => {
  const status = statusView(detail.status);
  const cert = detail.certificate;
  const d = detail.derived;
  const leaf = cert?.leaf_certificate;
  const latencyShape = d?.connectionLatency;
  const percentiles = latency?.summary.percentiles;

  const life = detail.lifetime;
  const cfg = detail.config;
  const pin = detail.pinning;
  const enabledAlerts = detail.alerts?.enabledAlerts ?? [];

  const chainLinks = (d?.chainOfTrustCertificate?.links ?? []).filter(
    (link) => link.role !== "Root",
  );

  return {
    host: detail.host,
    port: detail.port,
    statusLabel: status.label,
    statusTone: status.tone,
    grade: d?.securityGrade?.grade ?? "—",
    protocol: protocolLabel(cert?.tls_version ?? "—"),
    daysRemaining: d?.daysRemaining?.days ?? 0,
    expiresAt: shortDate(leaf?.valid_to),
    handshakeMs: latencyShape?.totalMs ?? cert?.handshake_time_ms ?? 0,
    p95Ms: percentiles?.p95 ?? latencyShape?.tlsMs ?? 0,
    cipherSummary: d?.cipherSummary ?? "—",
    key: d?.publicKey ?? cert?.publicKey ?? "—",
    keySummary: cert?.signature_algorithm ?? "—",
    renewals: detail.renewals,
    lastScan: formatTimeAgo(detail.checkedAt),

    lifetime: {
      certs: (life?.certs ?? []).map((snapshot) => ({
        seen: shortDate(snapshot.seenAt),
        fp: snapshot.fingerprint,
        current: snapshot.current,
      })),
      currentRange: `${shortDate(life?.currentValidFrom)} → ${shortDate(life?.currentValidTo)}`,
      remaining: `${d?.daysRemaining?.days ?? 0} days`,
      avgRenewalLead:
        life?.avgRenewalLeadDays == null
          ? "—"
          : `${life.avgRenewalLeadDays} days ahead`,
    },

    handshake: {
      totalMs: latencyShape?.totalMs ?? 0,
      phases: [
        { label: "DNS resolution", detail: `A record for ${detail.host}`, ms: latencyShape?.dnsMs ?? 0 },
        { label: "TCP connect", detail: "SYN → SYN-ACK → ACK", ms: latencyShape?.tcpMs ?? 0 },
        { label: "TLS handshake", detail: `ClientHello → Finished · ALPN ${cert?.alpn_protocol || "—"}`, ms: latencyShape?.tlsMs ?? 0 },
      ],
    },

    securityGrade: {
      grade: d?.securityGrade?.grade ?? "—",
      summary: buildGradeSummary(d?.securityGrade?.signals),
      scores: d?.securityGrade?.scores ?? [],
      chips: buildGradeChips(d?.securityGrade?.signals),
    },

    leaf: {
      sans: d?.subjectAlternativeNames ?? [],
      commonName: asString(cert?.common_name) !== "—" ? asString(cert?.common_name) : leaf?.subject ?? "—",
      issuer: leaf?.issuer ?? "—",
      signature: cert?.signature_algorithm ?? "—",
      publicKey: d?.publicKey ?? cert?.publicKey ?? "—",
      validFrom: shortDate(leaf?.valid_from),
      validTo: shortDate(leaf?.valid_to),
      serial: leaf?.serial_number ?? "—",
      sha256: leaf?.finger_print ?? "—",
    },

    chain: {
      verified: `${chainLinks.length} of ${d?.chainOfTrustCertificate?.certsSent ?? chainLinks.length} verified`,
      sent: `${d?.chainOfTrustCertificate?.certsSent ?? 0} certs · ${((d?.chainOfTrustCertificate?.bytesSent ?? 0) / 1024).toFixed(1)} KB`,
      links: chainLinks.map((link) => ({
        name: dnToString(link.subject),
        role: link.role,
        detail: `${dnToString(link.issuer)} · expires ${shortDate(link.valid_to)}`,
        fill: Math.round(
          (daysBetween(new Date().toISOString(), link.valid_to) /
            Math.max(1, daysBetween(link.valid_from, link.valid_to))) *
            100,
        ),
      })),
      order: d?.chainOfTrustCertificate?.verified ? "Correct · no extra certs" : "Chain incomplete",
      hostnameMatch: d?.chainOfTrustCertificate?.hostnameMatch ? "SNI, CN and SAN agree" : "Hostname mismatch",
      pathValidation: d?.chainOfTrustCertificate?.pathValidation ?? "—",
    },

    protocols: (detail.offeredProtocols ?? []).map((protocol) => ({
      name: protocol.name,
      enabled: protocol.enabled,
      status: protocol.status ?? (protocol.enabled ? "Offered" : "Refused"),
      cipherSuite: protocol.cipherSuite,
      rating: protocol.rating,
    })),
    protocolFooter: {
      forwardSecrecy: d?.forwardSecrecy ? "Enabled (negotiated suite)" : "Not offered",
      alpn: cert?.alpn_protocol || "—",
    },

    validation: VALIDATION_LABELS.map((row) => ({
      label: row.label,
      description: row.description,
      status: checkTone(d?.validationChecks?.[row.key] ?? false),
    })),

    revocation: d?.revocation?.checks ?? [],
    revocationFooter: {
      ocspResponder: d?.revocation?.footer?.ocspResponder ?? "—",
      nextOcspUpdate: d?.revocation?.footer?.nextOcspUpdate
        ? formatTimeUntil(d.revocation.footer.nextOcspUpdate)
        : "—",
      ctLogs:
        (d?.revocation?.footer?.ctLogs?.length ?? 0) > 0
          ? d?.revocation?.footer?.ctLogs
              .map((log) => cleanCtOperator(log.operator))
              .join(" · ")
          : "—",
      caaIodef: (d?.caaInfo?.iodef.length ?? 0) > 0 ? d?.caaInfo?.iodef.join(", ") : "None",
      mustStaple: d?.revocation?.footer?.mustStaple ? "Set" : "Not set",
    },

    renewalComparison: detail.renewalComparison
      ? {
          detectedAt: formatIncidentTimestamp(detail.renewalComparison.detectedAt).dateTime,
          previous: {
            issuer: detail.renewalComparison.previous.issuer,
            expiresAt: shortDate(detail.renewalComparison.previous.expiresAt),
            key: detail.renewalComparison.previous.key,
            fingerprint: shortFingerprint(detail.renewalComparison.previous.fingerprint),
          },
          current: {
            issuer: detail.renewalComparison.current.issuer,
            expiresAt: shortDate(detail.renewalComparison.current.expiresAt),
            key: detail.renewalComparison.current.key,
            fingerprint: shortFingerprint(detail.renewalComparison.current.fingerprint),
          },
          changes: detail.renewalComparison.changes.map((change) => ({
            label: change.field,
            detail: change.detail,
          })),
        }
      : null,

    pinning: {
      matches: pin?.status === "match",
      pinnedFingerprint: pin?.pinnedFingerprint ?? "Not pinned",
      currentFingerprint: pin?.currentFingerprint ?? "—",
      pinnedAt: pin?.pinnedAt ? formatIncidentTimestamp(pin.pinnedAt).dateTime : "—",
      lastVerified: pin?.lastVerified ? formatTimeAgo(pin.lastVerified) : "—",
      autoRepin: pin?.autoRepin ? "On renewal" : "Off",
    },

    config: {
      warningThresholdDays: cfg ? `${cfg.warningThresholdDays} days` : "—",
      expiryAlertThresholds: cfg ? `${cfg.expiryAlertThresholds.join(" · ")} days` : "—",
      connectionTimeout: cfg ? `${Math.round(cfg.connectionTimeoutMs / 1000)} seconds` : "—",
      minTlsVersion: cfg ? protocolLabel(cfg.minTlsVersion) : "—",
      serverName: cfg ? `${cfg.serverName} (SNI)` : "—",
      checkInterval: cfg ? formatCheckInterval(cfg.checkIntervalSeconds) : "—",
      nextCheck: cfg ? formatTimeUntil(cfg.nextCheckAt) : "—",
    },

    alertRules: ALERT_RULES.map((rule) => ({
      label: rule.label,
      description: rule.description,
      enabled: enabledAlerts.includes(rule.key),
    })),
  };
};

export const buildHandshakeTrendView = (latency: TlsHandshakeLatencyResponse) => ({
  values: latency.series.map((point) => point.p50 ?? 0),
  p95Values: latency.series.map((point) => point.p95 ?? 0),
  categories: latency.series.map((point) => formatIncidentTimestamp(point.bucket).time),
  latestMs: latency.series.at(-1)?.p50 ?? 0,
  averageMs: latency.summary.avgMs ?? 0,
  p50Ms: latency.summary.percentiles.p50 ?? 0,
  p75Ms: latency.summary.percentiles.p75 ?? 0,
  p90Ms: latency.summary.percentiles.p90 ?? 0,
  p95Ms: latency.summary.percentiles.p95 ?? 0,
  p99Ms: latency.summary.percentiles.p99 ?? 0,
  p999Ms: latency.summary.percentiles.p999 ?? 0,
  maxMs: latency.summary.maxMs ?? 0,
});

const historyToneMap: Record<TlsHistoryResponse[number]["tone"], Tone> = {
  positive: "positive",
  negative: "negative",
  neutral: "neutral",
};

const HISTORY_COPY: Record<
  TlsHistoryResponse[number]["type"],
  { title: string; description: string }
> = {
  first_snapshot: { title: "First snapshot", description: "Baseline certificate recorded for this host." },
  renewed: { title: "Renewed", description: "A new fingerprint and serial were observed. Snapshot stored." },
  protocol_change: { title: "Protocol change", description: "The offered protocol set changed." },
  went_down: { title: "Went down", description: "A certificate check failed." },
  recovered: { title: "Recovered", description: "Certificate valid again after a failed check window." },
};

export const buildHistoryView = (history: TlsHistoryResponse) =>
  history.map((event) => {
    const copy = HISTORY_COPY[event.type];
    const cause = typeof event.metadata?.cause === "string" ? event.metadata.cause : null;
    return {
      id: event.id,
      type: copy.title,
      description: cause ? `${copy.description} · ${cause}` : copy.description,
      occurredAt: formatIncidentTimestamp(event.occurred_at).dateTime,
      tone: historyToneMap[event.tone],
    };
  });
