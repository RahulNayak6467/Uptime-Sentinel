export type IndividualStatsCardProps = {
  title: string;
  value: keyof IndividualStatsCardState;
  unit: "%" | "ms";
  context: number | null;
};

export type StatsCardProps = {
  id: string;
  title: string;
  metrixKey: keyof IndividualStatsCardState;
  unit: "%" | "ms";
};

export type RegionMonitorProps = {
  region: string;
  latency: string;
  latencyMs: number;
};

export type IndividualStatsCardState = {
  uptime_24hr: number | null;
  uptime_7d: number | null;
  uptime_30d: number | null;
  avg_response_24hr: number | null;
};

export type TimeRangeDataProps = {
  range: string;
  responseTimeThresholdMS: number;
  series: {
    p50: number | null;
    p75: number | null;
    p90: number | null;
    p95: number | null;
    p99: number | null;
    p999: number | null;
    bucket: Date;
  }[];
};

type LastChecksProps = {
  monitor_status: "UP" | "DOWN" | "UNKNOWN";
  response_time: number | null;
  checked_at: Date | null;
  current_status: "UP" | "DOWN" | null;
};

export type LastChecksDataProps = {
  state: "CHECKED" | "UNCHECKED";
  checks: LastChecksProps[];
};

export type TimeRangeProps = "1h" | "24h" | "7d" | "30d";

export type IndividualOverviewStatsProps = {
  url: string;
  monitorName: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  nextCheckAt: Date;
  intervalSeconds: number;
  isActive: boolean;
  statusCodes: number[];
  requestTimeoutMS: number;
  failureThreshold: number;
  recoveryThreshold: number;
  httpMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  monitorType: "http" | "https" | "tcp" | "tls" | "dns" | "keyword";
  linkedTlsMonitorId: string | null;
};

export type LastFiveIncidentDataProps = {
  data: {
    id: string;
    title: string | null;
    started_at: string;
    resolved_at: string | null;
    is_active: boolean;
  }[];
  activeCount: number;
  resolvedCount: number;
};

export type editConfigMonitorProps = {
  url?: string;
  monitorName?: string;
  intervalSeconds?: number;
  requestTimeoutMS?: number;
  responseTimeThresholdMS?: number;
  httpMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  requestBodyType?: "none" | "json" | "form-encoded" | "raw-text";
  contentType?:
    | "application/json"
    | "application/x-www-form-urlencoded"
    | "text/plain"
    | "none";
  requestBody?: string | null;
  statusCode?: number[];
  statusCodes?: number[];
  failureThreshold?: number;
  recoveryThreshold?: number;
  // shared + TLS-only config
  monitorType?: "http" | "https" | "tcp" | "tls" | "dns" | "keyword";
  port?: number;
  minTlsVersion?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3";
  warningThresholdDays?: number;
  expiryAlertThresholds?: number[];
  enabledAlerts?: string[];
}

export type TlsStatus =
  | "Valid"
  | "Expiring"
  | "Expired"
  | "Invalid"
  | "Unreachable";

export type TlsCheckStatus = "Pass" | "Warn" | "Fail";

export type TlsGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export type TlsDistinguishedName = {
  CN?: string;
  O?: string;
  OU?: string;
  C?: string;
  ST?: string;
  L?: string;
  [key: string]: string | undefined;
};

export type TlsCertificateInfo = {
  common_name: string | string[] | null;
  signature_algorithm: string;
  tls_version: string | null;
  cipher_suite: { name: string | null; standardName?: string; version?: string } | null;
  alpn_protocol: string | false | null;
  publicKey: string | null;
  keyExchange: { type: string | null; name: string | null; size: number | null };
  ocsp_stapled: boolean;
  handshake_time_ms: number;
  hostname_match: boolean;
  leaf_certificate: {
    subject: string;
    issuer: string;
    valid_from: string;
    valid_to: string;
    finger_print: string;
    serial_number: string;
  };
};

export type TlsDerivedInfo = {
  daysRemaining: { days: number; isExpired: boolean };
  certificateLifetime: { lifetimeDays: number; isExpired: boolean };
  elapsedDays: { elapsedDays: number };
  subjectAlternativeNames: string[];
  publicKey: string;
  forwardSecrecy: boolean;
  cipherSummary: string;
  validationChecks: {
    certificate_trust_check: boolean;
    validity_start_check: boolean;
    expiry_boundary_check: boolean;
    check_hostname_match: boolean;
    self_signed_check: boolean;
  };
  connectionLatency: { dnsMs: number; tcpMs: number | null; tlsMs: number | null; totalMs: number };
  chainOfTrustCertificate: {
    links: {
      role: "Leaf" | "Intermediate" | "Root";
      subject: string | TlsDistinguishedName;
      issuer: string | TlsDistinguishedName;
      valid_from: string;
      valid_to: string;
      fingerprint256: string;
      serialNumber: string;
    }[];
    verified: boolean;
    pathValidation: string;
    hostnameMatch: boolean;
    certsSent: number;
    bytesSent: number;
  };
  securityGrade: {
    grade: TlsGrade;
    overall: number;
    scores: { label: string; value: number }[];
    signals: {
      forwardSecrecySignal: boolean;
      ocspStapledSignal: boolean;
      tlsVersionPrefferedSignal: boolean;
      strongKeySignal: boolean;
      mustStapleSignal: boolean;
    };
  };
  revocation: {
    overall: "Good" | "Warn" | "Revoked";
    checks: { label: string; description: string; status: TlsCheckStatus }[];
    footer: {
      ocspResponder: string | null;
      nextOcspUpdate: string | null;
      ctLogs: { operator: string; timestamp: string }[];
      mustStaple: boolean;
    };
  };
  caaInfo: {
    status: "Pass" | "Warn" | "Unknown";
    caaPresent: boolean;
    allowedIssuers: string[];
    iodef: string[];
  };
};

export type TlsOfferedProtocol = {
  name: string;
  enabled: boolean;
  status?: string;
  rating: TlsCheckStatus;
  cipherSuite: string | null;
};

export type TlsDetailResponse = {
  status: TlsStatus;
  error: { code: string | null; message: string } | null;
  checkedAt: string;
  host: string;
  port: number;
  certificate: TlsCertificateInfo | null;
  derived: TlsDerivedInfo | null;
  offeredProtocols: TlsOfferedProtocol[] | null;

  renewals: number;
  nextCheckAt: string;
  lifetime: {
    certs: { seenAt: string; fingerprint: string; current: boolean }[];
    currentValidFrom: string;
    currentValidTo: string;
    avgRenewalLeadDays: number | null;
  };
  renewalComparison: {
    detectedAt: string;
    previous: { issuer: string; expiresAt: string; key: string; fingerprint: string };
    current: { issuer: string; expiresAt: string; key: string; fingerprint: string };
    changes: { field: string; detail: string }[];
  } | null;
  pinning: {
    isPinned: boolean;
    status: "match" | "broken" | null;
    pinnedFingerprint: string | null;
    currentFingerprint: string;
    pinnedAt: string | null;
    lastVerified: string | null;
    autoRepin: boolean;
  };
  config: {
    warningThresholdDays: number;
    expiryAlertThresholds: number[];
    connectionTimeoutMs: number;
    minTlsVersion: string;
    serverName: string;
    checkIntervalSeconds: number;
    nextCheckAt: string;
  };
  alerts: {
    enabledAlerts: string[];
  };
};

export type TlsLatencyRange = "7d" | "30d" | "90d" | "1y";

export type TlsPercentileLadder = {
  p50: number | null;
  p75: number | null;
  p90: number | null;
  p95: number | null;
  p99: number | null;
  p999: number | null;
};

export type TlsHandshakeLatencyResponse = {
  range: TlsLatencyRange;
  summary: {
    avgMs: number | null;
    maxMs: number | null;
    sampleCount: number;
    percentiles: TlsPercentileLadder;
  };
  series: ({ bucket: string } & TlsPercentileLadder)[];
};

export type TlsHistoryEvent = {
  id: string;
  type:
    | "first_snapshot"
    | "renewed"
    | "protocol_change"
    | "went_down"
    | "recovered";
  occurred_at: string;
  tone: "positive" | "negative" | "neutral";
  metadata: Record<string, unknown> | null;
};

export type TlsHistoryResponse = TlsHistoryEvent[];
