import { QueryResult } from "pg";
import { db } from "../../../../db";
import { AppError } from "../../../../shared/errors/AppError";
import { editMontiorConfigProps } from "../types";

export const currentEditMonitorConfig = async (user_id: string, montiorId: string) => {
  const get_editConfig_query = `SELECT
    monitor_name,
    url,
    interval_seconds,
    request_timeout_ms,
    response_time_threshold_ms,
    http_method,
    status_code,
    failure_threshold,
    recovery_threshold,
    content_type,
    request_body_type,
    request_body
    FROM monitor
    WHERE id = $1
    AND user_id = $2`;

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
    intervalSeconds: requiredData.interval_seconds,
    requestTimeoutMS: requiredData.request_timeout_ms,
    responseTimeThresholdMS: requiredData.response_time_threshold_ms,
    httpMethod: requiredData.http_method,
    statusCode: requiredData.status_code,
    failureThreshold: requiredData.failure_threshold,
    recoveryThreshold: requiredData.recovery_threshold,
    contentType: requiredData.content_type,
    requestBodyType: requiredData.request_body_type,
    requestBody: requiredData.request_body
  }

  return data;
}
