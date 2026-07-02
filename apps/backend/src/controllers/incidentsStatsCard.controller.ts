import { NextFunction, Request, Response } from "express";
import { getIncidentsStatsCardInfo } from "../services/incidensStatsCard.services";
import { LIMIT_RECENT_ALERTS } from "../constants/constants";

export const getIncidentsStatsCardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const getIncidentsData = await getIncidentsStatsCardInfo(user_id);
    return res.status(200).json(getIncidentsData);
  } catch (err) {
    return next(err);
  }
};
