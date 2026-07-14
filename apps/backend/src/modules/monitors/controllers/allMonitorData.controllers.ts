import { Request, Response, NextFunction, RequestHandler } from "express";
import { getAllMonitorInfo } from "../services/allMonitorData.services";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";
import { LIMIT_RECENT_ALERTS } from "../../../constants/constants";
import { AppError } from "../../../shared/errors/AppError";
import { monitorListQuerySchema } from "../validations/monitorRequestValidation";

export const getAllMonitorData: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const {
      monitorstatus: filter_status,
      page,
      limit: limitRange,
    } = monitorListQuerySchema.parse(req.query);

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
