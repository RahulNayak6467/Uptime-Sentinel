import { AppError } from "../errors/AppError";
import { db } from "../db/index";
import redis from "../Redis";

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
      throw new AppError(200, "Already loggedout");
    }
    const timeLeftToLive = expirationTime - Math.floor(Date.now() / 1000);
    console.log("TimeLeftToLive: ", timeLeftToLive);
    const addAccessTokens = await redis.set(
      `auth:blacklist:${jti}`,
      "1",
      "EX",
      timeLeftToLive,
    );
    if (!addAccessTokens) {
      throw new AppError(500, "Internal server error");
    }
    return "successfully logged out";
  } catch (error) {
    // console.log("Error:", error.message);
    throw error;
  }
};
