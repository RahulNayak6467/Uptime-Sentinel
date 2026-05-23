import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const getToken = req.headers.authorization as string;
  const secretKey = process.env.JWT_SECRET as string;
  try {
    const checkToken = jwt.verify(getToken, secretKey);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token is expired" });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid Token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};
