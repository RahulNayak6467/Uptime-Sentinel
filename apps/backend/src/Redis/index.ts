import Redis from "ioredis";
import { env } from "../config/env";
import logger from "../config/logger";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const redisLogger = logger.child({ port: env.REDIS_PORT });

redis.on("connect", () => {
  redisLogger.info("Redis connected");
});

redis.on("error", (err) => {
  redisLogger.error({ err }, "Error in Redis connection");
});

export default redis;
