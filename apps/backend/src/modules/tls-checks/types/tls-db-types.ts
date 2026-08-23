import { TlsStatus } from "../../../checkers/tls/tls.types";

export interface TlsCheckInfo {
  warning_threshold_days: number;
  url: string;
  request_timeout_ms: number;
}

export interface RenewalCheck {
  fingerprint_sha256: string;
}

export interface TlsHandshakeLatency {
  bucket: Date;
  avgMs: number | null;
  maxMs: number | null;
  sampleCount: number;
  p50: string | null;
  p75: string | null;
  p90: string | null;
  p95: string | null;
  p99: string | null;
  p999: string | null;
}

export interface TlsHandshakeLatencySummary {
    avg_ms: number | null;
    max_ms: number | null;
    sample_count: number;
    percentiles: {
      p50: number | null;
      p75:  number | null;
      p90: number | null;
      p95: number | null;
      p99: number | null;
      p999: number | null;
    }
}
