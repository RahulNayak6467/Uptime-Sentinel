
import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE tls_cert_snapshots(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id UUID NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
    fingerprint_sha256 TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    issuer TEXT NOT NULL,
    subject TEXT,
    san_names TEXT[] NOT NULL DEFAULT '{}',
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    signature_algorithm TEXT NOT NULL,
    asymmetric_key_type TEXT,
    key_bits INTEGER,
    nist_curve TEXT,
    chain jsonb NOT NULL DEFAULT '[]',
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS tls_cert_snapshots
  `);
};
