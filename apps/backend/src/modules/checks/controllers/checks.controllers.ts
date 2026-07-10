import {
  fetchUrlData,
  fetchUrlDataById,
  fetchUrlDataByName,
} from "../services/checks.services";

import { UrlResponseData } from "../../../shared/types/types";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";

export const getAllInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id as string;
  try {
    const getUrlInfo: UrlResponseData[] = await fetchUrlData(userId);
    return res.status(200).json({ data: getUrlInfo });
  } catch (err) {
    return next(err);
  }
};

export const getInfoByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.query.url;
  const userId = req.user?.user_id as string;
  if (!url) {
    throw new AppError(400, "Invalid url", "INVALID_URL");
  }

  try {
    const getUrlInfoByName = await fetchUrlDataByName(url as string, userId);
    return res.status(200).json({ data: getUrlInfoByName });
  } catch (err) {
    return next(err);
  }
};

export const getInfoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const checkId = req.params.checkId;
  const userId = req.user?.user_id as string;
  try {
    const getUrlInfoById = await fetchUrlDataById(checkId as string, userId);
    return res.status(200).json({ data: getUrlInfoById });
  } catch (err) {
    return next(err);
  }
};
