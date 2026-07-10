import bcrypt from "bcrypt";
import { db } from "../../../db";
import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/AppError";
import { email } from "zod";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../../config/env";
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "../auth-config";
import logger from "../../../config/logger";
import { SALT } from "../../../constants/constants";

export const checkValidRefreshToken = async (refreshToken: string) => {
  const refreshTokenSecret = env.JWT_REFRESH_SECRET;
    const client = await db.connect()
  try {

    client.query("BEGIN")

    if (!refreshTokenSecret) {
      throw new AppError(500, "Internal server error", "REFRESH_SECRET_NOT_CONFIGURED");
    }
    const { user_id } = jwt.verify(refreshToken, refreshTokenSecret) as {
      user_id: string;
    };

    const query = "SELECT token FROM refresh_tokens where user_id = $1";
    const values = [user_id];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      throw new AppError(401, "Unauthenticated", "REFRESH_TOKEN_NOT_FOUND");
    }
    const hashedRefreshToken: string = result.rows[0].token;
    const isCorrectRefreshToken = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken,
    );
    if (!isCorrectRefreshToken) {
      throw new AppError(401, "Unauthenticated", "REFRESH_TOKEN_INVALID");
    }
    const secretKey = env.JWT_SECRET;
    const expiresIn = ACCESS_TOKEN_TTL_SECONDS;
    const refreshExpiresIn = REFRESH_TOKEN_TTL_SECONDS
    const refreshSecretKey = env.JWT_REFRESH_SECRET

    if (!secretKey || !refreshExpiresIn) {
      throw new AppError(500, "Internal server error", "JWT_SECRET_NOT_CONFIGURED");
    }

    const generateNewRefreshToken = jwt.sign(
      { user_id, jti: uuidv4() },
      refreshSecretKey,
      {
      expiresIn: refreshExpiresIn,
      algorithm:"HS256"
      }
    )

    const hashedNewRefreshFreshToken = await bcrypt.hash(generateNewRefreshToken,SALT)

    const generate_newRefreshToken_query = "UPDATE refresh_tokens SET token = $1,created_at = NOW(),expires_at =  NOW() + INTERVAL '7 days' where user_id = $2"
    const generate_newRefreshToken_values = [hashedNewRefreshFreshToken, user_id]

    const updateRefreshToken = await client.query(generate_newRefreshToken_query, generate_newRefreshToken_values)

    const generateNewJWTToken = jwt.sign(
      { user_id, jti: uuidv4() },
      secretKey,
      {
        expiresIn,
        algorithm: "HS256",
      },
    );

    await client.query("COMMIT")

    logger.info({ userId: user_id }, "access token refreshed");
    return {
      message: "Succesfully logged In",
      token: generateNewJWTToken,
      refreshToken: generateNewRefreshToken,
    };
  } catch (error) {
    await client.query("ROLLBACK")
    if (!(error instanceof AppError)) {
      logger.error({ err: error }, "token refresh failed unexpectedly");
    }
    throw error;
  }
  finally {
   client.release()
  }
};
