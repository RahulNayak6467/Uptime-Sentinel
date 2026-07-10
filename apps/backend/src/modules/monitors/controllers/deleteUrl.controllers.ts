import { NextFunction, Request, Response } from "express";
import { deleteUrlById } from "../services/deleteUrl.services";
import { AppError } from "../../../shared/errors/AppError";

export const removeUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitorId = req.params.monitorId as string;
  const userId = req.user?.user_id;
  if (!userId) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  if (!monitorId) {
    throw new AppError(400, "Enter valid id", "INVALID_MONITOR_ID");
  }
  try {
    await deleteUrlById(monitorId, userId);
    return res.status(200).json({
      data: { message: "url successfully deleted" },
    });
  } catch (err) {
    return next(err);
  }
};
