import { db } from "../db/index";
import { ResponseObject } from "../types/types";
import { TIMEOUT } from "../constants/constants";
import { Pool } from "pg";
import { AppError } from "../errors/AppError";
import { publishSSEEvent } from "../sse/publishSSEEvent";
import logger from "../config/logger";
// import { CheckUrlPayload } from "../types/sse-types";
// import { publishSSEEvent } from "../sse/publishSSEEvent";
export const checkUrlHealth = async (
  TIMEOUT: number,
  user_id: string,
  url_id: string,
): Promise<ResponseObject> => {
  let response: ResponseObject = {
    status: "UP",
    responseTime: null,
    statusCode: null,
    errorMessage: null,
  };

  let nextCheckAt: string = "";

  try {
    const start = Date.now();

    const getUrl = await db.query(
      "SELECT url,next_check_at FROM monitor where id = $1",
      [url_id],
    );
    const url: string = getUrl.rows[0].url;
    nextCheckAt = getUrl.rows[0].next_check_at;

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
      } else if (err.code === "22P02") {
        throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
      } else {
        throw new Error("Internal server error");
      }
    } else {
      throw new Error("Internal server error");
    }
  }
  const { status, responseTime, statusCode, errorMessage } = response;

  try {
    const insert_checks_query =
      "INSERT INTO url_checks (monitor_id,status,response_time,status_code,error_message) VALUES ($1,$2,$3,$4,$5)";
    const values_checks_query = [
      url_id,
      status,
      responseTime,
      statusCode,
      errorMessage,
    ];
    await db.query(insert_checks_query, values_checks_query);

    try {
      const payload = {
        monitorId: url_id,
        responseTime,
        statusCode,
        status,
        nextCheckAt,
      };
      await publishSSEEvent(user_id, "check_result", payload);
    } catch (err) {
      logger.warn(
        { err, userId: user_id, monitorId: url_id },
        "SSE check result publish failed",
      );
    }

    logger.info(
      { userId: user_id, monitorId: url_id, status, responseTime, statusCode },
      "monitor check completed",
    );
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      if (error.code === "22P02") {
        throw new Error("Invalid uuid type");
      }
      throw new Error("Internal server error");
    }
    throw new Error("Internal server error");
  }
};
