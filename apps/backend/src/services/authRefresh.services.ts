import bcrypt from "bcrypt";
import { db } from "../db/index";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { email } from "zod";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";
import { ACCESS_TOKEN_TTL_SECONDS } from "../auth-config";

export const checkValidRefreshToken = async (refreshToken: string) => {
  const refreshTokenSecret = env.JWT_REFRESH_SECRET;
  // console.log(refreshTokenSecret);
  try {
    if (!refreshTokenSecret) {
      throw new AppError(500, "Internal server error", "REFRESH_SECRET_NOT_CONFIGURED");
    }
    const { user_id } = jwt.verify(refreshToken, refreshTokenSecret) as {
      user_id: string;
    };

    const query = "SELECT token FROM refresh_tokens where user_id = $1";
    const values = [user_id];
    const result = await db.query(query, values);
    // console.log(result);
    if (result.rows.length === 0) {
      throw new AppError(401, "Unauthorized1", "REFRESH_TOKEN_NOT_FOUND");
    }
    const hashedRefreshToken: string = result.rows[0].token;
    // console.log(hashedRefreshToken);
    const isCorrectRefreshToken = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken,
    );
    if (!isCorrectRefreshToken) {
      throw new AppError(401, "Unauthorized2", "REFRESH_TOKEN_INVALID");
    }
    const secretKey = env.JWT_SECRET;
    const expiresIn = ACCESS_TOKEN_TTL_SECONDS;
    if (!secretKey) {
      throw new AppError(500, "Internal server error", "JWT_SECRET_NOT_CONFIGURED");
    }
    const generateNewJWTToken = jwt.sign(
      { user_id, jti: uuidv4() },
      secretKey,
      {
        expiresIn,
        algorithm: "HS256",
      },
    );

    return {
      message: "Succesfully logged In",
      token: generateNewJWTToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
