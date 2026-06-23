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
  console.log(err);
  // Record the real AppError code in logs/Sentry only; it is never returned
  // to the client (see the >=500 branch below).
  const originalCode = err instanceof AppError ? err.code : undefined;
  Sentry.captureException(
    err,
    originalCode ? { extra: { code: originalCode } } : undefined,
  );
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
    // Server errors: send a generic message/code to the client. The real
    // message/code are kept only in the logs and Sentry (captured above).
    if (err.statusCode >= 500) {
      return res.status(err.statusCode).json({
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
    const body: Record<string, unknown> = { message: err.message };
    if (err.code) body.code = err.code;
    return res.status(err.statusCode).json(body);
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  } else {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
