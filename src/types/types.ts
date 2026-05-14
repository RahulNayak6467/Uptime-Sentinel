type status = "UP" | "DOWN";

export interface ResponseObject {
  status: status;
  responseTime: string | null;
  statusCode: number | null;
  errorMessage: string | null;
}
