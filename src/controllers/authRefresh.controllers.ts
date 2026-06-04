import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError, PostgresError } from "../errors/AppError";
import { UrlResponseData } from "../types/types";
import { Request, Response } from "express";
import { checkValidRefreshToken } from "../services/authRefresh.services";

export const generateAccessToken = async (req: Request, res: Response) => {
  // console.log(req);
  const refreshTokens: string = req.body.refreshTokens;
  // console.log(refreshTokens);
  if (!refreshTokens) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecretKey) {
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const generateNewToken = await checkValidRefreshToken(refreshTokens);
    return res.status(201).json(generateNewToken);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token is expired" });
    } else if (error instanceof JsonWebTokenError) {
      // console.log(error.message);
      return res.status(401).json({ message: "UnAuthorized" });
    } else if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
