import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { checkUserServices } from "../services/checkUser.services";

export const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id

  try {

    if (!userId) {
      throw new AppError(401,"Unauthenticated","UNAUTHENTICATED")
    }

    const getUserCheck = await checkUserServices(userId)

    return res.status(200).json({data: getUserCheck})

  }
  catch (err) {
    return next(err)
  }
}
