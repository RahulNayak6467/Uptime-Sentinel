import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE incident_updates(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('detected', 'investigating', 'monitoring', 'resolved')),
    message TEXT,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
    )
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX incident_updates_one_lifecycle_note
    ON incident_updates (incident_id, type)
    WHERE type IN ('detected', 'resolved')
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS incident_updates
  `);
};
