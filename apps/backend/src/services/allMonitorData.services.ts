import {db} from "../db";
import {QueryResult} from "pg";
import {allMonitorsDataProps} from "../types/types";

export const getAllMonitorInfo = async(user_id:string)=> {
    const all_monitors_query = `
        SELECT
            m.url_name,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status,
            ROUND(AVG(u.response_time), 0) AS avg_response_time,
            ROUND(COUNT(u.id) FILTER (WHERE u.status = 'UP' ) * 100.0 / NULLIF(COUNT(u.id),0),2)
                AS uptime_percentage,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'responseTime', u.response_time
                    )
                ) FILTER (WHERE u.id IS NOT NULL),
                '[]'
            ) AS response
        FROM monitor m
        LEFT JOIN url_checks u
            ON m.id = u.monitor_id
        WHERE m.user_id = $1
        GROUP BY
            m.url_name,
            m.id,
            m.url,
            m.interval_seconds,
            m.next_check_at,
            m.status
        ORDER BY m.created_at

        
    `
    const all_monitors_value = [user_id]

    const all_monitors_data:QueryResult<allMonitorsDataProps> = await db.query(all_monitors_query,all_monitors_value)

    const rows = all_monitors_data.rows


    const allMonitorsData = rows.map((data) => {
        return {
            url: data.url,
            urlName: data.url_name,
            intervalSeconds: data.interval_seconds,
            nextCheckAt: data.next_check_at,
            status: data.status,
            avgResponseTime: data.avg_response_time,
            response: data.response,

            uptimePercentage: data.uptime_percentage
        }
    })

    return allMonitorsData
}



