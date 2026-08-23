import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_cert_snapshots
      ADD COlUMN must_staple BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN ocsp_responder TEXT,
      ADD COLUMN ct_logs TEXT[] NOT NULL DEFAULT '{}'
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_cert_snapshots
      DROP COLUMN must_staple,
      DROP COLUMN ocsp_responder,
      DROP COLUMN ct_logs
  `);
};
