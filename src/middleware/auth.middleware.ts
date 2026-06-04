import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import redis from "../Redis";
import { check } from "zod";
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const getToken = req.headers.authorization;

  if (!getToken) {
    throw new AppError(401, "Login failed");
  }
  const secretKey = process.env.JWT_SECRET;
  if (typeof secretKey !== "string") {
    throw new AppError(500, "Internal server error");
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
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
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
