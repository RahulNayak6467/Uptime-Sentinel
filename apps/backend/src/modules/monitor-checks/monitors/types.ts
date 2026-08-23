export type httpMethodProps = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type contentTypeProps = "application/json" | "application/x-www-form-urlencoded" | "text/plain" | "none";
export type requestBodyProps = string | null;
export type requestBodyTypeProps = "none" | "json" | "form-encoded" | "raw-text";

export interface editMontiorConfigProps {
  monitor_name: string
  url: string
  monitor_type: string
  interval_seconds: number
  request_timeout_ms: number
  response_time_threshold_ms: number
  http_method: httpMethodProps
  status_code: number
  failure_threshold: number
  recovery_threshold: number
  content_type: contentTypeProps
  request_body_type: requestBodyTypeProps
  request_body: requestBodyProps
  // TLS-only config (null for HTTP monitors)
  port: number | null
  min_tls_version: string | null
  warning_threshold_days: number | null
  expiry_alert_thresholds: number[] | null
  enabled_alerts: string[] | null
}
