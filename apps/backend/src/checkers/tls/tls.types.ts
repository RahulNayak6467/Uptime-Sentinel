import { SecureVersion } from "node:tls";

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
  name: SecureVersion,
  enabled: boolean
}

export type CtLogMap = Map<string, string>;

export interface LogListResponse {
  operators: {
    name: string;
    logs: { description?: string; log_id: string }[];
  }[];
}
