import { db } from "../index";
import { ResponseObject } from "../types/types";
import { TIMEOUT } from "../constants/constants";
export const checkUrlHealth = async (
  url: URL,
  TIMEOUT: number,
  user_id: string,
): Promise<ResponseObject> => {
  let response: ResponseObject = {
    status: "UP",
    responseTime: null,
    statusCode: null,
    errorMessage: null,
  };
  try {
    const start = Date.now();

    const getUrlData = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    response = {
      status: "UP",
      responseTime: Date.now() - start,
      statusCode: getUrlData.status,
      errorMessage: null,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      if (err.name === "TimeoutError") {
        response = {
          status: "DOWN",
          responseTime: TIMEOUT,
          statusCode: null,
          errorMessage: err.message,
        };
      } else if (err.name === "TypeError") {
        response = {
          status: "DOWN",
          responseTime: null,
          statusCode: null,
          errorMessage: err.message,
        };
      } else {
        throw new Error("Internal server error");
      }
    } else {
      throw new Error("Internal server error");
    }
  }
  const { status, responseTime, statusCode, errorMessage } = response;
  const query =
    "INSERT INTO checks (url,status,response_time,status_code,error_message,user_id) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [url, status, responseTime, statusCode, errorMessage, user_id];
  try {
    const insertIntoDB = await db.query(query, values);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error("Internal server error");
    }
    throw new Error("Internal server error");
  }

  return response;
};
