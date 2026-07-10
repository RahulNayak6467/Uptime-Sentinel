import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { getLastFiveIncidentsServices } from "../services/getLastFiveIncidentsServices";
import { uuidSchema } from "../../../shared/validators/uuidValidation";

export const getLastFiveIncidentsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  const monitorId = req.params.monitorId as string;

  try {
    uuidSchema.parse(monitorId);

    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const getLastFiveIncidents = await getLastFiveIncidentsServices(
      userId,
      monitorId,
    );

    const activeCount = getLastFiveIncidents.filter(
      (incident) => incident.is_active,
    ).length;
    const resolvedCount = getLastFiveIncidents.length - activeCount;

    return res
      .status(200)
      .json({ data: getLastFiveIncidents, activeCount, resolvedCount });
  } catch (err) {
    return next(err);
  }
};
