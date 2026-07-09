import { NextFunction, Request, Response } from "express";
import { userLoginSchema } from "../validators/userValidation";
import { checkLoginUser } from "../services/login.services";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../auth-config";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    const {
      message,
      token: accessToken,
      refreshToken,
    } = await checkLoginUser(validatedData.email, validatedData.password);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({ message });
  } catch (err) {
    return next(err);
  }
};
