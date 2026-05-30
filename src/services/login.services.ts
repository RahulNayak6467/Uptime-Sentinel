import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { db } from "../db/index";
import bcrypt from "bcrypt";
import { SALT } from "../constants/constants";
interface userInfoProps {
  id: string;
  password: string;
}

export const checkLoginUser = async (
  email: string,
  password: string,
): Promise<
  | {
      message: string;
      token: string;
    }
  | undefined
> => {
  try {
    const query = "SELECT email,password,id FROM user_details WHERE email = $1";
    const values = [email];
    const getUserInfo = await db.query(query, values);
    if (getUserInfo.rows.length === 0) {
      throw new AppError(401, "Invalid login credentials");
    }
    const { id: user_id, password: userPassword }: userInfoProps =
      getUserInfo.rows[0];
    const checkPassword = await bcrypt.compare(password, userPassword);
    if (!checkPassword) {
      throw new AppError(401, "Invalid login credentials");
    }
    const secretKey = process.env.JWT_SECRET;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
    if (!secretKey || !refreshSecretKey) {
      throw new AppError(500, "Internal server error");
    }
    const expiredTime = process.env.JWT_EXPIRES_IN;
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    const generatedToken = jwt.sign({ user_id, email }, secretKey, {
      expiresIn: expiredTime,
      algorithm: "HS256",
    });

    const generateRefreshToken = jwt.sign({ user_id }, refreshSecretKey, {
      expiresIn: refreshExpiresIn,
      algorithm: "HS256",
    });

    const hashedRefreshToken = await bcrypt.hash(generateRefreshToken, SALT);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const insert_Refresh_Query =
      //   "INSERT INTO refresh_tokens (user_id,token,expires_at) VALUES($1, $2, $3)";
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at";
    const values_Refresh_Query = [user_id, hashedRefreshToken, expiresAt];

    await db.query(insert_Refresh_Query, values_Refresh_Query);

    return { message: "User successfully logged in", token: generatedToken };
  } catch (error) {
    throw error;
  }
};
