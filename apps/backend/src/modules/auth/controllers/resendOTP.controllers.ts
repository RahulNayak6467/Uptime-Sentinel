import { NextFunction, Request, Response } from "express";
import { resendOtpRequest } from "../services/resendOTP.services";
import { emailSchema } from "../validations/emailValidation";

export const resendOTPMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = emailSchema.parse(req.body.email);
    await resendOtpRequest(email);
    return res.status(200).json({
      data: { message: "Verification email sent" },
    });
  } catch (err) {
    return next(err);
  }
};
