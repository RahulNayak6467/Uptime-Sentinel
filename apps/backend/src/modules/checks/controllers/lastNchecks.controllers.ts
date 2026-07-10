import { NextFunction, Request, Response } from "express";
import { getLastChecksData } from "../services/getLastNchecks.services";
import { uuidSchema } from "../../../shared/validators/uuidValidation";
import { AppError } from "../../../shared/errors/AppError";
import { LIMIT_CHECKS } from "../../../constants/constants";

export const getLastLimitChecks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const monitorId = req.params.monitorId as string;
  const userId = req.user?.user_id;

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    uuidSchema.parse(monitorId);
    const getLastLimitChecksData = await getLastChecksData(
      monitorId,
      userId,
      LIMIT_CHECKS,
    );
    return res.status(200).json({ data: getLastLimitChecksData });
  } catch (err) {
    return next(err);
  }
};
