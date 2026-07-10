import { db } from "../../../db";
import {AppError} from "../../../shared/errors/AppError";
import {individualStatsProps} from "../../../db/db-types";
import {QueryResult} from "pg";
import logger from "../../../config/logger";


export const individualMonitorServices = async(user_id:string,monitor_id:string) => {
    const get_individualists_query = `
        SELECT
            ROUND(
                    COUNT(u.id) FILTER (
            WHERE u.status = 'UP'
              AND u.checked_at >= NOW() - INTERVAL '24 hours'
        ) * 100.0 /
        NULLIF(
            COUNT(u.id) FILTER (
                WHERE u.checked_at >= NOW() - INTERVAL '24 hours'
            ),
            0
        ),
                    2
            ) AS uptime_24hr,

            ROUND(
                    COUNT(u.id) FILTER (
            WHERE u.status = 'UP'
              AND u.checked_at >= NOW() - INTERVAL '7 days'
        ) * 100.0 /
        NULLIF(
            COUNT(u.id) FILTER (
                WHERE u.checked_at >= NOW() - INTERVAL '7 days'
            ),
            0
        ),
                    2
            ) AS uptime_7d,

            ROUND(
                    COUNT(u.id) FILTER (
            WHERE u.status = 'UP'
              AND u.checked_at >= NOW() - INTERVAL '30 days'
        ) * 100.0 /
        NULLIF(
            COUNT(u.id) FILTER (
                WHERE u.checked_at >= NOW() - INTERVAL '30 days'
            ),
            0
        ),
                    2
            ) AS uptime_30d,

            ROUND(AVG(u.response_time) FILTER (WHERE u.status = 'UP' and u.checked_at >= NOW() - INTERVAL '24 hours'
            ) ,0)AS avg_response_24hr

        FROM monitor m
                 LEFT JOIN url_checks u
                           ON m.id = u.monitor_id
        WHERE m.user_id = $1
          AND m.id = $2
        GROUP BY m.id;
    `;

    const get_individualists_values = [user_id,monitor_id];

        const get_individualists:QueryResult<individualStatsProps> = await db.query(get_individualists_query,get_individualists_values)

        const rows = get_individualists.rows.length
        if(rows === 0){
            throw new AppError(404,"Monitor not found","MONITOR_NOT_FOUND")
        }

        const individual_data_rows = get_individualists.rows[0]

        const individual_data = {
            uptime_24hr: individual_data_rows.uptime_24hr === null ? null : Number(individual_data_rows.uptime_24hr),
            uptime_7d: individual_data_rows.uptime_7d === null ? null : Number(individual_data_rows.uptime_7d),
            uptime_30d: individual_data_rows.uptime_30d === null ? null : Number( individual_data_rows.uptime_30d),
            avg_response_24hr: individual_data_rows.avg_response_24hr === null ? null : Number(individual_data_rows.avg_response_24hr),
        }
        logger.debug(
            { userId: user_id, monitorId: monitor_id },
            "fetched monitor statistics",
        );
        return individual_data

}
