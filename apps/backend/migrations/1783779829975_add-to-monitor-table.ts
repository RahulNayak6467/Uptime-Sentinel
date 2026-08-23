import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE FUNCTION is_valid_status_codes(codes INTEGER[])
    RETURNS BOOLEAN
    LANGUAGE sql
    IMMUTABLE
    AS $$
      SELECT COALESCE(bool_and(code BETWEEN 100 AND 599), TRUE)
      FROM unnest(codes) AS code;
    $$;

    ALTER TABLE monitor
      ADD COLUMN http_method TEXT NOT NULL
        CHECK (http_method IN ('GET','POST','PUT','PATCH','DELETE'))
        DEFAULT 'GET',

      ADD COLUMN request_timeout_ms INTEGER NOT NULL
        CHECK (request_timeout_ms BETWEEN 1000 AND 60000)
        DEFAULT 5000,

      ADD COLUMN request_body_type TEXT NOT NULL
        CHECK (request_body_type IN ('none','json','form-encoded','raw-text'))
        DEFAULT 'none',

      ADD COLUMN request_body TEXT,

      ADD COLUMN failure_threshold SMALLINT NOT NULL
        CHECK (failure_threshold BETWEEN 1 AND 10)
        DEFAULT 1,

      ADD COLUMN recovery_threshold SMALLINT NOT NULL
        CHECK (recovery_threshold BETWEEN 1 AND 10)
        DEFAULT 1,

      ADD COLUMN consecutive_failure_count SMALLINT NOT NULL
        CHECK (consecutive_failure_count BETWEEN 0 AND 10)
        DEFAULT 0,

      ADD COLUMN consecutive_success_count SMALLINT NOT NULL
        CHECK (consecutive_success_count BETWEEN 0 AND 10)
        DEFAULT 0,

      ADD COLUMN status_code INTEGER[] NOT NULL
        CHECK (is_valid_status_codes(status_code))
        DEFAULT '{200}';
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      DROP COLUMN status_code,
      DROP COLUMN consecutive_success_count,
      DROP COLUMN consecutive_failure_count,
      DROP COLUMN recovery_threshold,
      DROP COLUMN failure_threshold,
      DROP COLUMN request_body,
      DROP COLUMN request_body_type,
      DROP COLUMN request_timeout_ms,
      DROP COLUMN http_method;

    DROP FUNCTION is_valid_status_codes(INTEGER[]);
  `);
};
