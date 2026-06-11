import { NextFunction, Request, Response } from "express";
import { verifyEmail } from "../services/emailVerification.services";
import { AppError } from "../errors/AppError";
import { emailSchema } from "../validators/emailValidation";
import { ZodError } from "zod";

export const handleEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const otp: string = req.body.otp;
  const email: string = req.body.email;
  if (!otp) {
    return res.status(400).json({ message: "Missing otp" });
  }
  if (typeof otp !== "string") {
    return res.status(400).json({ message: "Invalid otp format" });
  }
  try {
    emailSchema.parse(email);
  } catch (err) {
    // if (err instanceof ZodError) {
    //   return res.status(400).json(err.issues[0].message);
    // } else {
    //   return res.status(500).json({ message: "Internal server error" });
    // }
    next(err);
  }
  try {
    const isCorrectEmail = await verifyEmail(email, otp);
    return res.status(200).json(isCorrectEmail);
  } catch (err) {
    // if (err instanceof AppError) {
    //   res.status(err.statusCode).json({ message: err.message });
    // } else if (err instanceof Error) {
    //   res.status(500).json({ message: err.message });
    // } else {
    //   res.status(500).json({ message: "Internal server error" });
    // }
    next(err);
  }
};
