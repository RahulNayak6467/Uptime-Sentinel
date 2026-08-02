
import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE tls_checks(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id UUID NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
    status TEXT NOT NULL, CHECK(status IN ('Valid','Expiring','Expired','Invalid','Unreachable')),
    handshake_time_ms INTEGER,
    error_code TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS tls_checks
  `);
};
