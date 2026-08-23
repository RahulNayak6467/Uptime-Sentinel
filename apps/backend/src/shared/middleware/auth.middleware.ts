import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import redis from "../../redis";
import { env } from "../../config/env";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { JsonWebTokenError, TokenExpiredError } = jwt;
  const getToken = req.cookies.accessToken;

  if (!getToken) {
    req.log.warn({ reason: "missing_access_token" }, "authentication failed");
    return next(new AppError(401, "Unauthenticated", "UNAUTHENTICATED"));
  }
  const secretKey = env.JWT_SECRET;
  if (typeof secretKey !== "string") {
    req.log.error("authentication configuration is invalid");
    return next(
      new AppError(
        500,
        "Authentication configuration is invalid",
        "AUTH_CONFIG_INVALID",
      ),
    );
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
      return next(new AppError(401, "Unauthenticated", "UNAUTHENTICATED"));
    }
    req.log.debug({ userId: checkToken.user_id }, "request authenticated");
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      req.log.warn({ reason: "access_token_expired" }, "authentication failed");
      return next(new AppError(401, "Unauthenticated", "UNAUTHENTICATED"));
    } else if (error instanceof JsonWebTokenError) {
      req.log.warn({ reason: "access_token_invalid" }, "authentication failed");
      return next(new AppError(401, "Unauthenticated", "UNAUTHENTICATED"));
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
      return next(error);
    } else {
      req.log.error({ err: error }, "authentication failed unexpectedly");
      return next(
        new AppError(500, "Authentication failed", "AUTHENTICATION_FAILED"),
      );
    }
  }
};
