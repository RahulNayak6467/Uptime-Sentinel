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
