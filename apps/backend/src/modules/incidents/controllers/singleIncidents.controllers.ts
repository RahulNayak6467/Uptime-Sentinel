import { NextFunction, Request, Response } from "express";
import { getSingleIncidentsDetailsById } from "../services/singleIncident.services";

import { AppError } from "../../../shared/errors/AppError";

export const getSingleIncidentData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incidentId = req.params.incidentId;
  const userId = req.user?.user_id;
  if (!userId) {
    throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
  }
  if (!incidentId) {
    throw new AppError(400, "Enter valid incident id", "INVALID_INCIDENT_ID");
  }
  if (typeof incidentId !== "string") {
    throw new AppError(400, "Incident id should be a string", "INVALID_INCIDENT_ID");
  }

  try {
    const getSingleIncidents = await getSingleIncidentsDetailsById(
      incidentId,
      userId,
    );
    return res.status(200).json({ data: getSingleIncidents });
  } catch (err) {
    return next(err);
  }
};
