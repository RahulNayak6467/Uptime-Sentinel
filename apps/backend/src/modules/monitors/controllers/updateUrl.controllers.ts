import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { updateUrl } from "../services/updateUrl.services";
import { urlSchema } from "../validations/urlValidation";

export const updateUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }
    const monitorId = req.params.monitorId as string;
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
      monitorId,
      userId,
      validatedData.url,
      validatedData.urlName,
      validatedData.intervalSeconds,
    );
    return res.status(200).json({
      data: { message: "successfully updated url" },
    });
  } catch (err) {
    return next(err);
  }
};
