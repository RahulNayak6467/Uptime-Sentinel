import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import redis from "../Redis";
import { env } from "../config/env";
import { check } from "zod";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const getToken = req.cookies.accessToken;

  if (!getToken) {
    req.log.warn({ reason: "missing_access_token" }, "authentication failed");
    return res.status(401).json({ message: "UnAuthorized" });
  }
  const secretKey = env.JWT_SECRET;
  if (typeof secretKey !== "string") {
    req.log.error("authentication configuration is invalid");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const checkToken = jwt.verify(getToken, secretKey) as {
      user_id: string;
      email: string;
      jti: string;
      exp: number;
    };
    req.user = checkToken;
    const isTokenBlacklist = await redis.exists(
      `auth:blacklist:${checkToken.jti}`,
    );
    if (isTokenBlacklist === 1) {
      req.log.warn(
        { userId: checkToken.user_id, reason: "access_token_blacklisted" },
        "authentication failed",
      );
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.log.debug({ userId: checkToken.user_id }, "request authenticated");
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      req.log.warn({ reason: "access_token_expired" }, "authentication failed");
      return res.status(401).json({ message: "Token is expired" });
    } else if (error instanceof JsonWebTokenError) {
      req.log.warn({ reason: "access_token_invalid" }, "authentication failed");
      return res.status(401).json({ message: "UnAuthorized" });
    } else if (error instanceof AppError) {
      const logContext = {
        code: error.code,
        statusCode: error.statusCode,
      };
      if (error.statusCode >= 500) {
        req.log.error({ err: error, ...logContext }, "authentication failed");
      } else {
        req.log.warn(logContext, "authentication failed");
      }
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      req.log.error({ err: error }, "authentication failed unexpectedly");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
