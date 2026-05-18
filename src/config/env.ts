import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  //   DB_USER: process.env.DB_USER || "rahulnayak",
  //   DB_PASSWORD: process.env.DB_PASSWORD || "",
  //   DB_HOST: process.env.DB_HOST || "localhost",
  //   DB_PORT: 5432,
  //   DB_DATABASENAME: process.env.DB_DATABASENAME || "uptimesentinel",

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
