import { Request, Response, NextFunction } from "express";
import { getEmailAlertsServices } from "../services/alertEmail.services";

export const getAlertEmailsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const emailAlertsInfo = await getEmailAlertsServices(user_id);
    return res.status(200).json({ alerts: emailAlertsInfo });
  } catch (err) {
    return next(err);
  }
};
