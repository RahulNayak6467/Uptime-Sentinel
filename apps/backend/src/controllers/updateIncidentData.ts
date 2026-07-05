import { NextFunction, Request, Response } from "express";
import { incidentUpdateDataSchema } from "../validators/updateIncidentsValidation";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { updateIncidentDataServices } from "../services/updateIncidentDataServices";
import { getPaginationData } from "../utils/generatePagePagination";

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
  const incident_id = req.params.incidentId as string;
  const user_id = req.user?.user_id;
  const page = Number(req.query.page as string) || 1;
  const limitRange = Number(req.query.limit as string) || 3;

  const { pageNumber, limit, offset } = getPaginationData(page, limitRange);

  try {
    const parsed = incidentUpdateDataSchema.parse({
      title,
      type,
      message,
      incident_id,
    });

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const updatedRow = await updateIncidentDataServices(
      parsed.title,
      parsed.type,
      parsed.message,
      parsed.incident_id,
      user_id,
      limit,
      offset,
      page,
    );

    return res.status(200).json({ data: updatedRow });
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
