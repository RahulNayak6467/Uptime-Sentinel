import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { uuidSchema } from "../../../shared/validators/uuidValidation";
import { getTlsDataServices } from "../services/individualTlsData.services";

export const getIndividualTlsData = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?.user_id;
  const tls_id = req.params.id as string;

  try {

    if (!user_id) {
      throw new AppError(401, "Unauthenticated", "UNAUTHORIZED");
    }

    uuidSchema.parse(tls_id);

    const getTlsInfo = await getTlsDataServices(tls_id, user_id);

    return res.status(200).json({ data: getTlsInfo });
  }
  catch (err) {
    return next(err);
  }
}
