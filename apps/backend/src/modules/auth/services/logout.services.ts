import { AppError } from "../../../shared/errors/AppError";
import { db } from "../../../db/index";
import redis from "../../../redis";
import logger from "../../../config/logger";

export const removeToken = async (
  user_id: string,
  jti: string,
  expirationTime: number,
) => {
  const query = "DELETE FROM refresh_tokens WHERE user_id = $1";
  const values = [user_id];
  try {
    const removeToken = await db.query(query, values);
    const rows = removeToken.rowCount;
    if (!rows) {
      throw new AppError(200, "Already loggedout", "ALREADY_LOGGED_OUT");
    }
    const timeLeftToLive = expirationTime - Math.floor(Date.now() / 1000);
    logger.debug({ userId: user_id, tokenTtl: timeLeftToLive }, "blacklisting access token");
    const addAccessTokens = await redis.set(
      `auth:blacklist:${jti}`,
      "1",
      "EX",
      timeLeftToLive,
    );
    if (!addAccessTokens) {
      throw new AppError(500, "Internal server error", "REDIS_ERROR");
    }
    logger.info({ userId: user_id }, "user logged out");
    return "successfully logged out";
  } catch (error) {
    if (!(error instanceof AppError)) {
      logger.error({ err: error, userId: user_id }, "logout failed unexpectedly");
    }
    throw error;
  }
};
