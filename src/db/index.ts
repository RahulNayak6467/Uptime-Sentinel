import { Pool } from "pg";

export const db: Pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASENAME,
});

db.on("error", (err) => {
  console.error("Unexpected DB error:", err);
  process.exit(-1); // or handle gracefully
});
