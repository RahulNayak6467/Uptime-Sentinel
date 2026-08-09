import {db} from "../../../../db";
import {QueryResult} from "pg";
import {individualStatsState} from "../../../../db/db-types";
import {AppError} from "../../../../shared/errors/AppError";
import logger from "../../../../config/logger";

export const individualMonitorInfo = async(user_id:string,monitor_id:string) => {
    const monitor_info_query = `
      SELECT
        url,
        monitor_name,
        next_check_at,
        interval_seconds,
        status,
        is_active,
        status_code,
        request_timeout_ms,
        failure_threshold,
        recovery_threshold,
        http_method,
        monitor_type
      from monitor
      where id = $1 and user_id = $2
    `
    const monitor_info_values = [monitor_id,user_id]

    const getMonitorInfo: QueryResult<individualStatsState> = await db.query(monitor_info_query, monitor_info_values);

    const rows = getMonitorInfo.rows;

    if(rows.length === 0){
        throw new AppError(404, `No monitor found`,"MONITOR_NOT_FOUND");
    }

    const individual_monitor_info = rows[0];

    logger.debug(
        { userId: user_id, monitorId: monitor_id },
        "fetched monitor details",
    );
    return {
        url: individual_monitor_info.url,
        monitorName:individual_monitor_info.monitor_name,
        status: individual_monitor_info.status,
        nextCheckAt: individual_monitor_info.next_check_at,
        intervalSeconds: individual_monitor_info.interval_seconds,
        isActive:individual_monitor_info.is_active,
        statusCodes: individual_monitor_info.status_code,
        requestTimeoutMS: individual_monitor_info.request_timeout_ms,
        failureThreshold: individual_monitor_info.failure_threshold,
        recoveryThreshold: individual_monitor_info.recovery_threshold,
        httpMethod: individual_monitor_info.http_method,
        monitorType: individual_monitor_info.monitor_type,
    }

}
