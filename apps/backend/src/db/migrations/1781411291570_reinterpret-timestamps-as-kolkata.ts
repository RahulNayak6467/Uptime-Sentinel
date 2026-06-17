import { MigrationBuilder } from "node-pg-migrate";

// The previous migration (convert-timestamps-to-timestamptz) widened these
// naive TIMESTAMP columns to TIMESTAMPTZ while interpreting the original
// wall-clock values as UTC. Those values were actually recorded in
// "Asia/Kolkata" local time, so the stored instants are off by the IST offset.
//
// To correct this we strip the UTC instant back to its naive wall-clock value
// (AT TIME ZONE 'UTC') and re-interpret that same value as Asia/Kolkata.
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
      USING (${column} AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata'
    `);
  }
};

export const down = (pgm: MigrationBuilder): void => {
  for (const { table, column } of columns) {
    pgm.sql(`
      ALTER TABLE ${table}
      ALTER COLUMN ${column} TYPE TIMESTAMPTZ
      USING (${column} AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'UTC'
    `);
  }
};
