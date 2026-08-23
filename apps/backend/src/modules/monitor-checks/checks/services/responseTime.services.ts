import {AppError} from "../../../../shared/errors/AppError";
import {timeRangeData} from "../../../../shared/utils/timeResponse";
import {db} from "../../../../db";
import {QueryResult} from "pg";
import {responseTimeDataProps} from "../../../../shared/types/types";
import logger from "../../../../config/logger";


export const sendResponseTimeData = async(monitor_id:string,user_id:string,timeRange:string) => {

    if(!timeRangeData.has(timeRange)){
        throw new AppError(400,"Time range not supported","TIME_RANGE_INVALID")
    }

    const check_usermonitor_query = `
      SELECT url, response_time_threshold_ms
      FROM monitor
      WHERE user_id=$1 and id=$2
    `;
    const check_usermonitor_values = [user_id,monitor_id];

    const check_user_monitor = await db.query(check_usermonitor_query, check_usermonitor_values);
    const rows = check_user_monitor.rows;

    if(rows.length === 0){
        throw new AppError(404,"Monitor not found","MONITOR_NOT_FOUND")
    }

    const time_range_query = `
        SELECT
            g.bucket,
          percentile_cont(0.5) WITHIN GROUP (
                ORDER BY u.response_time
            )AS p50,
            percentile_cont(0.75) WITHIN GROUP (
                ORDER BY u.response_time
            ) AS p75,
            percentile_cont(0.90) WITHIN GROUP (
                ORDER BY u.response_time
            ) AS p90,
            percentile_cont(0.95) WITHIN GROUP (
                ORDER BY u.response_time
            ) AS p95,
            percentile_cont(0.99) WITHIN GROUP (
                ORDER BY u.response_time
            ) AS p99,
            percentile_cont(0.999) WITHIN GROUP (
                ORDER BY u.response_time
            ) AS p999
        FROM generate_series(
            date_trunc($3, now() - $1::interval),
            date_trunc($3, now()),
            $2::interval
        ) AS g(bucket)
        LEFT JOIN url_checks u
            ON u.monitor_id = $4
            AND u.checked_at >= g.bucket
            AND u.checked_at <  g.bucket + $2::interval
        GROUP BY g.bucket
        ORDER BY g.bucket
    `

    const timeRangeProperties = timeRangeData.get(timeRange)

    const time_range_values = [timeRangeProperties?.window,timeRangeProperties?.step,timeRangeProperties?.bucket,monitor_id]

    const getTimeRangeData:QueryResult<responseTimeDataProps> = await db.query(time_range_query, time_range_values);

    const formatedData = getTimeRangeData.rows.map((data) => {
      return {
        ...data, p50: data.p50 === null ? null : Number(data.p50)
        , p75: data.p75 === null ? null : Number(data.p75)
        , p90: data.p90 === null ? null : Number(data.p90)
        , p95: data.p95 === null ? null : Number(data.p95)
        , p99: data.p99 === null ? null : Number(data.p99)
        , p999: data.p999 === null ? null : Number(data.p999)
      };
    })

    const data = {
        range: timeRange,
        responseTimeThresholdMS: rows[0].response_time_threshold_ms,
        series: formatedData,
    }

    logger.debug(
        { userId: user_id, monitorId: monitor_id, timeRange, bucketCount: formatedData.length },
        "fetched response-time series",
    );
    return data

}
