import { Request, Response } from "express";
import { userSchema } from "../validators/userValidation";
import { ZodError } from "zod";
import { checkLoginUser } from "../services/login.services";
import { AppError } from "../errors/AppError";
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    userSchema.parse({ email, password });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.message);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  try {
    const loggedInUser = await checkLoginUser(email, password);
    return res.status(200).json(loggedInUser);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else return res.status(500).json({ message: "Internal server error" });
  }
};
