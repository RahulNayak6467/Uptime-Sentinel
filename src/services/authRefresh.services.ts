import bcrypt from "bcrypt";
import { db } from "../db/index";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export const checkValidRefreshToken = async (refreshToken: string) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
  console.log(refreshTokenSecret);
  try {
    if (!refreshTokenSecret) {
      throw new AppError(500, "Internal server error");
    }
    const { user_id } = jwt.verify(refreshToken, refreshTokenSecret) as {
      user_id: string;
    };

    const query = "SELECT token FROM refresh_tokens where user_id = $1";
    const values = [user_id];
    const result = await db.query(query, values);
    console.log(result);
    if (result.rows.length === 0) {
      throw new AppError(401, "Unauthorized1");
    }
    const hashedRefreshToken: string = result.rows[0].token;
    console.log(hashedRefreshToken);
    const isCorrectRefreshToken = await bcrypt.compare(
      refreshToken,
      hashedRefreshToken,
    );
    if (!isCorrectRefreshToken) {
      throw new AppError(401, "Unauthorized2");
    }
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!secretKey) {
      throw new AppError(500, "Internal server error");
    }
    const generateNewJWTToken = jwt.sign({ user_id }, secretKey, {
      expiresIn,
      algorithm: "HS256",
    });

    return {
      message: "Succesfully logged In",
      token: generateNewJWTToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
