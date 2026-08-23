import { AppError } from "../../../../shared/errors/AppError";
import { db } from "../../../../db";
import logger from "../../../../config/logger";
import { RegisterTlsInput, RegisterUrlInput } from "../validations/urlValidation";
import { TLS_THRESHOLD } from "../../../../constants/constants";

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
    await checkUrlExist(url, user_id);
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
      RETURNING id
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
    const getMonitorId = await db.query(insert_monitor_url, values_monitor_url);

    const monitorId = getMonitorId.rows[0].id;

    logger.info({ userId: user_id }, "monitor registered");
    return monitorId;
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

export const checkTlsRegistration = async (
monitorId:string | null,
url: RegisterUrlInput["url"],
monitorName: RegisterTlsInput["monitorName"],
intervalSeconds: RegisterTlsInput["intervalSeconds"],
requestTimeoutMS: RegisterTlsInput["requestTimeoutMS"],
responseTimeThresholdMS: RegisterTlsInput["responseTimeThresholdMS"],
port: RegisterTlsInput["port"],
minTlsVersion: RegisterTlsInput["minTlsVersion"],
warningThresholdDays: RegisterTlsInput["warningThresholdDays"],
expiryThresholdAlerts: RegisterTlsInput["expiryAlertThresholds"],
enabledAlerts: RegisterTlsInput["enabledAlerts"],
user_id: string
) => {

  const client = await db.connect();
  try {
    await checkUrlExist(url, user_id);
    await client.query("BEGIN");

    const insert_tls_url = `INSERT INTO monitor (
      url,
      monitor_name,
      interval_seconds,
      failure_threshold,
      request_timeout_ms,
      monitor_type,
      recovery_threshold,
      response_time_threshold_ms,
      user_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id`;

    const insert_tls_values = [
      url,
      monitorName,
      intervalSeconds,
      TLS_THRESHOLD,
      requestTimeoutMS,
      "tls",
      TLS_THRESHOLD,
      responseTimeThresholdMS,
      user_id,
    ];

    const tlsConfig = await client.query(insert_tls_url, insert_tls_values);

    const rows = tlsConfig.rows;

    const insert_tls_config = `INSERT INTO tls_config (
      monitor_id,
      warning_threshold_days,
      expiry_alert_thresholds,
      min_tls_version,
      linked_monitor_id,
      port,
      enabled_alerts
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)`

    const values_tls_config = [rows[0].id, warningThresholdDays, expiryThresholdAlerts, minTlsVersion, monitorId, port, enabledAlerts ];

    await client.query(insert_tls_config, values_tls_config);

    await client.query("COMMIT");

    logger.info({ userId: user_id }, "monitor registered");
    return "url successfully registered";
  } catch (error) {
    await client.query("ROLLBACK");
    if (!(error instanceof AppError)) {
      logger.error(
        { err: error, userId: user_id },
        "monitor registration failed unexpectedly",
      );
    }
    throw error;
  }
  finally {
    client.release();
  }
};

export const checkUrlExist = async (
  url: string,
  user_id: string,
  excludeMonitorId?: string,
) => {
  let check_monitor_url = `
    SELECT url
    from monitor
    where url = $1 and user_id = $2
  `;
  const check_monitor_value: (string)[] = [url, user_id];

  // On update, don't count the monitor's own row as a duplicate.
  if (excludeMonitorId) {
    check_monitor_url += ` and id != $3`;
    check_monitor_value.push(excludeMonitorId);
  }

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
}
