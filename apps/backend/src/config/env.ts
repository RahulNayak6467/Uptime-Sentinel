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

  DATABASE_URL: requireEnv("DATABASE_URL"),

  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  BULL_BOARD_PASSWORD: process.env.BULL_BOARD_PASSWORD || "secret",
  BULL_BOARD_USER: process.env.BULL_BOARD_USER || "admin",
  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
  SENTRY_DSN: requireEnv("SENTRY_DSN"),
};
