import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { incidentAddSchema } from "../validators/incidentAddValidation";
import { addIncidentUpdatesServices } from "../services/addIncidentsData.services";
import { getPaginationData } from "../utils/generatePagePagination";

export const addIncidentData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incident_id = req.params.incidentId as string;
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
  const user_id = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);
  try {
    const parsed = incidentAddSchema.parse({
      title,
      type,
      message,
      occurredAt,
      incident_id,
    });

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const addIncidentUpdates = await addIncidentUpdatesServices(
      parsed.title,
      parsed.type,
      parsed.message,
      parsed.occurredAt,
      parsed.incident_id,
      user_id,
      limit,
      offset,
      page,
    );
    return res.status(201).json({ data: addIncidentUpdates });
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      return next(
        new AppError(
          400,
          `${first.path.join(".")}: ${first.message}`,
          "VALIDATION_ERROR",
        ),
      );
    }
    return next(err);
  }
};
