import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { updateUrl } from "../services/updateUrl.services";
import { urlSchema } from "../validators/urlValidation";

export const updateUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      throw new AppError(401, "UnAuthorized", "UNAUTHORIZED");
    }
    const url_id = req.params.id as string;
    const validatedData = urlSchema.partial().parse(req.body);
    if (
      !validatedData.url &&
      !validatedData.urlName &&
      validatedData.intervalSeconds === undefined
    ) {
      throw new AppError(
        400,
        "One of the values must be updated",
        "NO_UPDATE_FIELDS",
      );
    }
    await updateUrl(
      url_id,
      user_id,
      validatedData.url,
      validatedData.urlName,
      validatedData.intervalSeconds,
    );
    return res.status(200).json({ message: "successfully updated url" });
  } catch (err) {
    return next(err);
  }
};
