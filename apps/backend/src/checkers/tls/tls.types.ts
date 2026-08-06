import tls, { CipherNameAndProtocol, SecureVersion } from "node:tls";

export interface TimeRemaining  {
  totalMs: number;   // signed: negative when expired
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};


export interface CertificateLifetime {
  lifetimeDays: number;
  isExpired: boolean;
}

export interface ElapsedDays {
  elapsedDays: number
}

export type keyStrengthLevels = "Pass" | "Fail" | "Warn";


export type TlsStatus = "Expired" | "Invalid" | "Valid" | "Expiring";

export type TlsVersion = "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3";

export interface ValidationChecks {
  certificate_trust_check: boolean;
  validity_start_check: boolean;
  expiry_boundary_check: boolean;
  check_hostname_match: boolean;
  self_signed_check: boolean;
}

export interface NextTlsExpiry {
  thresholdDays:number |  null;
  dueInDays: number | null;
  estimatedAt: Date | null;
}

export interface TlsAcceptedConnections {
  status?: string,
  name: SecureVersion | "SSLv3",
  enabled: boolean,
  rating: "Pass" | "Warn" | "Fail",
  cipherSuite: string | null,
}

export type CtLogMap = Map<string, string>;

export interface LogListResponse {
  operators: {
    name: string;
    logs: { description?: string; log_id: string }[];
  }[];
}

export interface ProtocolCipherScan {
  configFindings: {
  noDeprcatedProtocols: string;
  strongSignature: "Pass" | "Fail" | "Warn";
  keyStrength: keyStrengthLevels;
  }
}

export interface ParseSCTExtension {
  status: string;
  sctCount: number;
  deliveryMethod: string;
  logs: {
      operator: string;
      timestamp: Date;
  }[];
}

export interface CrlRevocation {
  status: string;
  checkedAt: Date;
  nextUpdate?: Date | undefined;
  revokedAt?: Date | undefined;
}

export interface OCSPStatus {
  status: "good" | "revoked" | "unknown";
  nextUpdateAt: Date | null;
}

export interface TlsCertificateInfo {
  common_name: string | string[] | undefined;
  san_names: string;
  subject: string | string[] | undefined;
  issuer: string | string[] | undefined;

  leaf_certificate: {
    subject: string | string[] | undefined;
    issuer: string | string[] | undefined;
    valid_from: string;
    valid_to: string;
    finger_print: string;
    serial_number: string;
  };

  intermediate_certificate: {
    subject: string | string[] | null;
    issuer: string | string[] | null
    valid_to: string | null;
    valid_from: string | null;
    finger_print: string | null;
    serial_number: string | null;
  };

  signature_algorithm: string | undefined;
  authorization: boolean;
  authorizationError: Error | null;
  tls_version: SecureVersion | null;
  cipher_suite: CipherNameAndProtocol;
  alpn_protocol: string | false | null;
  publicKey: string | undefined;

  keyExchange: {
    type: string | null;
    name: string | null;
    size: number | undefined;
  };

  ocsp_stapled: boolean;
  ocsp_response: string | null;
  port: number;
  host: string;
  server_name: string;
  connection_timeout: number;
  error_messages: string | null;
  error_code: string | null;
  asn1: string | undefined;
  nist: string | undefined;
  handshake_time_ms: number;
  revocation: { info_access: NodeJS.Dict<string[]> | undefined };
  hostname_match: boolean;
  hostname_match_error: string | null;
  bits: number | undefined;
  asymmetricKeyType: string | undefined;
}

export interface TlsDerived {
  daysRemaining: TimeRemaining,
  certificateLifetime: CertificateLifetime,
  elapsedDays: ElapsedDays,
  subjectAlternativeNames:string[],
  publicKey: string,
  keyStrength: keyStrengthLevels,
  forwardSecrecy: boolean,
  cipherName: string,
  cipherSummary: string,
  ocspResponder: string | null,
  validationChecks: ValidationChecks,
  connectionLatency: LatencyShaper,
  nextExpiryAlert: NextTlsExpiry,
  chainOfTrustCertificate: ChainOfTrust,
  securityGrade: SecurityGrade,
  revocation: RevocationShaper,
}

export interface TlsResult {
  status: TlsStatus | "Unreachable",
  error: {
    code: string | null,
    message: string,
  } | null,
  checkedAt: Date,
  host: string,
  port: number,
  certificate: TlsCertificateInfo | null,
  derived: TlsDerived | null,
  offeredProtocols: TlsAcceptedConnections[] | null,
  configFindings: ProtocolCipherScan["configFindings"] | null,
  ocsp: OCSPStatus | null,
  crl: CrlRevocation | null,
  certificateTransparency: ParseSCTExtension | null
}

export interface SecurityGrade {
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  overall: number;
  scores: { label: string; value: number }[];
  signals: Signals
}

export interface Signals {
  forwardSecrecySignal: boolean;
  ocspStapledSignal: boolean;
  tlsVersionPrefferedSignal: boolean;
  strongKeySignal: boolean;
  mustStapleSignal: boolean;
}

export interface RevocationShaper {
  overall: "Good" | "Warn" | "Revoked";
  checks: { label: string; description: string; status: "Pass" | "Warn" | "Fail" }[];
  footer: {
    ocspResponder: string | null;
    nextOcspUpdate: Date | null;
    ctLogs: {
      operator: string;
      timestamp: Date;
    }[];
    mustStaple: boolean;
  }
}

export interface LatencyShaper {
  dnsMs: number;
  tcpMs: number | null;
  tlsMs: number | null;
  totalMs: number;
}

type ChainRole = "Leaf" | "Intermediate" | "Root";

export interface ChainCertificate {
  role: ChainRole;
  subject: tls.PeerCertificate["subject"];
  issuer: tls.PeerCertificate["issuer"];
  valid_from: string;
  valid_to: string;
  fingerprint256: string;
  serialNumber: string;
}

export interface ChainOfTrust {
  links: ChainCertificate[];
  root: {
    name: string | string[] | undefined;
    inTrustStore: boolean;
    status: string;
  }
  verified: boolean;
  pathValidation: string;
  hostnameMatch: boolean;
  certsSent: number;
  bytesSent: number
}

export interface TlsCertRenewal {
  fingerprint_sha256: string;
  serial_number: string;
  issuer: string;
  valid_from: Date;
  valid_to: Date;
  first_seen_at: Date;
  asymmetric_key_type: string | null;
  nist_curve: string | null
  key_bits: number | null;
  san: string[];
}

interface RenewalChanges {
  field: string;
  detail: string;
}

export interface RenewalComparison {
  detectedAt: Date;
  previous: {
    issuer: string;
    expiresAt: Date;
    key: string;
    fingerprint: string;
  }
  current: {
    issuer: string;
    expiresAt: Date;
    key: string;
    fingerprint: string;
  }
changes: RenewalChanges[];
}

export interface TlsConfigInput {
  url: string;
  host: string;
  interval_seconds: number;
  next_check_at: Date,
  request_time_out_ms: number;
  warning_threshold_days: number,
  expiry_alert_thresholds: number[],
  min_tls_version: string
}


export interface TlsConfigOnput {
  warningThresholdDays: number;
  expiryAlertThresholds: number[];
  connectionTimeoutMs: number;
  minTlsVersion: string;
  serverName: string;
  checkIntervalSeconds: number;
  nextCheckAt: Date
}

export interface ComparePin {
  status: "match" | "broken" | null;
  lastVerified: Date | null;
  autoRepin: boolean;
  currentFingerPrint: string,
  pinnedFingerPrint: string | null,
  isPinned: boolean,
}

export interface ComputeCaa {
  status: "Pass" | "Warn" | "Unknown",
  caaPresent: boolean,
  allowedIssuers: string[],
  iodef: string[],
}

export interface CertLifetimeStats {
  fingerprint_sha256: string;
  valid_from: Date;
  valid_to: Date;
  first_seen_at: Date;
}

export interface CertsInfoField {
  seenAt: Date;
  fingerprint: string;
  current: boolean;
}

export interface CertLifetimeInfo {
  certs: CertsInfoField[];
  currentValidFrom: Date;
  currentValidTo: Date;
  avgRenewalLead: number | null;
}

export type CertificateEvents = "renewed" | "went_down" | "recovered" | "protocol_change" | "first_snapshot";

export interface CertHistoryInfo {
  id: string,
  type: CertificateEvents,
  occurred_at: Date,
  metadata: any
}

export interface CertHistoryInfoOutput {
  id: string,
  type: CertificateEvents,
  occurred_at: Date,
  metadata: any
}
