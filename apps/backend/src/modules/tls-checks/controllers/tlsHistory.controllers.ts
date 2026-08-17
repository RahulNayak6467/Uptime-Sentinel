import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { uuidSchema } from "../../../shared/validators/uuidValidation";
import { getTlsHistoryServices } from "../services/tlsHistory.services";

export const getTlsHistory = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?.user_id;
  const tls_id = req.params.monitorId as string;

  try {

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHORIZED");
    }

    uuidSchema.parse(tls_id);

    const tlsHistory = await getTlsHistoryServices(tls_id);

    return res.status(200).json({ data: tlsHistory });
  }
  catch (err) {
    return next(err);
  }
}
