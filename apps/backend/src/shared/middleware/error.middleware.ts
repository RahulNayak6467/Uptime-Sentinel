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
  const originalCode = err instanceof AppError ? err.code : undefined;
  Sentry.captureException(
    err,
    originalCode ? { extra: { code: originalCode } } : undefined,
  );
  if (err instanceof ZodError) {
    const errors = err.issues.reduce<Record<string, string>>((acc, issue) => {
      const path = issue.path.join(".") || "root";
      acc[path] = issue.message;
      return acc;
    }, {});

    req.log.warn(
      {
        reason: "validation_failed",
        issueCount: err.issues.length,
        path: err.issues[0]?.path.join("."),
      },
      "request validation failed",
    );
    return res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors,
    });
  }
  if (err instanceof TokenExpiredError) {
    req.log.warn({ reason: "access_token_expired" }, "authentication failed");
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (err instanceof JsonWebTokenError) {
    req.log.warn({ reason: "access_token_invalid" }, "authentication failed");
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (err instanceof AppError) {
    if (err.statusCode === 401) {
      const body: Record<string, unknown> = { message: "Unauthenticated" };
      if (err.code) body.code = err.code;
      return res.status(401).json(body);
    }
    if (err.statusCode >= 500) {
      req.log.error(
        { err, code: err.code, statusCode: err.statusCode },
        "request failed",
      );
      return res.status(err.statusCode).json({
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
    req.log.warn(
      { code: err.code, statusCode: err.statusCode },
      "request failed",
    );
    const body: Record<string, unknown> = { message: err.message };
    if (err.code) body.code = err.code;
    return res.status(err.statusCode).json(body);
  }
  if (err instanceof Error) {
    req.log.error({ err }, "request failed unexpectedly");
    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  } else {
    req.log.error({ err }, "request failed with a non-error value");
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
