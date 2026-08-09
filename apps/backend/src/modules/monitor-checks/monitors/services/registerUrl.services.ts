import { AppError } from "../../../../shared/errors/AppError";
import { db } from "../../../../db";
import logger from "../../../../config/logger";
import { RegisterUrlInput } from "../validations/urlValidation";

export const checkUrlRegistration = async (
  url: RegisterUrlInput["url"],
  monitorName: RegisterUrlInput["monitorName"],
  intervalSeconds: RegisterUrlInput["intervalSeconds"],
  contentType: RegisterUrlInput["contentType"],
  failureThreshold: RegisterUrlInput["failureThreshold"],
  httpMethod: RegisterUrlInput["httpMethod"],
  requestBody: RegisterUrlInput["requestBody"],
  requestBodyType: RegisterUrlInput["requestBodyType"],
  requestTimeoutMS: RegisterUrlInput["requestTimeoutMS"],
  statusCodes: RegisterUrlInput["statusCodes"],
  monitorType: RegisterUrlInput["monitorType"],
  recoveryThreshold: RegisterUrlInput["recoveryThreshold"],
  responseTimeThresholdMS: RegisterUrlInput["responseTimeThresholdMS"],
  user_id: string,
) => {
  try {
    const check_monitor_url = `
      SELECT url
      from monitor
      where url = $1 and user_id = $2
    `;
    const check_monitor_value = [url, user_id];
    const check_monitor_rows = await db.query(
      check_monitor_url,
      check_monitor_value,
    );
    if (check_monitor_rows.rows.length !== 0) {
      throw new AppError(
        409,
        "The url is already registered",
        "URL_ALREADY_REGISTERED",
      );
    }
    const insert_monitor_url = `
      INSERT INTO monitor (
        url,
        monitor_name,
        interval_seconds,
        content_type,
        failure_threshold,
        http_method,
        request_body,
        request_body_type,
        request_timeout_ms,
        status_code,
        monitor_type,
        recovery_threshold,
        response_time_threshold_ms,
        user_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `;
    const values_monitor_url = [
      url,
      monitorName,
      intervalSeconds,
      contentType,
      failureThreshold,
      httpMethod,
      requestBody,
      requestBodyType,
      requestTimeoutMS,
      statusCodes,
      monitorType,
      recoveryThreshold,
      responseTimeThresholdMS,
      user_id,
    ];
    await db.query(insert_monitor_url, values_monitor_url);
    logger.info({ userId: user_id }, "monitor registered");
    return "url successfully registered";
  } catch (error) {
    if (!(error instanceof AppError)) {
      logger.error(
        { err: error, userId: user_id },
        "monitor registration failed unexpectedly",
      );
    }
    throw error;
  }
};
