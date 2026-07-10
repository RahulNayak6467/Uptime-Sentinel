import { Request, Response, NextFunction, RequestHandler } from "express";
import { getAllMonitorInfo } from "../services/allMonitorData.services";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";
import { LIMIT_RECENT_ALERTS } from "../../../constants/constants";
import { AppError } from "../../../shared/errors/AppError";

export const getAllMonitorData: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  const monitor_status = req.query.monitorstatus as string;
  const filter_status = monitor_status ? monitor_status : "all";
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 2;

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

    let query: (string | null | boolean | number)[] = [userId];

    if (filter_status === "all") {
      query.push(null, null);
    } else if (filter_status !== "paused") {
      query.push(filter_status.toUpperCase(), null);
    } else {
      query.push(null, false);
    }

    query.push(offset, limit);

    const getMonitorData = await getAllMonitorInfo(
      query,
      pageNumber,
      limit,
      offset,
    );
    return res.status(200).json(getMonitorData);
  } catch (err) {
    return next(err);
  }
};
