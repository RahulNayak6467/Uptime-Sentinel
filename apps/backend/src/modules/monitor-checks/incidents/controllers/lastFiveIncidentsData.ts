import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { getLastFiveIncidentsServices } from "../services/getLastFiveIncidentsServices";
import { uuidSchema } from "../../../../shared/validators/uuidValidation";
import { ZodError } from "zod";

export const getLastFiveIncidentsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  const monitorId = req.params.monitorId as string;

  try {
    uuidSchema.parse(monitorId);

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const getLastFiveIncidents = await getLastFiveIncidentsServices(
      user_id,
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
    if (err instanceof ZodError) {
      return next(
        new AppError(
          400,
          "Monitor ID must be a valid UUID",
          "INVALID_MONITOR_ID",
        ),
      );
    }
    return next(err);
  }
};
