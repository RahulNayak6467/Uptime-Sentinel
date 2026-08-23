import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_state
      ALTER COLUMN caa_iodef TYPE TEXT[] USING ARRAY[]::TEXT[],
      ALTER COLUMN caa_iodef SET NOT NULL,
      ALTER COLUMN caa_iodef SET DEFAULT '{}';
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE tls_state
      ALTER COLUMN caa_iodef DROP DEFAULT,
      ALTER COLUMN caa_iodef DROP NOT NULL,
      ALTER COLUMN caa_iodef TYPE TEXT USING NULL;
  `);
};
