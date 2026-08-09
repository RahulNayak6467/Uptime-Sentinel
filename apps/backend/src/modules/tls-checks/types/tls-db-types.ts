import { TlsStatus } from "../../../checkers/tls/tls.types";

export interface TlsCheckInfo {
  warning_threshold_days: number;
  url: string;
  request_timeout_ms: number;
}

export interface RenewalCheck {
  fingerprint_sha256: string;
}
