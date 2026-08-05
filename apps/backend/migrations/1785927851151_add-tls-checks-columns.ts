import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_checks
      ADD COlUMN dns_time_ms INTEGER,
      ADD COLUMN tcp_time_ms INTEGER,
      ADD COLUMN negotiated_protocol TEXT CHECK (negotiated_protocol IN  ('TLSv1.3','TLSv1.2','TLSv1.1','TLSv1','SSLv3')),
      ADD COLUMN grade TEXT CHECK (grade IN ('A+','A','B','C','D','F'));

   ALTER TABLE tls_checks
      RENAME COLUMN  handshake_time_ms TO tls_handshake_time_ms
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_checks
      DROP COLUMN dns_time_ms,
      DROP COLUMN tcp_time_ms,
      DROP COLUMN negotiated_protocol,
      DROP COLUMN grade;

    ALTER TABLE tls_checks
      RENAME COLUMN tls_handshake_time_ms TO handshake_time_ms
  `);
};
