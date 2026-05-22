import { Request, Response } from "express";
import { userSchema } from "../validators/userValidation";
import { ZodError } from "zod";
import { insertUserData } from "../services/users.services";
import { AppError } from "../errors/AppError";
export const handleUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    userSchema.parse({ email, password });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  try {
    const userData = await insertUserData(password, email);
    return res.status(200).json(userData);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(error.message);
    } else if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
