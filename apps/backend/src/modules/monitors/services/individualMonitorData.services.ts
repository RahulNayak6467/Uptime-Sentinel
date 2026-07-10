import {db} from "../../../db";
import {QueryResult} from "pg";
import {individualStatsState} from "../../../db/db-types";
import {AppError} from "../../../shared/errors/AppError";
import logger from "../../../config/logger";

export const individualMonitorInfo = async(user_id:string,monitor_id:string) => {
    const monitor_info_query = "SELECT url,url_name,next_check_at,interval_seconds,status,is_active from monitor where id = $1 and user_id = $2"
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
        urlName:individual_monitor_info.url_name,
        status: individual_monitor_info.status,
        nextCheckAt: individual_monitor_info.next_check_at,
        intervalSeconds: individual_monitor_info.interval_seconds,
        isActive:individual_monitor_info.is_active
    }

}
