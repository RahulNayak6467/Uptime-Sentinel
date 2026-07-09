import { env } from "../config/env";
import { Pool } from "pg";
import logger from "../config/logger";

export const db: Pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const dbLogger = logger.child({ port: env.POSTGRESQL_PORT });

db.on("connect", () => {
  dbLogger.info("Database is connected");
});

db.on("error", (err) => {
  dbLogger.error({ err }, "Unexpected DB error");
  process.exit(-1);
});
