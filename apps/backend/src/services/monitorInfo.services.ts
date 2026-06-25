import {db} from "../db";
import {AppError} from "../errors/AppError";
import {QueryResult} from "pg";
import {monitorDataProps} from "../types/types";

export const getMonitorsDetails = async(user_id: string) => {
    const monitors_info_query = "SELECT url,url_name,interval_seconds,status,next_check_at FROM monitor where user_id = $1";
    const monitors_info_value = [user_id]
    

    const monitorsInfo:QueryResult<monitorDataProps> = await db.query(monitors_info_query, monitors_info_value)

    const rows = monitorsInfo.rows;

    if(rows.length === 0){
        throw new AppError(404,"No monitors found","MONITORS_NOT_FOUND")
    }

    return rows
}