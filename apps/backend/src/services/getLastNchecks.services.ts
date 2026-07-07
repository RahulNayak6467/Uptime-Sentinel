import {db} from "../db";
import {AppError} from "../errors/AppError";
import {QueryResult} from "pg";
import {lastChecksDataProps} from "../types/types";
import logger from "../config/logger";

export const getLastChecksData = async(monitor_id:string,user_id:string,limit:number):Promise<{state:"CHECKED" | "UNCHECKED"; checks:lastChecksDataProps[] } > => {
    const get_lastchecks_query = "SELECT m.status AS monitor_status,u.response_time,u.checked_at,u.status AS current_status FROM monitor m left join url_checks u on u.monitor_id = m.id where m.id=$1 and m.user_id=$2 ORDER BY u.checked_at DESC LIMIT $3"

    const get_lastchecks_values =[monitor_id,user_id,limit];

    const get_last_checks:QueryResult<lastChecksDataProps> = await db.query(get_lastchecks_query,get_lastchecks_values);

    const rows = get_last_checks.rows

    if (rows.length === 0){
        throw new AppError(404,"No monitor found", "MONITOR_NOT_FOUND")
    }
    if (rows[0].monitor_status === "UNKNOWN"){
       logger.debug({ userId: user_id, monitorId: monitor_id }, "monitor has no checks");
       return { state: "UNCHECKED", checks: [] }
    }

    const lastChecksData = rows

    logger.debug(
        { userId: user_id, monitorId: monitor_id, checkCount: lastChecksData.length },
        "fetched recent checks",
    );
    return {state:"CHECKED",checks:lastChecksData}
}
