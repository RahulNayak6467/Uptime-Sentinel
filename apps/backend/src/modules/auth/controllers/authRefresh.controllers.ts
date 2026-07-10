import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError, PostgresError } from "../../../shared/errors/AppError";
import { UrlResponseData } from "../../../shared/types/types";
import { NextFunction, Request, Response } from "express";
import { checkValidRefreshToken } from "../services/authRefresh.services";
import { env } from "../../../config/env";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../auth-config";

export const generateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshTokens = req.cookies.refreshToken;
  if (!refreshTokens) {
    throw new AppError(400, "Missing Tokens", "MISSING_REFRESH_TOKEN");
  }
  const refreshSecretKey = env.JWT_REFRESH_SECRET;
  if (!refreshSecretKey) {
    throw new AppError(500, "Internal server error", "AUTH_CONFIG_ERROR");
  }
  try {
    const { message, token: accessToken, refreshToken } =
      await checkValidRefreshToken(refreshTokens);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken,refreshTokenCookieOptions)

    return res.status(201).json({ data: { message } });
  } catch (err) {
    return next(err);
  }
};
