import { NextFunction, Request, Response } from "express";
import { getIncidentsDetailsById } from "../services/sendIncidents.services";
import { AppError } from "../../../shared/errors/AppError";
import { uuidSchema } from "../../../shared/validators/uuidValidation";

export const sendIncidentsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url_id = req.params.id as string;
  const user_id = req.user?.user_id;
  // console.log(user_id);

  // if (!url_id) {
  //   return res.status(400).json({
  //     message: "Enter valid url",
  //   });
  // }
  // if (typeof url_id !== "string") {
  //   return res.status(400).json({
  //     message: "Url should be of type of string",
  //   });
  // }

  try {
    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    uuidSchema.parse(url_id);
    const getIncidents = await getIncidentsDetailsById(url_id, user_id);
    return res.status(200).json({
      data: getIncidents,
    });
    // return res.status(200).json(getIncidents)
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
