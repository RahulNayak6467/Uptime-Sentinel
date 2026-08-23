
import { QueryResult } from "pg";
import { db } from "../../../db";
import { timeRangeData, tlsTimeRangeData } from "../../../shared/utils/timeResponse";
import { TlsHandshakeLatency, TlsHandshakeLatencySummary } from "../types/tls-db-types";
import logger from "../../../config/logger";


export const getHandshakeLatencyStats = async (user_id: string, tls_id: string, timeRange: string) => {

  const time_range_query = `
    SELECT
      g.bucket,

      ROUND(
        percentile_cont(0.5) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p50,

      ROUND(
        percentile_cont(0.75) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p75,

      ROUND(
        percentile_cont(0.90) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p90,

      ROUND(
        percentile_cont(0.95) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p95,

      ROUND(
        percentile_cont(0.99) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p99,

      ROUND(
        percentile_cont(0.999) WITHIN GROUP (
          ORDER BY t.tls_handshake_time_ms
        )::numeric,
        2
      ) AS p999

    FROM generate_series(
      date_trunc($3, now() - $1::interval),
      date_trunc($3, now()),
      $2::interval
    ) AS g(bucket)

    LEFT JOIN tls_checks t
      ON t.monitor_id = $4
      AND t.tls_handshake_time_ms IS NOT NULL
      AND t.created_at >= g.bucket
      AND t.created_at < g.bucket + $2::interval

    GROUP BY g.bucket
    ORDER BY g.bucket;
  `;

  const timeRangeProperties = tlsTimeRangeData.get(timeRange);

  const time_range_values = [timeRangeProperties?.window, timeRangeProperties?.step, timeRangeProperties?.bucket, tls_id];

  const get_timequery_details = `
    SELECT
        ROUND(AVG(tls_handshake_time_ms), 2) AS avg_ms,
        ROUND(MAX(tls_handshake_time_ms), 2) AS max_ms,
        COUNT(tls_handshake_time_ms) AS sample_count,
        jsonb_build_object(
            'p50',  ROUND((percentile_cont(0.50) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2),
            'p75',  ROUND((percentile_cont(0.75) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2),
            'p90',  ROUND((percentile_cont(0.90) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2),
            'p95',  ROUND((percentile_cont(0.95) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2),
            'p99',  ROUND((percentile_cont(0.99) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2),
            'p999', ROUND((percentile_cont(0.999) WITHIN GROUP (ORDER BY tls_handshake_time_ms))::numeric, 2)
        ) AS percentiles
    FROM tls_checks
    WHERE monitor_id = $1
      AND tls_handshake_time_ms IS NOT NULL
      AND created_at >= NOW() - $2::interval;
    `

  const timequery_details_value = [tls_id, tlsTimeRangeData.get(timeRange)?.window];

  const client = await db.connect();

  try {

    await client.query("BEGIN");

    const getTimeRangeData: QueryResult<TlsHandshakeLatency> = await client.query(time_range_query, time_range_values);
    const getTimeDetails: QueryResult<TlsHandshakeLatencySummary> = await client.query(get_timequery_details, timequery_details_value);

    const rows = getTimeDetails.rows[0];

    const toNum = (value: string | number | null): number | null =>
      value === null ? null : Number(value);

    const series = getTimeRangeData.rows.map((row) => ({
      bucket: row.bucket,
      p50: toNum(row.p50),
      p75: toNum(row.p75),
      p90: toNum(row.p90),
      p95: toNum(row.p95),
      p99: toNum(row.p99),
      p999: toNum(row.p999),
    }));

    await client.query("COMMIT");

    const timeRangeInfo = {
      range: timeRange,
      summary: {
        avgMs: toNum(rows.avg_ms),
        maxMs: toNum(rows.max_ms),
        sampleCount: Number(rows.sample_count),
        percentiles: rows.percentiles,
      },
      series,
    }

    console.log(timeRangeInfo);

    return timeRangeInfo;

  }
  catch (err) {
    await client.query("ROLLBACK");

    logger.error({ err }, "handshake latency query failed");
    throw err;
  }
  finally {
    client.release();
  }

}
