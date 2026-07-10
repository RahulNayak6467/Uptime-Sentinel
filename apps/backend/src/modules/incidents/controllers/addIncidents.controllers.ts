import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { incidentAddSchema } from "../validations/incidentAddValidation";
import { addIncidentUpdatesServices } from "../services/addIncidentsData.services";
import { getPaginationData } from "../../../shared/utils/generatePagePagination";

export const addIncidentData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incidentId = req.params.incidentId as string;
  const {
    title,
    message,
    type,
    occurredAt,
  }: {
    title: string | null;
    message: string;
    type: "investigating" | "monitoring";
    occurredAt: string | null;
  } = req.body;
  const userId = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);
  try {
    const parsed = incidentAddSchema.parse({
      title,
      type,
      message,
      occurredAt,
      incident_id: incidentId,
    });

    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const addIncidentUpdates = await addIncidentUpdatesServices(
      parsed.title,
      parsed.type,
      parsed.message,
      parsed.occurredAt,
      parsed.incident_id,
      userId,
      limit,
      offset,
      page,
    );
    return res.status(201).json({ data: addIncidentUpdates });
  } catch (err) {
    return next(err);
  }
};
