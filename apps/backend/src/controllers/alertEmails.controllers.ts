import { Request, Response, NextFunction } from "express";
import { getEmailAlertsServices } from "../services/alertEmail.services";
import { LIMIT_RECENT_ALERTS } from "../constants/constants";
import { getPaginationData } from "../utils/generatePagePagination";

export const getAlertEmailsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || LIMIT_RECENT_ALERTS;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

    const emailAlertsInfo = await getEmailAlertsServices(
      user_id,
      pageNumber,
      limit,
      offset,
    );
    return res.status(200).json(emailAlertsInfo);
  } catch (err) {
    console.log(err.message);
    return next(err);
  }
};
