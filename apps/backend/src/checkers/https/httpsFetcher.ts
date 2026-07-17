import { AppError } from "../../shared/errors/AppError";
import { ResponseObject } from "../../shared/types/types";
import { httpsRequestBody } from "./httpTypes";

export const httpsFetcher =
  async (monitorUrl: string, requestTimeoutMS: number, acceptedStatusCode: number[],httpMethod:string, contentType?: string, requestBody?: string | null
  , requestBodyType?: string,init?:RequestInit): Promise<ResponseObject> => {
  let response: ResponseObject = {
    status: "UP",
    responseTime: null,
    statusCode: null,
    errorMessage: null,
  };

  try {
    const start = performance.now();

    const fetchOptions:httpsRequestBody = {
      method: httpMethod,
      signal: AbortSignal.timeout(requestTimeoutMS),
      headers: {
        "Content-Type": contentType,
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        ...init?.headers
      },
    }

    if (httpMethod !== "GET" && requestBody != null) {
      fetchOptions.body = requestBody;
    }


    const checkMonitorHealth = await fetch(monitorUrl, fetchOptions);

    const timeToRespond = Math.round(performance.now() - start);

    await checkMonitorHealth.body?.cancel()

    const statusCodeReceived = checkMonitorHealth.status;

    const checkStatus = acceptedStatusCode.some((code) => code === statusCodeReceived);

    const isCorrectStatusResponse = checkStatus ? "UP" : "DOWN";

    response = {
      status: isCorrectStatusResponse,
      responseTime:timeToRespond,
      statusCode: statusCodeReceived,
      errorMessage: null,
    }

  }
  catch (err) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError") {
        response = {
          status: "DOWN",
          responseTime: null,
          statusCode: null,
          errorMessage: err.message
        }
      }
      else if (err.name === "TypeError") {
        response = {
          status: "DOWN",
          responseTime: null,
          statusCode: null,
          errorMessage: err.message
        }
      }
    else {
      throw new AppError(500, "internal server error", "INTERNAL_SERVER_ERROR");
    }
    }
    else {
      throw new AppError(500, "internal server error", "INTERNAL_SERVER_ERROR");
    }
  }

  return response;
}
