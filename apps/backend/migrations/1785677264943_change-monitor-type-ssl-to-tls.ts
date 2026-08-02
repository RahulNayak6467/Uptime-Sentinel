import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      DROP CONSTRAINT monitor_monitor_type_check;

    ALTER TABLE monitor
      ADD CONSTRAINT monitor_monitor_type_check
        CHECK (monitor_type IN ('http','https','tcp','tls','dns','keyword'));
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      DROP CONSTRAINT monitor_monitor_type_check;

    ALTER TABLE monitor
      ADD CONSTRAINT monitor_monitor_type_check
        CHECK (monitor_type IN ('http','https','tcp','ssl','dns','keyword'));
  `);
};
