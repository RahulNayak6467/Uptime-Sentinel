import { env } from "../config/env";
import { Pool } from "pg";

export const db: Pool = new Pool({
  connectionString: env.DATABASE_URL,
});

db.on("error", (err) => {
  console.error("Unexpected DB error:", err);
  process.exit(-1); // or handle gracefully
});
