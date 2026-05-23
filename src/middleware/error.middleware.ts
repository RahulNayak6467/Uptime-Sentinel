import { AppError } from "../errors/AppError";
import { Request, Response, NextFunction } from "express";

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.message);
  } else return res.status(500).json({ message: "Internal server error" });
};
