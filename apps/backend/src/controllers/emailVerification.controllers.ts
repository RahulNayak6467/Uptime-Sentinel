import { NextFunction, Request, Response } from "express";
import { verifyEmail } from "../services/emailVerification.services";
import { emailSchema } from "../validators/emailValidation";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../auth-config";

export const handleEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const otp: string = req.body.otp;
  if (!otp) {
    return res.status(400).json({ message: "Missing otp" });
  }
  if (typeof otp !== "string") {
    return res.status(400).json({ message: "Invalid otp format" });
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

    return res.status(200).json({ message });
  } catch (err) {
    return next(err);
  }
};
