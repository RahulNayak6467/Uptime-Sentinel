import bcrypt from "bcrypt";
import { db } from "../db/index";
import jwt from "jsonwebtoken";
import { userSchema } from "../validators/userValidation";
import { SALT } from "../constants/constants";
import { AppError } from "../errors/AppError";
import { v4 as uuidv4 } from "uuid";

// const accessToken = jwt.sign(
//   {
//     userId: user.id,
//     email: user.email,
//     jti: uuidv4(), // unique ID per token
//   },
//   JWT_SECRET,
//   { expiresIn: "15m" },
// );
export const insertUserData = async (password: string, email: string) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const hashedPassword = await bcrypt.hash(password, SALT);
    const insertQuery =
      "INSERT INTO user_details (email, password) VALUES ($1, $2) RETURNING id";
    const insertValues = [email, hashedPassword];
    const userData = await client.query(insertQuery, insertValues);
    const user_id = userData.rows[0].id;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    const secretKey = process.env.JWT_SECRET;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
    if (!secretKey) {
      throw new AppError(500, "JWT secret is not configured");
    }
    if (!refreshSecretKey) {
      throw new AppError(500, "Refresh secret is not configured");
    }

    const selectQuery = "SELECT id FROM user_details WHERE email = $1";
    const selectValues = [email];

    const generatedToken = jwt.sign(
      { user_id, email, jti: uuidv4() },
      secretKey,
      {
        expiresIn,
        algorithm: "HS256",
      },
    );

    const generateRefreshToken = jwt.sign({ user_id }, refreshSecretKey, {
      expiresIn: refreshExpiresIn,
      algorithm: "HS256",
    });

    const hashedRefreshToken = await bcrypt.hash(generateRefreshToken, SALT);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // const expiresAt = new Date(Date.now() + 5 * 1000);
    const insert_Refresh_Query =
      //   "INSERT INTO refresh_tokens (user_id,token,expires_at) VALUES($1, $2, $3)";
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at";
    const values_Refresh_Query = [user_id, hashedRefreshToken, expiresAt];

    await client.query(insert_Refresh_Query, values_Refresh_Query);

    await client.query("COMMIT");

    return {
      message: "user successfully created",
      token: generatedToken,
      refreshToken: generateRefreshToken,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    // console.log(error);
    if (error instanceof Error) {
      if (error.code === "23505") {
        throw new AppError(409, "email already taken");
      }
      throw new AppError(500, error.message);
    } else {
      throw new AppError(500, "Internal server error");
    }
  } finally {
    client.release();
  }
};
