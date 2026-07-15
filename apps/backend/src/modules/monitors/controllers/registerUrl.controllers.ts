import { NextFunction, Request, Response } from "express";
import { registerUrlSchema } from "../validations/urlValidation";
import { checkUrlRegistration } from "../services/registerUrl.services";
import { AppError } from "../../../shared/errors/AppError";

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

    const validatedData = registerUrlSchema.parse(req.body);
    const isUrlRegistered = await checkUrlRegistration(
      validatedData.url,
      validatedData.monitorName,
      validatedData.intervalSeconds,
      validatedData.contentType,
      validatedData.failureThreshold,
      validatedData.httpMethod,
      validatedData.requestBody,
      validatedData.requestBodyType,
      validatedData.requestTimeoutMS,
      validatedData.statusCodes,
      validatedData.monitorType,
      validatedData.recoveryThreshold,
      validatedData.responseTimeThresholdMS,
      user_id,
    );
    return res.status(201).json({ message: isUrlRegistered });
  } catch (err) {
    return next(err);
  }
};
