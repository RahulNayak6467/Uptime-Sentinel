import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE incidents(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id UUID references monitor(id) ON DELETE CASCADE,
    resolved_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS incidents
  `);
};
