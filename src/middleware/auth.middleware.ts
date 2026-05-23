import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const getToken = req.headers.authorization as string;
  if (!getToken) {
    throw new AppError(401, "Login failed");
  }
  const secretKey = process.env.JWT_SECRET as string;
  console.log(getToken);
  try {
    const checkToken = jwt.verify(getToken, secretKey) as {
      user_id: string;
      email: string;
    };
    req.user = checkToken;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token is expired" });
    } else if (error instanceof JsonWebTokenError) {
      console.log(error.message);
      return res.status(401).json({ message: "Invalid Token" });
    } else if (error instanceof AppError) {
      return res.status(error.statusCode).json(error.message);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  next();
};
