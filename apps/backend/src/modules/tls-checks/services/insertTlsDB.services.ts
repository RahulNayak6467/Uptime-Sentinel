import { PoolClient, QueryResult } from "pg";
import { CertGrade, CertificateEvents, TlsResult, TlsStatus } from "../../../checkers/tls/tls.types"
import { db } from "../../../db";
import { RenewalCheck } from "../types/tls-db-types";
import { checkFirstSnapshot, detectProtocolChange } from "./tlsCertEvents.services";
import { SNAPSHOTS_DB_LIMIT } from "../../../constants/constants";

export const insertToDB = async (tls_id: string, tlsCheckData: TlsResult) => {

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Inserting to tls_checks
    const status = tlsCheckData.status;
    const error_code = tlsCheckData.error?.code ?? null;
    const error_message = tlsCheckData.error?.message ?? null;
    const tls_handshake_time_ms = tlsCheckData.derived?.connectionLatency.tlsMs ?? null;
    const dns_time_ms = tlsCheckData.derived?.connectionLatency.dnsMs ?? null
    const tcp_time_ms = tlsCheckData.derived?.connectionLatency.tcpMs ?? null;
    const negotiated_protocol = tlsCheckData.certificate?.tls_version ?? null;
    const grade = tlsCheckData.derived?.securityGrade.grade ?? null

    const insert_tlsInfo_query = `
      INSERT INTO tls_checks (
        monitor_id, status, tls_handshake_time_ms, error_code, error_message,
        dns_time_ms, tcp_time_ms, negotiated_protocol, grade
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const insert_tlsInfo_values = [tls_id, status, tls_handshake_time_ms, error_code, error_message, dns_time_ms, tcp_time_ms, negotiated_protocol, grade];

    if (negotiated_protocol) {
      await detectProtocolChange(client, tlsCheckData, tls_id, negotiated_protocol, grade);
    }

    const getInsertedData = await client.query(insert_tlsInfo_query, insert_tlsInfo_values);

    await updateTlsMonitor(client,tls_id, status);

    const fingerprint = tlsCheckData.certificate?.leaf_certificate.finger_print;
    // if (!fingerprint || !tlsCheckData.certificate || !tlsCheckData.derived) return;
    if (fingerprint && tlsCheckData.certificate && tlsCheckData.derived) {

    // Inserting to tls_state
    const revocation = tlsCheckData.derived?.revocation ?? null;

    const revocation_status = tlsCheckData.ocsp?.status ?? "unknown";
    const revocation_source = revocation_status === "unknown" ? null : "ocsp";
    const ocsp_next_update = revocation?.footer.nextOcspUpdate ?? null;
    const caa_allowed_issuers = tlsCheckData.derived?.caaInfo.allowedIssuers ?? [];
    const caa_iodef = tlsCheckData.derived?.caaInfo.iodef ?? [];
    const caa_present = tlsCheckData.derived?.caaInfo.caaPresent ?? false;
    const ocsp_stapled = tlsCheckData.certificate.ocsp_stapled;
    const ocsp_stapled_produced_at = tlsCheckData.ocsp?.producedAt ?? null;
    const protocol_scan = JSON.stringify(tlsCheckData.offeredProtocols);
    const alpn = tlsCheckData.certificate.alpn_protocol ? [tlsCheckData.certificate.alpn_protocol] : [];
    const revoked_at = tlsCheckData.ocsp?.revokedAt ? tlsCheckData.ocsp?.revokedAt : tlsCheckData.crl?.revokedAt ? tlsCheckData.crl?.revokedAt : null;
    // const grade = tlsCheckData.derived?.securityGrade.grade ?? null;

    const insert_update_query = `
      INSERT INTO tls_state (
        monitor_id, protocol_scan, alpn, revocation_status, revocation_source,
        ocsp_next_update, revoked_at, ocsp_stapled, ocsp_staple_produced_at,
        caa_present, caa_allowed_issuers, caa_iodef
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (monitor_id) DO UPDATE SET
        protocol_scan = $2,
        alpn = $3,
        revocation_status = $4,
        revocation_source = $5,
        ocsp_next_update = $6,
        revoked_at = $7,
        ocsp_stapled = $8,
        ocsp_staple_produced_at = $9,
        caa_present = $10,
        caa_allowed_issuers = $11,
        caa_iodef = $12,
        updated_at = NOW()
    `;
    const insert_update_values = [tls_id, protocol_scan, alpn, revocation_status, revocation_source, ocsp_next_update, revoked_at, ocsp_stapled, ocsp_stapled_produced_at, caa_present, caa_allowed_issuers, caa_iodef];

    const insertUpdateData = await client.query(insert_update_query, insert_update_values);

    await checkFirstSnapshot(client, tls_id, tlsCheckData);

    await checkIsCertificateRenewed(client, tls_id, fingerprint, tlsCheckData);
  }
    await client.query("COMMIT")
  }
  catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
  finally{
    client.release();
  }
}

export const updateTlsMonitor = async (client: PoolClient, tls_id: string, status: TlsStatus | "Unreachable") => {

  let statusCheck: "UP" | "DOWN" = "UP";

  if (status === "Valid" || status === "Expiring") {
    statusCheck = "UP";
  }
  else {
    statusCheck = "DOWN"
  }

  const update_tls_query = `
    UPDATE monitor
    SET status = $1,
    next_check_at = NOW() + (interval_seconds || ' seconds')::interval
    WHERE id = $2
  `;
  const update_tls_values = [statusCheck, tls_id];

  const updateTlsData = await client.query(update_tls_query, update_tls_values);

  return updateTlsData;
}

export const checkIsCertificateRenewed = async (client: PoolClient,tls_id: string, fingerprint_sha256: string, tlsCheckData: TlsResult) => {
  const previous_certificate_query = `
    SELECT fingerprint_sha256
    FROM tls_cert_snapshots
    WHERE monitor_id = $1
    ORDER BY first_seen_at DESC
    LIMIT 1
  `;
  const previous_certificate_values = [tls_id];

  const previousCertificateFingerprint: QueryResult<RenewalCheck> = await client.query(previous_certificate_query, previous_certificate_values);

  const rows = previousCertificateFingerprint.rows;

  if (rows.length === 0) {
    return await insertToSnapshot(client, tls_id, tlsCheckData,"first_snapshot");
  }

  const compareFingerprint = rows[0].fingerprint_sha256 === fingerprint_sha256;

  if (compareFingerprint) return;

  await insertToSnapshot(client, tls_id, tlsCheckData,"renewed");
}

export const insertToSnapshot = async (client: PoolClient, tls_id: string, tlsCheckData: TlsResult, eventType: CertificateEvents) => {
  if (!tlsCheckData.certificate || !tlsCheckData.derived || !tlsCheckData.certificateTransparency) return;

  const fingerprint = tlsCheckData.certificate.leaf_certificate.finger_print;
  const {issuer, serial_number, subject, valid_from, valid_to } = tlsCheckData.certificate.leaf_certificate;
  const san_names = tlsCheckData.derived.subjectAlternativeNames ?? [];
  const chain = JSON.stringify(tlsCheckData.derived.chainOfTrustCertificate.links);
  const must_staple = tlsCheckData.derived.securityGrade.signals.mustStapleSignal;
  const ocsp_responder = tlsCheckData.derived.ocspResponder;
  const { signature_algorithm, asymmetricKeyType: asymmetric_key_type, bits: key_bits, nist: nist_curve } = tlsCheckData.certificate
  const ct_logs = tlsCheckData.certificateTransparency.logs.map((log) => log.logId);

  // insert the new snapshot
  const insert_snapshot_query = `
    INSERT INTO tls_cert_snapshots (
      monitor_id, fingerprint_sha256, serial_number, issuer, subject, san_names,
      valid_from, valid_to, signature_algorithm, asymmetric_key_type, key_bits,
      nist_curve, chain, must_staple, ocsp_responder, ct_logs
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  `;
  const insert_snapshot_values = [tls_id, fingerprint, serial_number, issuer, subject, san_names, new Date(valid_from), new Date(valid_to), signature_algorithm, asymmetric_key_type, key_bits, nist_curve, chain, must_staple, ocsp_responder, ct_logs];

  const insertSnapshot = await client.query(insert_snapshot_query, insert_snapshot_values);

  // delete if snapshots cross the SnapshotLIMIT

  const delete_snapshot_query = `DELETE FROM tls_cert_snapshots
    WHERE monitor_id = $1
      AND id IN (
        SELECT id FROM tls_cert_snapshots
        WHERE monitor_id = $1
        ORDER BY first_seen_at DESC, id DESC
        OFFSET $2
      )
    `;

  const delete_snapshot_value = [tls_id, SNAPSHOTS_DB_LIMIT];

  await client.query(delete_snapshot_query, delete_snapshot_value);


  // insert the renewal event

  if (eventType === "first_snapshot") return insertSnapshot;

  const metadata = {
    eventType
  }

  const insert_event_query = `INSERT INTO tls_events (
    monitor_id, type, metadata
    )
    VALUES($1, $2, $3)
  `;

  const insert_event_values = [tls_id, eventType, metadata];

  const insertRenewalEvents = await client.query(insert_event_query, insert_event_values);

  return { insertSnapshot, insertRenewalEvents };
}
