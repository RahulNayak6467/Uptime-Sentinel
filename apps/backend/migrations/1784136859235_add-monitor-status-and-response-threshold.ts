import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      ADD COLUMN last_status_code SMALLINT
        CHECK (last_status_code BETWEEN 100 AND 599),

      ADD COLUMN response_time_threshold_ms INTEGER NOT NULL
        CHECK (response_time_threshold_ms BETWEEN 1 AND 60000)
        DEFAULT 1000,

      ADD CONSTRAINT monitor_response_threshold_within_timeout
        CHECK (response_time_threshold_ms <= request_timeout_ms);
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      DROP COLUMN response_time_threshold_ms,
      DROP COLUMN last_status_code;
  `);
};
