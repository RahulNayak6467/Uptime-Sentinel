import { QueryResult } from "pg";
import { db } from "../../../../db";
import { AppError } from "../../../../shared/errors/AppError";
import { editMontiorConfigProps } from "../types";

export const currentEditMonitorConfig = async (user_id: string, montiorId: string) => {
  const get_editConfig_query = `SELECT
    m.monitor_name,
    m.url,
    m.monitor_type,
    m.interval_seconds,
    m.request_timeout_ms,
    m.response_time_threshold_ms,
    m.http_method,
    m.status_code,
    m.failure_threshold,
    m.recovery_threshold,
    m.content_type,
    m.request_body_type,
    m.request_body,
    tc.port,
    tc.min_tls_version,
    tc.warning_threshold_days,
    tc.expiry_alert_thresholds,
    tc.enabled_alerts
    FROM monitor m
    LEFT JOIN tls_config tc ON tc.monitor_id = m.id
    WHERE m.id = $1
    AND m.user_id = $2`;

  const get_editConfig_values = [montiorId, user_id];

  const getEditConfig:QueryResult<editMontiorConfigProps>  = await db.query(get_editConfig_query, get_editConfig_values);

  const rows = getEditConfig.rows

  if (rows.length === 0) {
    throw new AppError(404, "Monitor not found", "MONITOR_DOESNOT_EXIST");
  }

  const requiredData = rows[0];

  const data = {
    url: requiredData.url,
    monitorName: requiredData.monitor_name,
    monitorType: requiredData.monitor_type,
    intervalSeconds: requiredData.interval_seconds,
    requestTimeoutMS: requiredData.request_timeout_ms,
    responseTimeThresholdMS: requiredData.response_time_threshold_ms,
    httpMethod: requiredData.http_method,
    statusCode: requiredData.status_code,
    failureThreshold: requiredData.failure_threshold,
    recoveryThreshold: requiredData.recovery_threshold,
    contentType: requiredData.content_type,
    requestBodyType: requiredData.request_body_type,
    requestBody: requiredData.request_body,
    // TLS-only config (null for HTTP monitors)
    port: requiredData.port,
    minTlsVersion: requiredData.min_tls_version,
    warningThresholdDays: requiredData.warning_threshold_days,
    expiryAlertThresholds: requiredData.expiry_alert_thresholds,
    enabledAlerts: requiredData.enabled_alerts,
  }

  return data;
}
