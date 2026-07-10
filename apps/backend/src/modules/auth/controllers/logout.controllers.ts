import { NextFunction, Request, Response } from "express";
import { removeToken } from "../services/logout.services";
import { AppError } from "../../../shared/errors/AppError";
import { clearAuthCookieOptions } from "../auth-config";

export const userLogOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  const jti = req.user?.jti;
  const expirationTime = req.user?.exp;
  if (!userId || !jti || !expirationTime) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  try {
    const removeRefreshToken = await removeToken(userId, jti, expirationTime);

    res.clearCookie("accessToken", clearAuthCookieOptions);

    res.clearCookie("refreshToken", clearAuthCookieOptions);

    return res.status(200).json({ data: { message: removeRefreshToken } });
  } catch (err) {
    return next(err);
  }
};
