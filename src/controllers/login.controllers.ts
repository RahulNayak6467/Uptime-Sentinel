import { NextFunction, Request, Response } from "express";
import { userSchema } from "../validators/userValidation";
import { ZodError } from "zod";
import { checkLoginUser } from "../services/login.services";
import { AppError } from "../errors/AppError";
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!email && !password) {
    return res.status(400).json({ message: "Email and Passwords are missing" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is missing" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is missing" });
  }
  try {
    userSchema.parse({ email, password });
  } catch (err) {
    // if (error instanceof ZodError) {
    //   return res.status(400).json(error.issues[0].message);
    // } else {
    //   return res.status(500).json({ message: "Internal server error" });
    // }
    next(err);
  }

  try {
    const loggedInUser = await checkLoginUser(email, password);
    return res.status(200).json(loggedInUser);
  } catch (err) {
    // if (error instanceof AppError) {
    //   return res.status(error.statusCode).json({ message: error.message });
    // } else return res.status(500).json({ message: "Internal server error" });
    next(err);
  }
};
