import { NextFunction, Request, Response } from "express";
import { urlSchema } from "../validations/urlValidation";
import { checkUrlRegistration } from "../services/registerUrl.services";
import { AppError } from "../../../shared/errors/AppError";

export const registerUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }
    const validatedData = urlSchema.parse(req.body);
    const isUrlRegistered = await checkUrlRegistration(
      validatedData.url,
      validatedData.urlName,
      validatedData.intervalSeconds,
      userId,
    );
    return res.status(201).json({ data: { message: isUrlRegistered } });
  } catch (err) {
    return next(err);
  }
};
