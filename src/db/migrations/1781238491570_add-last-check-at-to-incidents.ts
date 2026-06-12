import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE incidents
    ADD COLUMN last_alert_sent_at TIMESTAMP
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE incidents
    DROP COLUMN last_alert_sent_at
  `);
};
