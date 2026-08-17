import { computeCertificateHistory } from "../../../checkers/tls/deriveTls";
import { TLS_HISTORY_LIMIT } from "../../../constants/constants";
import { db } from "../../../db";

export const getTlsHistoryServices = async (tls_id: string) => {

  const rows = await db.query(
    `SELECT id, type, occurred_at, metadata
     FROM tls_events
     WHERE monitor_id = $1
     ORDER BY occurred_at DESC
     LIMIT $2`,
    [tls_id, TLS_HISTORY_LIMIT],
  );

  const data = computeCertificateHistory(rows.rows);

  return data;
}
