import { IndividualStatsCardProps, RegionMonitorProps } from "./types";




export const IndividualStatsCardData: IndividualStatsCardProps[] = [
  {
    title: "Uptime (24h)",
    unit: "%",
    value: "uptime_24hr",
    context: null,
  },
  {
    title: "Uptime (7d)",
    unit: "%",
    value: "uptime_7d",
    context: null
  },
  {
    title: "Uptime (30d)",
    unit: "%",
    value: "uptime_30d",
    context: null
  },
  {
    title: "Avg response",
    unit: "ms",
    value: "avg_response_24hr",
    context: null
  },
];

export const responseTimeHours = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:30",
];

export const responseTimeAvg = [
  155, 150, 148, 145, 158, 152, 145, 142,
  148, 152, 155, 158, 162, 158, 155, 152,
  155, 158, 162, 168, 175, 185, 200, 220,
];

export const responseTimeP95 = [
  278, 265, 270, 288, 275, 255, 248, 242,
  258, 265, 272, 275, 278, 272, 270, 268,
  272, 278, 290, 310, 340, 370, 400, 430,
];

type RegionLatencyProps = { id: string } & RegionMonitorProps;

export const RegionalLatencyStats: RegionLatencyProps[] = [
  {
    id: crypto.randomUUID(),
    region: "US-East",
    latency: "118ms",
    latencyMs: 118,
  },
  {
    id: crypto.randomUUID(),
    region: "US-West",
    latency: "142ms",
    latencyMs: 142,
  },
  {
    id: crypto.randomUUID(),
    region: "EU-West",
    latency: "161ms",
    latencyMs: 161,
  },
  {
    id: crypto.randomUUID(),
    region: "AP-South",
    latency: "233ms",
    latencyMs: 233,
  },
  {
    id: crypto.randomUUID(),
    region: "SA-East",
    latency: "287ms",
    latencyMs: 287,
  },
];

export const mockTlsCertificate = {
  status: "Valid",
  hostname: "api.statusforge.dev",
  port: 443,
  issuer: "Let's Encrypt R11",
  subject: "api.statusforge.dev",
  subjectAlternativeNames: [
    "api.statusforge.dev",
    "statusforge.dev",
    "www.statusforge.dev",
  ],
  validFrom: "Jun 23, 2026 · 05:30 IST",
  expiresAt: "Sep 21, 2026 · 05:29 IST",
  daysRemaining: 61,
  serialNumber: "04:A8:3C:7F:21:9D:6B:11:55:C2:8A:34:09:EF:72:BC",
  fingerprintSha256:
    "7A:10:8F:7D:31:42:AC:8E:56:90:BD:A9:05:79:2F:44:8C:2A:EE:6D:17:3A:CF:91:5E:29:70:B1:46:CC:85:02",
  publicKey: "ECDSA P-256",
  signatureAlgorithm: "SHA-256 with ECDSA",
  authorized: true,
  hostnameMatch: true,
  sniEnabled: true,
  lastChecked: "2 minutes ago",
  nextCheck: "in 3 minutes",
  warningThresholdDays: 30,
  certificateLifetimeDays: 90,
  elapsedDays: 29,
  connectionTimeout: "10 seconds",
  checkInterval: "5 minutes",
  tlsVersion: "TLS 1.3",
  cipherSuite: "TLS_AES_256_GCM_SHA384",
  keyExchange: "X25519",
  forwardSecrecy: true,
  alpnProtocol: "h2",
  handshakeTimeMs: 118,
  averageHandshakeTimeMs: 124,
  p95HandshakeTimeMs: 171,
  lastSuccessfulValidation: "2 minutes ago",
  nextExpiryAlert: {
    thresholdDays: 30,
    dueInDays: 31,
    estimatedAt: "Aug 22, 2026",
  },
  expiryAlertThresholds: [30, 14, 7, 1],
  chain: [
    {
      name: "api.statusforge.dev",
      role: "Leaf",
      expiresAt: "Sep 21, 2026",
      fingerprint: "7A:10:8F:7D:…:85:02",
    },
    {
      name: "R11 · Let's Encrypt",
      role: "Intermediate",
      expiresAt: "Mar 12, 2027",
      fingerprint: "92:AE:19:84:…:3C:11",
    },
    {
      name: "ISRG Root X1",
      role: "Trusted root",
      expiresAt: "Jun 4, 2035",
      fingerprint: "96:BC:EC:06:…:9C:BD",
    },
  ],
  validationChecks: [
    {
      label: "Certificate chain",
      description: "Verified to a trusted root",
      status: "Pass",
    },
    {
      label: "Hostname match",
      description: "SAN matches the monitored hostname",
      status: "Pass",
    },
    {
      label: "Expiry boundary",
      description: "Certificate has not passed its valid-to date",
      status: "Pass",
    },
    {
      label: "Validity start",
      description: "Certificate is past its valid-from date",
      status: "Pass",
    },
    {
      label: "System trust",
      description: "Trusted by the Node.js system store",
      status: "Pass",
    },
  ],
  alertRules: [
    {
      label: "Expiring certificate",
      description: "Remaining days reach the warning threshold",
    },
    {
      label: "Expired or invalid",
      description: "Expiry, trust, or certificate-chain validation fails",
    },
    {
      label: "Hostname mismatch",
      description: "Certificate identity no longer matches the hostname",
    },
    {
      label: "Certificate renewal",
      description: "Fingerprint or serial number changes",
    },
    {
      label: "Recovery",
      description: "Certificate becomes valid again after a failure",
    },
  ],
  error: null,
} as const;

export const mockTlsRenewalComparison = {
  detectedAt: "Jul 18, 2026 · 03:14 IST",
  previous: {
    issuer: "Let's Encrypt R10",
    expiresAt: "Jul 22, 2026",
    fingerprint: "44:93:0C:29:…:7D:10",
  },
  current: {
    issuer: "Let's Encrypt R11",
    expiresAt: "Sep 21, 2026",
    fingerprint: "7A:10:8F:7D:…:85:02",
  },
} as const;

export const mockTlsCertificateHistory = [
  {
    id: "tls-event-1",
    type: "renewed",
    title: "Certificate renewed",
    description: "A new certificate fingerprint replaced the previous certificate.",
    occurredAt: "Jul 18, 2026 · 03:14 IST",
    detail: "Expiry extended by 90 days",
  },
  {
    id: "tls-event-2",
    type: "recovered",
    title: "Certificate recovered",
    description: "Certificate became valid again after a failed check window.",
    occurredAt: "Jul 12, 2026 · 09:41 IST",
    detail: "Recovery alert sent",
  },
  {
    id: "tls-event-3",
    type: "snapshot",
    title: "Initial snapshot stored",
    description: "Certificate identity and validity metadata were recorded.",
    occurredAt: "Jun 23, 2026 · 05:31 IST",
    detail: "First certificate",
  },
] as const;
