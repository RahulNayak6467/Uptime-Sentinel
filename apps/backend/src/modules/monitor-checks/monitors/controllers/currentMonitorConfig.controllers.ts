import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { uuidSchema } from "../../../../shared/validators/uuidValidation";
import { currentEditMonitorConfig } from "../services/currentMonitorConfig.services";

export const currentMonitorConfig = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?.user_id;
  const monitorId = req.params.monitorId as string;

  try {
    if (!user_id) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    uuidSchema.parse(monitorId);

    const getEditConfig = await currentEditMonitorConfig(user_id, monitorId);

    return res.status(200).json({data:getEditConfig})

  }
  catch (err) {
    return next(err);
  }
}
