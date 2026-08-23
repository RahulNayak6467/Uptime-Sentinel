import { NextFunction, Request, Response } from "express";
import { getIncidentsStatsCardInfo } from "../services/incidensStatsCard.services";
import { LIMIT_RECENT_ALERTS } from "../../../../constants/constants";
import { AppError } from "../../../../shared/errors/AppError";

export const getIncidentsStatsCardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const getIncidentsData = await getIncidentsStatsCardInfo(userId);
    return res.status(200).json({ data: getIncidentsData });
  } catch (err) {
    return next(err);
  }
};
