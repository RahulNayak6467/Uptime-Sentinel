import { NextFunction, Request, Response } from "express";
import { registerMonitorQuerySchema, registerMonitorSchema, registerUrlSchema } from "../validations/urlValidation";
import { checkTlsRegistration, checkUrlRegistration } from "../services/registerUrl.services";
import { AppError } from "../../../../shared/errors/AppError";
import { monitor_types } from "../../../../shared/types/types";
import { TLS_THRESHOLD } from "../../../../constants/constants";

export const registerUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.user_id;
    const type: monitor_types = req.body.monitorType;
    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHORIZED");
    }

    const validatedData = registerMonitorSchema.parse(req.body);
    const { monitorId } = registerMonitorQuerySchema.parse(req.query);

    let isMonitorRegistered: string;

    if (validatedData.monitorType === "tls") {
      const monitorId = req.query.monitorId as string ?? null;

      isMonitorRegistered = await checkTlsRegistration(
          monitorId ?? null,
          validatedData.url,
          validatedData.monitorName,
          validatedData.intervalSeconds,
          validatedData.requestTimeoutMS,
          validatedData.responseTimeThresholdMS,
          validatedData.port,
          validatedData.minTlsVersion,
          validatedData.warningThresholdDays,
          validatedData.expiryAlertThresholds,
          user_id
        )
    }
    else {
      isMonitorRegistered = await checkUrlRegistration(
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
    }

    return res.status(201).json({ data: isMonitorRegistered });
  } catch (err) {
    return next(err);
  }
};
