import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { getIncidentsTimelineServices } from "../services/incidentsTimelineServices";
import { getPaginationData } from "../../../../shared/utils/generatePagePagination";

export const getIncidentsTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }
    const getTimeline = await getIncidentsTimelineServices(
      userId,
      limit,
      offset,
      page,
    );
    return res.status(200).json(getTimeline);
  } catch (err) {
    return next(err);
  }
};
