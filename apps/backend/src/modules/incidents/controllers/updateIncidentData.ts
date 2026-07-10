import { NextFunction, Request, Response } from "express";
import { incidentUpdateDataSchema } from "../validations/updateIncidentsValidation";
import { AppError } from "../../../shared/errors/AppError";
import { updateIncidentDataServices } from "../services/updateIncidentDataServices";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";

export const updateIncidentsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    message,
    type,
  }: { title: string; message: string; type: string } = req.body;
  const incidentId = req.params.incidentId as string;
  const userId = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

  try {
    const parsed = incidentUpdateDataSchema.parse({
      title,
      type,
      message,
      incident_id: incidentId,
    });

    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const updatedRow = await updateIncidentDataServices(
      parsed.title,
      parsed.type,
      parsed.message,
      parsed.incident_id,
      userId,
      limit,
      offset,
      page,
    );

    return res.status(200).json({ data: updatedRow });
  } catch (err) {
    return next(err);
  }
};
