import { NextFunction, Request, Response } from "express";
import { getIncidentsDetailsById } from "../services/sendIncidents.services";
import { AppError } from "../errors/AppError";

export const sendIncidentsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url_id = req.params.id as string;
  const user_id = req.user?.user_id;
  console.log(user_id);
  if (!user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (!url_id) {
    return res.status(400).json({
      message: "Enter valid url",
    });
  }
  if (typeof url_id !== "string") {
    return res.status(400).json({
      message: "Url should be of type of string",
    });
  }

  try {
    const getIncidents = await getIncidentsDetailsById(url_id, user_id);
    return res.status(200).json({
      message: getIncidents,
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
    next(err);
  }
};
