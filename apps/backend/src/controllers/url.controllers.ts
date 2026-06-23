import { checkUrlHealth } from "../services/url.services";
import { NextFunction, Request, Response } from "express";
import { TIMEOUT } from "../constants/constants";

export const monitorUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id as string;
  const url_id = req.params.id as string;
  try {
    const response = await checkUrlHealth(TIMEOUT, user_id, url_id);
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};
