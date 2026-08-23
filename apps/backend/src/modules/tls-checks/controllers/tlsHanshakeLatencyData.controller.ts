import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { uuidSchema } from "../../../shared/validators/uuidValidation";
import { getHandshakeLatencyStats } from "../services/handshakeLatency.services";

export const getTlsHandshakeLatency = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?.user_id;
  const tls_id = req.params.monitorId as string;

  try {

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHORIZED");
    }

    const range = (req.query.range as string) ?? "7d";
    uuidSchema.parse(tls_id);

    const latencyData = await getHandshakeLatencyStats(user_id, tls_id, range);

    return res.status(200).json({ data: latencyData });
  }
  catch (err) {
    return next(err);
  }
}
