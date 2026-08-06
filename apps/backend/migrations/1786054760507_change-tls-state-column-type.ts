import { MigrationBuilder } from "node-pg-migrate";

// caa_iodef: TEXT (single) → TEXT[]. computeCaa collects ALL iodef values, so the
// column must be an array to match, and sit consistently beside caa_allowed_issuers
// TEXT[]. Safe to convert with an empty array — tls_state has no rows yet.
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
