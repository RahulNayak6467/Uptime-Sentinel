import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
        CREATE TABLE tls_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          monitor_id UUID NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('first_snapshot', 'renewed', 'protocol_change', 'went_down', 'recovered')),
          occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          metadata JSONB NOT NULL DEFAULT '{}'
        );

        CREATE INDEX idx_tls_events_monitor_occurred
          ON tls_events (monitor_id, occurred_at DESC);
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS tls_events
  `);
};
