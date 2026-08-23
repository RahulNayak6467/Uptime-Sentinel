import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/AppError";
import { db } from "../../../db";
import bcrypt from "bcrypt";
import { SALT } from "../../../constants/constants";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../../config/env";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "../auth-config";
import logger from "../../../config/logger";
interface userInfoProps {
  id: string;
  password: string;
  email_verified: boolean;
}

export const checkLoginUser = async (email: string, password: string) => {
  try {
    const query = `
      SELECT email,password,id,email_verified
      FROM user_details
      WHERE email = $1
    `;
    const values = [email];
    const getUserInfo = await db.query(query, values);
    if (getUserInfo.rows.length === 0) {
      logger.warn({ reason: "user_not_found" }, "login failed");
      throw new AppError(
        401,
        "Invalid login credentials",
        "INVALID_CREDENTIALS",
      );
    }
    const {
      id: user_id,
      password: userPassword,
      email_verified,
    }: userInfoProps = getUserInfo.rows[0];
    const checkPassword = await bcrypt.compare(password, userPassword);
    if (!checkPassword) {
      logger.warn({ userId: user_id, reason: "bad_password" }, "login failed");
      throw new AppError(
        401,
        "Invalid login credentials",
        "INVALID_CREDENTIALS",
      );
    }
    if (!email_verified) {
      logger.warn(
        { userId: user_id, reason: "email_not_verified" },
        "login blocked",
      );
      throw new AppError(403, "Email not verified", "EMAIL_NOT_VERIFIED");
    }
    const secretKey = env.JWT_SECRET;
    const refreshSecretKey = env.JWT_REFRESH_SECRET;
    if (!secretKey || !refreshSecretKey) {
      throw new AppError(
        500,
        "Internal server error",
        "JWT_SECRET_NOT_CONFIGURED",
      );
    }
    const expiredTime = ACCESS_TOKEN_TTL_SECONDS;
    const refreshExpiresIn = REFRESH_TOKEN_TTL_SECONDS;
    const generatedToken = jwt.sign(
      { user_id, email, jti: uuidv4() },
      secretKey,
      {
        expiresIn: expiredTime,
        algorithm: "HS256",
      },
    );

    const generateRefreshToken = jwt.sign({ user_id }, refreshSecretKey, {
      expiresIn: refreshExpiresIn,
      algorithm: "HS256",
    });

    const hashedRefreshToken = await bcrypt.hash(generateRefreshToken, SALT);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    const insert_Refresh_Query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at
    `;
    const values_Refresh_Query = [user_id, hashedRefreshToken, expiresAt];

    await db.query(insert_Refresh_Query, values_Refresh_Query);

    logger.info({ userId: user_id }, "user logged in");

    return {
      message: "User successfully logged in",
      token: generatedToken,
      refreshToken: generateRefreshToken,
    };
  } catch (error) {
    if (!(error instanceof AppError)) {
      logger.error({ err: error }, "login failed unexpectedly");
    }
    throw error;
  }
};
