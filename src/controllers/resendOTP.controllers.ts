import { Request, Response } from "express";
import { resendOtpRequest } from "../services/resendOTP.services";
import { AppError } from "../errors/AppError";
import { emailSchema } from "../validators/emailValidation";
import { ZodError } from "zod";

export const resendOTPMessage = async (req: Request, res: Response) => {
  const email = req.body.email;

  try {
    emailSchema.parse(email);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json(err.issues[0].message);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  try {
    const resend = await resendOtpRequest(email);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof Error) {
      return res.status(500).json("Internal server error");
    }
  }
};
