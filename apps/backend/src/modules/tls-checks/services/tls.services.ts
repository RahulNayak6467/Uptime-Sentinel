import { QueryResult } from "pg";
import { db } from "../../../db";
import { AppError, PostgresError } from "../../../shared/errors/AppError";
import { tlsFetcher } from "../../../checkers/tls/tlsFetcher";
import { TlsCheckInfo } from "../types/tls-db-types";
import { TlsResult } from "../../../checkers/tls/tls.types";
import logger from "../../../config/logger";

export const checkTlsHealth = async (user_id: string, tls_id: string): Promise<TlsResult>  => {

  // let responseObject: TlsResult | null = null;

  try {
    const tls_info_query = `
      SELECT t.warning_threshold_days, m.url, m.request_timeout_ms
      FROM tls_config t
      INNER JOIN monitor m ON t.monitor_id = m.id
      WHERE m.user_id = $1 AND m.id = $2
    `;
    const tls_info_values = [user_id, tls_id];

    const getTlsInfo: QueryResult<TlsCheckInfo> = await db.query(tls_info_query, tls_info_values);

    const rows = getTlsInfo.rows;

    if (rows.length === 0) {
      throw new AppError(404, "Tls not found", "TLS_NOT_FOUND");
    }

    const { warning_threshold_days, url: host, request_timeout_ms: connection_timeout } = rows[0];

    logger.info({ host: host });

    // const hostName = new URL(host).hostname;

    const responseObject = await tlsFetcher(host, connection_timeout, warning_threshold_days);

    return responseObject;

  }
  catch (err) {
    if (err instanceof AppError) {
      throw err
    }
    if (err instanceof Error) {
      if (err instanceof PostgresError && err.code === "22P02") {
        throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
      }
      else {
        throw new Error("Internal server error", {cause: err});
      }
    }
    else {
       throw new Error("Internal server error")
    }
  }
}
