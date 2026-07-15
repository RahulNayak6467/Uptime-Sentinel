export interface editMontiorConfigProps {
  monitor_name: string
  url: string
  interval_seconds: number
  request_timeout_ms: number
  response_time_threshold_ms: number
  http_method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  status_code: number
  failure_threshold: number
  recovery_threshold: number
}
