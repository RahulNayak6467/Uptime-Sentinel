type status = "UP" | "DOWN";

export interface ResponseObject {
  status: status;
  responseTime: number | null;
  statusCode: number | null;
  errorMessage: string | null;
}

export interface UrlResponseData {
  id: string;
  url: string;
  status: status;
  responseTime: number | null;
  status_code: number | null;
  error_message: string | null;
  checked_at: Date;
}

export interface UrlActiveRowsProps {
  id: string;
  user_id: string;
  next_check_at: string;
}

export interface responseTimeProps {
  window:string,
  bucket: string,
  step: string,
}

export interface responseTimeDataProps {
  bucket: Date,
  p50: string | null
  p95: string | null
}

export interface lastChecksDataProps {
  monitor_status: "UP" | "DOWN" | "UNKNOWN";
  response_time: number | null;
  checked_at: Date | null;
  current_status: "UP" | "DOWN" | null
}

export interface monitorDataProps {
  url:string
  url_name: string,
  interval_seconds: number,
  status: "UP" | "DOWN" | "UNKNOWN"
  next_check_at: Date;
}