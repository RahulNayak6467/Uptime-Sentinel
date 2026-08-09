import { NextFunction, Request, Response } from "express";
import { getLastChecksData } from "../services/getLastNchecks.services";
import { uuidSchema } from "../../../../shared/validators/uuidValidation";
import { AppError } from "../../../../shared/errors/AppError";
import { LIMIT_CHECKS } from "../../../../constants/constants";
import { ZodError } from "zod";

export const getLastLimitChecks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitor_id = req.params.monitorId as string;
  const user_id = req.user?.user_id;

  try {
    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    uuidSchema.parse(monitor_id);
    const getLastLimitChecksData = await getLastChecksData(
      monitor_id,
      user_id,
      LIMIT_CHECKS,
    );
    return res.status(200).json({ data: getLastLimitChecksData });
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
