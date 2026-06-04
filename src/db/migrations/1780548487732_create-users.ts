import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.sql(`
        CREATE TABLE  IF NOT EXISTS user_details(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        )
  `);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.sql(`
    DROP TABLE IF EXISTS user_details
  `);
};

//
// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// email VARCHAR(255) NOT NULL UNIQUE
// password TEXT NOT NULL
// created_at TIMESTAMP DEFAULT NOW()

//
// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// url TEXT NOT NULL
// name TEXT NOT NULL
// user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
// is_active BOOLEAN NOT NULL DEFAULT true
// interval_seconds INTEGER NOT NULL CHECK (interval_seconds >= 30)
// next_check_at TIMESTAMP NOT NULL DEFAULT NOW()
// created_at TIMESTAMP DEFAULT NOW()

//
// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// monitor_id UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE
// status TEXT NOT NULL CHECK (status IN ('UP', 'DOWN'))
// status_code SMALLINT
// response_time INTEGER
// error_message TEXT
// checked_at TIMESTAMP DEFAULT NOW()

//
// id UUID PRIMARY KEY DEFAULT gen_random_uuid()
// user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
// token TEXT NOT NULL UNIQUE
// expires_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '7 days'
// created_at TIMESTAMP DEFAULT NOW()
