import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
        CREATE TABLE url_checks(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        monitor_id UUID NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
        status TEXT NOT NULL CHECK (status IN ('UP', 'DOWN')),
        status_code SMALLINT,
        response_time INTEGER,
        error_message TEXT,
        checked_at TIMESTAMP DEFAULT NOW()
        )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS url_checks
  `);
};
