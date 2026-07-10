import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { checkUrlHealth } from "../services/url.services";
import { TIMEOUT } from "../../../constants/constants";
import { pauseUrl, resumeUrl } from "../../../scheduler/cronSchedule.services";
import { addToQueue } from "../../../queue/monitorQueue";

export const monitorUrlById = async (
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
    const response = await addToQueue(TIMEOUT, userId, monitorId);
    return res.status(202).json({
      data: {
        message: "Check queued",
        jobId: response.id,
        monitorId: monitorId,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const pauseUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitorId: string = req.params.monitorId as string;
  const userId = req.user?.user_id;
  if (!userId) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  if (!monitorId) {
    throw new AppError(400, "Enter valid id", "INVALID_MONITOR_ID");
  }
  try {
    const pause = await pauseUrl(monitorId, userId);
    return res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const resumeUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitorId: string = req.params.monitorId as string;
  const userId = req.user?.user_id;
  if (!userId) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  if (!monitorId) {
    throw new AppError(400, "Enter valid id", "INVALID_MONITOR_ID");
  }
  try {
    const pause = await resumeUrl(monitorId, userId);
    return res.status(204).json();
  } catch (err) {
    return next(err);
  }
};

export const updateMonitorStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitorId = req.params.monitorId as string;
  const userId = req.user?.user_id;
  const isActive = req.body.isActive;

  if (!userId) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  if (!monitorId) {
    throw new AppError(400, "Enter valid id", "INVALID_MONITOR_ID");
  }
  if (typeof isActive !== "boolean") {
    throw new AppError(400, "isActive must be a boolean", "INVALID_STATUS");
  }

  try {
    if (isActive) {
      await resumeUrl(monitorId, userId);
    } else {
      await pauseUrl(monitorId, userId);
    }
    return res.status(204).json();
  } catch (err) {
    return next(err);
  }
};
