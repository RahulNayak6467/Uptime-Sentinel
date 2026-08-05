import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
        CREATE TABLE tls_state (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          monitor_id UUID UNIQUE NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
          protocol_scan JSONB NOT NULL DEFAULT '[]',
          alpn TEXT[] NOT NULL DEFAULT '{}',
          revocation_status TEXT NOT NULL DEFAULT 'unknown' CHECK (revocation_status IN ('good', 'revoked', 'unknown')),
          revocation_source TEXT CHECK(revocation_source IN ('ocsp', 'crl')),
          ocsp_next_update TIMESTAMPTZ,
          revoked_at TIMESTAMPTZ,
          ocsp_stapled BOOLEAN NOT NULL DEFAULT false,
          ocsp_staple_produced_at TIMESTAMPTZ,
          caa_present BOOLEAN NOT NULL DEFAULT false,
          caa_allowed_issuers TEXT[] NOT NULL DEFAULT '{}',
          caa_iodef TEXT,
          scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NULL,
          CHECK ((revocation_status = 'unknown') = (revocation_source IS NULL))
        )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS tls_state
  `);
};
