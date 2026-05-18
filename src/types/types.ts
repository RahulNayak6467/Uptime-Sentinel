type status = "UP" | "DOWN";

export interface ResponseObject {
  status: status;
  responseTime: string | null;
  statusCode: number | null;
  errorMessage: string | null;
}

export interface UrlResponseData {
  id: string;
  url: string;
  status: status;
  responseTime: string | null;
  status_code: number | null;
  error_message: string | null;
  checked_at: Date;
}
