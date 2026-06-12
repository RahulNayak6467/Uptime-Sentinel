import { NextFunction, Request, Response } from "express";
import { removeToken } from "../services/logout.services";
import { AppError } from "../errors/AppError";

export const userLogOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(req.user);
  const user_id = req.user?.user_id;
  const jti = req.user?.jti;
  const expirationTime = req.user?.exp;

  // console.log(user_id, jti);
  if (!user_id || !jti || !expirationTime) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  try {
    const removeRefreshToken = await removeToken(user_id, jti, expirationTime);
    return res.status(200).json({ message: removeRefreshToken });
  } catch (err) {
    // if (error instanceof AppError) {
    //   return res.status(error.statusCode).json({ message: error.message });
    // } else return res.status(500).json({ message: "Internal server error" });
    return next(err);
  }
};
