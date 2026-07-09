import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE notification_logs
    DROP CONSTRAINT notification_logs_type_check
  `);
  pgm.sql(`
    ALTER TABLE notification_logs
    ADD CONSTRAINT notification_logs_type_check
    CHECK (type IN ('down', 'recovery', 'reminder'))
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE notification_logs
    DROP CONSTRAINT notification_logs_type_check
  `);
  pgm.sql(`
    ALTER TABLE notification_logs
    ADD CONSTRAINT notification_logs_type_check
    CHECK (type IN ('down', 'recovery'))
  `);
};
