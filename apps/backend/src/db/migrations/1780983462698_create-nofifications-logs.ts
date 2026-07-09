import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    CREATE TABLE notification_logs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID references incidents(id) ON DELETE CASCADE,
    resend_email_id TEXT,
    type TEXT CHECK (type IN ('down', 'recovery')),
    status TEXT CHECK (status IN ('sent','failed')),
    created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS notification_logs
  `);
};
