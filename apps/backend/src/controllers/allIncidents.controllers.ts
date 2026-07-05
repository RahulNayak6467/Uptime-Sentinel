import { NextFunction, Request, Response } from "express";
import { getIncidentsDataServices } from "../services/allIncidents.services";
import { getPaginationData } from "../utils/generatePagePagination";

export const getAllIncidentsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const getIncidentData = await getIncidentsDataServices(
      user_id,
      limit,
      offset,
      page,
    );
    return res.status(200).json(getIncidentData);
  } catch (err) {
    return next(err);
  }
};
