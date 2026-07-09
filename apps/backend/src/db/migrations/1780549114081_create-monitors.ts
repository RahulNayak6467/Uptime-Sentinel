import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
        CREATE TABLE  monitor(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        url TEXT NOT NULL,
        name TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES user_details(id) ON DELETE CASCADE,
        is_active BOOLEAN NOT NULL DEFAULT true,
        interval_seconds INTEGER NOT NULL CHECK (interval_seconds >= 30),
        next_check_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
        )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS monitor
  `);
};
