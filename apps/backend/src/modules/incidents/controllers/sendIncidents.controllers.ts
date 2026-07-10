import { NextFunction, Request, Response } from "express";
import { getIncidentsDetailsById } from "../services/sendIncidents.services";
import { AppError } from "../../../shared/errors/AppError";

export const sendIncidentsById = async (
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
    throw new AppError(400, "Enter valid url", "INVALID_MONITOR_ID");
  }
  if (typeof monitorId !== "string") {
    throw new AppError(400, "Url should be of type of string", "INVALID_MONITOR_ID");
  }

  try {
    const getIncidents = await getIncidentsDetailsById(monitorId, userId);
    return res.status(200).json({ data: getIncidents });
  } catch (err) {
    return next(err);
  }
};
