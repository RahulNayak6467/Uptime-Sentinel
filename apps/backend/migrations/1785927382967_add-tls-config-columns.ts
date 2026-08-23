import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_config
      ADD COlUMN pinned_fingerprint TEXT,
      ADD COLUMN pinned_at TIMESTAMPTZ DEFAULT NULL,
      ADD COLUMN auto_repin BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN min_tls_version TEXT NOT NULL DEFAULT 'TLSv1.2' CHECK (min_tls_version IN ('TLSv1', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3')),
      ADD COLUMN enabled_alerts TEXT[] NOT NULL DEFAULT '{expiring,expired_or_invalid,hostname_mismatch,renewal,revocation,weak_config,recovery}',
      ADD COLUMN port INTEGER NOT NULL DEFAULT 443 CHECK (port BETWEEN 1 AND 65535)
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_config
      DROP COLUMN pinned_fingerprint,
      DROP COLUMN pinned_at,
      DROP COLUMN auto_repin,
      DROP COLUMN min_tls_version,
      DROP COLUMN enabled_alerts,
      DROP COLUMN port
  `);
};
