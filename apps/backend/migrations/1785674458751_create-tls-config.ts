import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE tls_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      monitor_id UUID UNIQUE NOT NULL REFERENCES monitor(id) ON DELETE CASCADE,
      warning_threshold_days INTEGER NOT NULL DEFAULT 30
        CHECK (warning_threshold_days > 0),
      expiry_alert_thresholds INTEGER[] NOT NULL DEFAULT '{1,7,14,30}'
        CHECK (cardinality(expiry_alert_thresholds) >= 1),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NULL
    );
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS tls_config;
  `);
};
