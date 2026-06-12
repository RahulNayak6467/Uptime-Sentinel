import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
    ADD COLUMN status TEXT DEFAULT 'UNKNOWN' CHECK (status in ('UP','DOWN','UNKNOWN'))
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
    DROP COLUMN status
  `);
};
