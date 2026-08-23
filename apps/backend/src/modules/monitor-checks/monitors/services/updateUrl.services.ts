import { db } from "../../../../db/index";
import { AppError } from "../../../../shared/errors/AppError";
import logger from "../../../../config/logger";
import { isPostgresError } from "../../../../shared/errors/PostgresError";
import { contentTypeProps, httpMethodProps, requestBodyProps, requestBodyTypeProps } from "../types";
import { UpdateTlsInput } from "../validations/urlValidation";
import { checkUrlExist } from "./registerUrl.services";

export const updateUrl = async (
  url_id: string,
  user_id: string,
  url?: string,
  monitorName?: string,
  intervalSeconds?: number,
  responseTimeThresholdMS?: number,
  failureThreshold?: number,
  recoveryThreshold?: number,
  requestTimeoutMS?: number,
  httpMethod?: httpMethodProps,
  statusCodes?: number[],
  contentType?: contentTypeProps,
  requestBodyType?: requestBodyTypeProps,
  requestBody?: requestBodyProps
) => {
  // Reject changing the URL to one already registered by this user.
  if (url) {
    await checkUrlExist(url, user_id, url_id);
  }

  const updates = [];
  const values = [];
  let paramCount = 1;

  if (url) {
    updates.push(`url = $${paramCount++}`);
    values.push(url);
  }
  if (monitorName) {
    updates.push(`monitor_name = $${paramCount++}`);
    values.push(monitorName);
  }
  if (intervalSeconds) {
    updates.push(`interval_seconds = $${paramCount++}`);
    values.push(intervalSeconds);
  }
  if (responseTimeThresholdMS !== undefined) {
    updates.push(`response_time_threshold_ms = $${paramCount++}`);
    values.push(responseTimeThresholdMS);
  }
  if (intervalSeconds) {
    updates.push(
      `next_check_at = NOW() + ($${paramCount++} || ' seconds')::interval`,
    );
    values.push(intervalSeconds);
  }
  if (failureThreshold) {
    updates.push(`failure_threshold = $${paramCount++}`);
    values.push(failureThreshold)
  }
  if (recoveryThreshold) {
    updates.push(`recovery_threshold = $${paramCount++}`);
    values.push(recoveryThreshold)
  }
  if (requestTimeoutMS) {
    updates.push(`request_timeout_ms = $${paramCount++}`);
    values.push(requestTimeoutMS)
  }
  if (httpMethod) {
    updates.push(`http_method = $${paramCount++}`)
    values.push(httpMethod)
  }
  if (contentType) {
    updates.push(`content_type = $${paramCount++}`);
    values.push(contentType);
  }
  if (requestBodyType) {
    updates.push(`request_body_type = $${paramCount++}`);
    values.push(requestBodyType);
  }
  if (requestBody) {
    updates.push(`request_body = $${paramCount++}`);
    values.push(requestBody)
  }
  if (statusCodes) {
    updates.push(`status_code = $${paramCount++}`)
    values.push(statusCodes)
  }

  values.push(url_id, user_id);

  const update_url_query = `
    UPDATE monitor
    SET ${updates.join(", ")}
    WHERE id = $${paramCount++} AND user_id = $${paramCount}
  `;

  try {
    const updateUrlAttributes = await db.query(update_url_query, values);
    const rows = updateUrlAttributes.rowCount;
    if (rows === null || rows === 0) {
      throw new AppError(404, "No such url exists", "URL_NOT_FOUND");
    }
    logger.info({ userId: user_id, monitorId: url_id }, "monitor updated");
    return;
  } catch (error) {
    if (error instanceof AppError) {
      return error;
    } else if (error instanceof Error) {
      if (isPostgresError(error) && error.code === "22P02") {
        throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
      }
      throw error;
    }
  }
};

// Partial update for TLS monitors: writes present fields to `monitor` and
// `tls_config` inside one transaction. Verifies ownership + monitor_type='tls'.
export const updateTls = async (
  monitor_id: string,
  user_id: string,
  data: UpdateTlsInput,
) => {
  // Reject changing the host to one already registered by this user.
  if (data.url !== undefined) {
    await checkUrlExist(data.url, user_id, monitor_id);
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // --- shared `monitor` fields ---
    const monitorUpdates: string[] = [];
    const monitorValues: unknown[] = [];
    let p = 1;

    if (data.monitorName !== undefined) {
      monitorUpdates.push(`monitor_name = $${p++}`);
      monitorValues.push(data.monitorName);
    }
    if (data.url !== undefined) {
      monitorUpdates.push(`url = $${p++}`);
      monitorValues.push(data.url);
    }
    if (data.intervalSeconds !== undefined) {
      monitorUpdates.push(`interval_seconds = $${p++}`);
      monitorValues.push(data.intervalSeconds);
      monitorUpdates.push(`next_check_at = NOW() + ($${p++} || ' seconds')::interval`);
      monitorValues.push(data.intervalSeconds);
    }
    if (data.requestTimeoutMS !== undefined) {
      monitorUpdates.push(`request_timeout_ms = $${p++}`);
      monitorValues.push(data.requestTimeoutMS);
    }
    if (data.responseTimeThresholdMS !== undefined) {
      monitorUpdates.push(`response_time_threshold_ms = $${p++}`);
      monitorValues.push(data.responseTimeThresholdMS);
    }

    let ownedRows: number;
    if (monitorUpdates.length > 0) {
      monitorValues.push(monitor_id, user_id);
      const query = `
        UPDATE monitor
        SET ${monitorUpdates.join(", ")}
        WHERE id = $${p++} AND user_id = $${p} AND monitor_type = 'tls'
      `;
      const result = await client.query(query, monitorValues);
      ownedRows = result.rowCount ?? 0;
    } else {
      // No monitor-level fields changed — still confirm ownership + type.
      const result = await client.query(
        `SELECT 1 FROM monitor WHERE id = $1 AND user_id = $2 AND monitor_type = 'tls'`,
        [monitor_id, user_id],
      );
      ownedRows = result.rowCount ?? 0;
    }

    if (ownedRows === 0) {
      throw new AppError(404, "No such TLS monitor exists", "MONITOR_NOT_FOUND");
    }

    // --- `tls_config` fields ---
    const configUpdates: string[] = [];
    const configValues: unknown[] = [];
    let cp = 1;

    if (data.warningThresholdDays !== undefined) {
      configUpdates.push(`warning_threshold_days = $${cp++}`);
      configValues.push(data.warningThresholdDays);
    }
    if (data.expiryAlertThresholds !== undefined) {
      configUpdates.push(`expiry_alert_thresholds = $${cp++}`);
      configValues.push(data.expiryAlertThresholds);
    }
    if (data.minTlsVersion !== undefined) {
      configUpdates.push(`min_tls_version = $${cp++}`);
      configValues.push(data.minTlsVersion);
    }
    if (data.port !== undefined) {
      configUpdates.push(`port = $${cp++}`);
      configValues.push(data.port);
    }
    if (data.enabledAlerts !== undefined) {
      configUpdates.push(`enabled_alerts = $${cp++}`);
      configValues.push(data.enabledAlerts);
    }

    if (configUpdates.length > 0) {
      configValues.push(monitor_id);
      const query = `
        UPDATE tls_config
        SET ${configUpdates.join(", ")}
        WHERE monitor_id = $${cp}
      `;
      await client.query(query, configValues);
    }

    await client.query("COMMIT");
    logger.info({ userId: user_id, monitorId: monitor_id }, "tls monitor updated");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof AppError) {
      throw error;
    }
    if (isPostgresError(error) && error.code === "22P02") {
      throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
    }
    throw error;
  } finally {
    client.release();
  }
};
