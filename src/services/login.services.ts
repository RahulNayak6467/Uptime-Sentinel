import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { db } from "../index";
import bcrypt from "bcrypt";
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
      token: never;
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
    const secretKey = process.env.JWT_SECRET as string;
    const expiredTime = process.env.JWT_EXPIRES_IN;
    const generatedToken = jwt.sign({ user_id, email }, secretKey, {
      expiresIn: expiredTime,
      algorithm: "HS256",
    });

    return { message: "User successfully logged in", token: generatedToken };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Error) {
      console.log(error.message);
      throw error;
    }
  }
};
