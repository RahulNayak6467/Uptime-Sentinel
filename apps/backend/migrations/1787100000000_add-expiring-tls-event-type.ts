import { MigrationBuilder } from "node-pg-migrate";

// Adds 'expiring' to the tls_events type CHECK so expiry-warning alerts (#18)
// can be recorded as events and de-duplicated per certificate + threshold.
export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_events DROP CONSTRAINT tls_events_type_check;
    ALTER TABLE tls_events ADD CONSTRAINT tls_events_type_check
      CHECK (type IN ('first_snapshot', 'renewed', 'protocol_change', 'went_down', 'recovered', 'expiring'));
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DELETE FROM tls_events WHERE type = 'expiring';
    ALTER TABLE tls_events DROP CONSTRAINT tls_events_type_check;
    ALTER TABLE tls_events ADD CONSTRAINT tls_events_type_check
      CHECK (type IN ('first_snapshot', 'renewed', 'protocol_change', 'went_down', 'recovered'));
  `);
};
