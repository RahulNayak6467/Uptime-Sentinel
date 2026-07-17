import { db } from "../../../db/index";
import { ResponseObject } from "../../../shared/types/types";
import { AppError } from "../../../shared/errors/AppError";
import { publishSSEEvent } from "../../../sse/services/publishSSEEvent";
import logger from "../../../config/logger";
import { isPostgresError } from "../../../shared/errors/PostgresError";
import { MonitorCheckConfigRow } from "../../../db/db-types";
import { httpsFetcher } from "../../../checkers/https/httpsFetcher";

export const checkUrlHealth = async (
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
  let requestTimeoutMS: number | null = null;

  try {
    // const start = Date.now();

    const getUrl = await db.query<MonitorCheckConfigRow>(
      `
        SELECT url,
        next_check_at,
        request_timeout_ms,
        content_type,
        request_body,
        request_body_type,
        status_code,
        monitor_type,
        http_method
        FROM monitor
        where id = $1 and user_id = $2
      `,
      [url_id, user_id],
    );

    const monitor = getUrl.rows[0];
    if (!monitor) {
      throw new AppError(404, "Monitor not found", "MONITOR_NOT_FOUND");
    }

    if (monitor.monitor_type !== "http" && monitor.monitor_type !== "https") {
      throw new AppError(
        400,
        "Monitor type is not supported by the HTTP checker",
        "UNSUPPORTED_MONITOR_TYPE",
      );
    }

    // if (monitor.http_method !== "GET") {
    //   throw new AppError(
    //     400,
    //     "Only GET checks are currently supported",
    //     "UNSUPPORTED_HTTP_METHOD",
    //   );
    // }

    const url = monitor.url;
    nextCheckAt = monitor.next_check_at;
    requestTimeoutMS = monitor.request_timeout_ms;
    const acceptedStatusCode = monitor.status_code;
    const requestBodyType = monitor.request_body_type;
    const requestBody = monitor.request_body;
    const contentType = monitor.content_type;
    const httpMethod = monitor.http_method

    const  responseObject = await httpsFetcher(url, requestTimeoutMS, acceptedStatusCode,httpMethod,contentType,requestBody,requestBodyType);

    // const getUrlData = await fetch(url, {
    //   signal: AbortSignal.timeout(requestTimeoutMS),
    // });

    // const statusCodeReceived = getUrlData.status;

    // const checkStatus = acceptedStatusCode.some((code) => code === statusCodeReceived);

    // const isCorrectStatusResponse = checkStatus ? "UP" : "DOWN";

    // response = {
    //   status: isCorrectStatusResponse,
    //   responseTime: Date.now() - start,
    //   statusCode: getUrlData.status,
    //   errorMessage: null,
    // };
    response = responseObject;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    if (err instanceof Error) {
      if (err.name === "TimeoutError") {
        // response = {
        //   status: "DOWN",
        //   responseTime: null,
        //   statusCode: null,
        //   errorMessage: err.message,
        // };
      } else if (err.name === "TypeError") {
        // response = {
        //   status: "DOWN",
        //   responseTime: null,
        //   statusCode: null,
        //   errorMessage: err.message,
        // };
      } else if (isPostgresError(err) && err.code === "22P02") {
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
    const insert_checks_query = `
      INSERT INTO url_checks (monitor_id,status,response_time,status_code,error_message)
      VALUES ($1,$2,$3,$4,$5)
    `;
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
      if (isPostgresError(error) && error.code ==="22P02") {
        throw new Error("Invalid uuid type");
      }
      throw new Error("Internal server error");
    }
    throw new Error("Internal server error");
  }
};
