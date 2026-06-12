import { NextFunction, Request, Response } from "express";
import { getSingleIncidentsDetailsById } from "../services/singleIncident.services";

import { AppError } from "../errors/AppError";

export const getSingleIncidentData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incident_id = req.params.id;
  const user_id = req.user?.user_id;
  console.log(incident_id, user_id);
  if (!user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (!incident_id) {
    return res.status(400).json({
      message: "Enter valid url",
    });
  }
  if (typeof incident_id !== "string") {
    return res.status(400).json({
      message: "Url should be of type of string",
    });
  }

  try {
    const getSingleIncidents = await getSingleIncidentsDetailsById(
      incident_id,
      user_id,
    );
    return res.status(200).json({
      message: getSingleIncidents,
    });
  } catch (err) {
    // if (err instanceof AppError) {
    //   return res.status(err.statusCode).json({
    //     message: err.message,
    //   });
    // } else if (err instanceof Error) {
    //   return res.status(500).json({
    //     message: "Internal server error",
    //   });
    // }
    return next(err);
  }
};
