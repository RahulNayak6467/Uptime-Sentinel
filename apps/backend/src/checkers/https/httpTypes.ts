export interface httpsRequestBody {
  method: string;
  signal: AbortSignal;
  headers: {
    "Content-Type": string | undefined;
    Authorization: string;
  };
  body?: string | undefined
}
