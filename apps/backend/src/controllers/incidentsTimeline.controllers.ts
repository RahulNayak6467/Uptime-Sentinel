import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { getIncidentsTimelineServices } from "../services/incidentsTimelineServices";
import { getPaginationData } from "../utils/generatePagePagination";

export const getIncidentsTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

  console.log("PAGE", page);
  console.log("LIMIT", limit);
  console.log("OFFSET", offset);

  try {
    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }
    const getTimeline = await getIncidentsTimelineServices(
      user_id,
      limit,
      offset,
      page,
    );
    console.log("TIMELINE DATA", getTimeline);
    return res.status(200).json({ getTimeline });
  } catch (err) {
    return next(err);
  }
};
