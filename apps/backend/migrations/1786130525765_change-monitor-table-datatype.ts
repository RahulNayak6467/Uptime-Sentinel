import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      ALTER COLUMN http_method DROP NOT NULL,
      ALTER COLUMN content_type DROP NOT NULL,
      ALTER COLUMN request_body_type DROP NOT NULL,
      ALTER COLUMN status_code DROP NOT NULL,
      ALTER COLUMN response_time_threshold_ms DROP NOT NULL;
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      ALTER COLUMN http_method SET NOT NULL,
      ALTER COLUMN content_type SET NOT NULL,
      ALTER COLUMN request_body_type SET NOT NULL,
      ALTER COLUMN status_code SET NOT NULL,
      ALTER COLUMN response_time_threshold_ms SET NOT NULL;
  `);
};
