import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE user_details
    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE user_details
    DROP COLUMN email_verified
  `);
};
