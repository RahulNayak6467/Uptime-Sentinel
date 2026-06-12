import { MigrationBuilder } from "node-pg-migrate";

// Existing naive TIMESTAMP values were written via NOW() and are assumed to be
// in UTC, so we interpret them as UTC when widening to TIMESTAMPTZ.
const columns: { table: string; column: string }[] = [
  { table: "user_details", column: "created_at" },
  { table: "refresh_tokens", column: "expires_at" },
  { table: "refresh_tokens", column: "created_at" },
  { table: "url_checks", column: "checked_at" },
  { table: "monitor", column: "next_check_at" },
  { table: "monitor", column: "created_at" },
  { table: "notification_logs", column: "created_at" },
  { table: "incidents", column: "resolved_at" },
  { table: "incidents", column: "created_at" },
  { table: "incidents", column: "started_at" },
  { table: "incidents", column: "last_alert_sent_at" },
];

export const up = (pgm: MigrationBuilder): void => {
  for (const { table, column } of columns) {
    pgm.sql(`
      ALTER TABLE ${table}
      ALTER COLUMN ${column} TYPE TIMESTAMPTZ
      USING ${column} AT TIME ZONE 'UTC'
    `);
  }
};

export const down = (pgm: MigrationBuilder): void => {
  for (const { table, column } of columns) {
    pgm.sql(`
      ALTER TABLE ${table}
      ALTER COLUMN ${column} TYPE TIMESTAMP
      USING ${column} AT TIME ZONE 'UTC'
    `);
  }
};
