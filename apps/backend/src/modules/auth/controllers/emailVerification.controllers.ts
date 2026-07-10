import { NextFunction, Request, Response } from "express";
import { verifyEmail } from "../services/emailVerification.services";
import { emailSchema } from "../validations/emailValidation";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../auth-config";
import { AppError } from "../../../shared/errors/AppError";

export const handleEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const otp: string = req.body.otp;
  if (!otp) {
    throw new AppError(400, "Missing otp", "MISSING_OTP");
  }
  if (typeof otp !== "string") {
    throw new AppError(400, "Invalid otp format", "INVALID_OTP_FORMAT");
  }
  try {
    const email = emailSchema.parse(req.body.email);
    const {
      message,
      token: accessToken,
      refreshToken,
    } = await verifyEmail(email, otp);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({ data: { message } });
  } catch (err) {
    return next(err);
  }
};
