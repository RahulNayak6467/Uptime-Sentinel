import { NextFunction, Request, Response } from "express";
import { urlSchema } from "../validators/urlValidation";
import { checkUrlRegistration } from "../services/registerUrl.services";
import { AppError } from "../errors/AppError";

export const registerUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHORIZED");
    }
    const validatedData = urlSchema.parse(req.body);
    const isUrlRegistered = await checkUrlRegistration(
      validatedData.url,
      validatedData.urlName,
      validatedData.intervalSeconds,
      user_id,
    );
    return res.status(201).json({ message: isUrlRegistered });
  } catch (err) {
    return next(err);
  }
};
