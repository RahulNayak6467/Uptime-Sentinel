export type httpMethodProps = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type contentTypeProps = "application/json" | "application/x-www-form-urlencoded" | "text/plain" | "none";
export type requestBodyProps = string | null;
export type requestBodyTypeProps = "none" | "json" | "form-encoded" | "raw-text";

export interface editMontiorConfigProps {
  monitor_name: string
  url: string
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
}
