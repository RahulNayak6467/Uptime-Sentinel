import bcrypt from "bcrypt";
import { db } from "../index";
import jwt from "jsonwebtoken";
import { userSchema } from "../validators/userValidation";
import { SALT } from "../constants/constants";
import { AppError } from "../errors/AppError";
export const insertUserData = async (password: string, email: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const insertQuery =
      "INSERT INTO user_details (email, password) VALUES ($1, $2)";
    const insertValues = [email, hashedPassword];
    await db.query(insertQuery, insertValues);
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT secret is not configured");
    }

    const selectQuery = "SELECT id FROM user_details WHERE email = $1";
    const selectValues = [email];

    const getDataByEmail = await db.query(selectQuery, selectValues);
    const user_id = getDataByEmail.rows[0].id;
    console.log(user_id);

    const generatedToken = jwt.sign({ user_id, email }, secretKey, {
      expiresIn,
      algorithm: "HS256",
    });

    return {
      message: "user successfully created",
      token: generatedToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.code === "23505") {
        throw new AppError(500, "email already taken");
      }
      throw new AppError(500, error.message);
    } else {
      throw new AppError(500, "Internal server error");
    }
  }
};
