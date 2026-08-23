import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      RENAME COLUMN url_name TO monitor_name;

    ALTER TABLE monitor
      ADD COLUMN monitor_type TEXT NOT NULL
        CHECK (monitor_type IN ('http','https','tcp','ssl','dns','keyword'))
        DEFAULT 'https',

      ADD COLUMN content_type TEXT NOT NULL
        CHECK (content_type IN ('application/json','application/x-www-form-urlencoded','text/plain','none'))
        DEFAULT 'none';

  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    ALTER TABLE monitor
      RENAME COLUMN monitor_name TO url_name;

    ALTER TABLE monitor
      DROP COLUMN monitor_type,
      DROP COLUMN content_type;
  `);
};
