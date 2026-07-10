import { Request, Response, NextFunction } from "express";
import { getEmailAlertsServices } from "../services/alertEmail.services";
import { LIMIT_RECENT_ALERTS } from "../../../constants/constants";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";
import { AppError } from "../../../shared/errors/AppError";

export const getAlertEmailsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || LIMIT_RECENT_ALERTS;

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

    const emailAlertsInfo = await getEmailAlertsServices(
      userId,
      pageNumber,
      limit,
      offset,
    );
    return res.status(200).json(emailAlertsInfo);
  } catch (err) {
    return next(err);
  }
};
