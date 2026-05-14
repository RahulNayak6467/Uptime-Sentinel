import { ResponseObject } from "../types/types";
export const checkUrlHealth = async (
  url: URL,
  TIMEOUT: number,
): Promise<ResponseObject> => {
  try {
    const start = Date.now();

    const getUrlData = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
    });

    const response: ResponseObject = {
      status: "UP",
      responseTime: `${Date.now() - start}ms`,
      statusCode: getUrlData.status,
      errorMessage: null,
    };

    return response;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError") {
        const errorMessage: ResponseObject = {
          status: "DOWN",
          responseTime: `5000ms`,
          statusCode: null,
          errorMessage: err.message,
        };
        return errorMessage;
      } else if (err.name === "TypeError") {
        const errorMessage: ResponseObject = {
          status: "DOWN",
          responseTime: null,
          statusCode: null,
          errorMessage: err.message,
        };
        return errorMessage;
      } else {
        throw new Error("Internal server error");
      }
    } else {
      throw new Error("Internal server error");
    }
  }
};
