import { NextFunction, Request, Response } from "express";
import { getIncidentsDataServices } from "../services/allIncidents.services";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";
import { AppError } from "../../../shared/errors/AppError";

export const getAllIncidentsData = async (
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

    const getIncidentData = await getIncidentsDataServices(
      userId,
      limit,
      offset,
      page,
    );
    return res.status(200).json(getIncidentData);
  } catch (err) {
    return next(err);
  }
};
