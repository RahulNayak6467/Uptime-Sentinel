import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_config
      ADD COLUMN linked_monitor_id UUID NULL REFERENCES monitor(id) ON DELETE CASCADE
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_config
      DROP COLUMN linked_monitor_id
  `);
};
