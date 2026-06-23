import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError, PostgresError } from "../errors/AppError";
import { UrlResponseData } from "../types/types";
import { NextFunction, Request, Response } from "express";
import { checkValidRefreshToken } from "../services/authRefresh.services";
import { env } from "../config/env";
import { accessTokenCookieOptions } from "../auth-config";

export const generateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req);
  const refreshTokens = req.cookies.refreshToken;
  console.log("RefreshToken: ", refreshTokens);
  if (!refreshTokens) {
    return res.status(400).json({ message: "Missing Tokens" });
  }
  const refreshSecretKey = env.JWT_REFRESH_SECRET;
  if (!refreshSecretKey) {
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const { message, token: accessToken } =
      await checkValidRefreshToken(refreshTokens);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
};
