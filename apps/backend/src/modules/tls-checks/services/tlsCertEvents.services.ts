import { PoolClient } from "pg";
import { CertGrade, CertificateEvents, OCSPStatus, TlsResult, TlsStatus, ValidationChecks } from "../../../checkers/tls/tls.types";
import { SecureVersion } from "tls";
import { reasonForTlsDown } from "../../../checkers/tls/deriveTls";

export const checkFirstSnapshot = async (client: PoolClient, tls_id: string, TlsCheckData: TlsResult) => {

  const first_snapshot_query = `
    SELECT id
    FROM tls_cert_snapshots
    WHERE monitor_id = $1
  `;

  const first_snapshot_values = [tls_id];

  const checkFirstSnapshot = await client.query(first_snapshot_query, first_snapshot_values);

  const rows = checkFirstSnapshot.rows;

  if (rows.length !== 0) return;

  const eventType: CertificateEvents = "first_snapshot"

  const eventMetaData = {
    eventType
  }

  const insert_firstSnapshot_query = `
    INSERT INTO tls_events (monitor_id, type, metadata)
    VALUES ($1, $2, $3)
  `;
  const insert_firstSnapshot_values = [tls_id, eventType, eventMetaData];

  const insertFirstSnapshot = await client.query(insert_firstSnapshot_query, insert_firstSnapshot_values);

  return insertFirstSnapshot;
}

export const detectProtocolChange = async (client: PoolClient, TlsCheckData: TlsResult, tls_id: string, negotiated_protocol: SecureVersion | null, grade: CertGrade | null) => {
  const previous_certificate_query = `
    SELECT negotiated_protocol, grade
    FROM tls_checks
    WHERE monitor_id = $1
    AND negotiated_protocol IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const previous_certificate_values = [tls_id];

  const previousCertificateNegotiatedProtocol = await client.query(previous_certificate_query, previous_certificate_values);

  const rows = previousCertificateNegotiatedProtocol.rows;

  if (rows.length === 0) return;

  const compareProtocolChanges = rows[0].negotiated_protocol === negotiated_protocol;

  if (compareProtocolChanges) return;

  const eventType: CertificateEvents = "protocol_change";

  const metadata = {
    eventType,
    from: rows[0].negotiated_protocol,
    to: negotiated_protocol,
    grade_from: rows[0].grade,
    grade_to: grade
  }

  const change_protocol_query = `
    INSERT INTO tls_events (monitor_id, type, metadata)
    VALUES ($1, $2, $3)
  `;

  const change_protocol_values = [tls_id, eventType, metadata];

  const changedProtocol = await client.query(change_protocol_query, change_protocol_values);

  return changedProtocol;
}

export const insertDownEvent = async (
  client: PoolClient,
  tls_id: string,
  status: TlsStatus | "Unreachable",
  validation: ValidationChecks | null,
  revocationStatus: OCSPStatus["status"],
) => {
  const eventType: CertificateEvents = "went_down";

  const cause = reasonForTlsDown(status, validation, revocationStatus);
  const metadata = {
    eventType,
    cause,
  }

  const insert_down_query = `
    INSERT INTO tls_events (monitor_id, type, metadata)
    VALUES ($1, $2, $3)
    `;
  const insert_down_values = [tls_id, eventType, metadata];

  const downEvent = await client.query(insert_down_query, insert_down_values);

  return downEvent;
}

export const recoveredEvent = async(client: PoolClient, tls_id: string) => {

  const eventType: CertificateEvents = "recovered";

  const metadata = {
    eventType,
  }

  const insert_recovered_query = `
    INSERT INTO tls_events (monitor_id, type, metadata)
    VALUES ($1, $2, $3)
    `;
  const insert_recovered_values = [tls_id, eventType, metadata];

  const insertRecoveredEvent = await client.query(insert_recovered_query, insert_recovered_values);

  return insertRecoveredEvent;
}
