import { Request, Response } from "express";
import { userSchema } from "../validators/userValidation";
import { ZodError } from "zod";
import { insertUserData } from "../services/users.services";
import { AppError } from "../errors/AppError";
export const handleUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!email && !password) {
    return res.status(400).json({ message: "Email and Password are missing" });
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
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues[0].message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  try {
    const userData = await insertUserData(password, email);
    return res.status(201).json({
      message: "User registered check your email to login",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
