import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { checkUserServices } from "../services/checkUser.services";

export const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user?.user_id

  try {

    if (!user_id) {
      throw new AppError(401,"Unauthenticated","UNAUTHENTICATED")
    }

    const getUserCheck = await checkUserServices(user_id)

    return res.status(200).json({data: getUserCheck})

  }
  catch (err) {
    return next(err)
  }
}
