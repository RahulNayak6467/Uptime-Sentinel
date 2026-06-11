import { AppError } from "../errors/AppError";
import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Sentry.captureException(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.issues[0].message });
  }
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ message: "Token is expired" });
  }
  if (err instanceof JsonWebTokenError) {
    // console.log(error.message);
    return res.status(401).json({ message: "UnAuthorized" });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.message);
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  } else {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
