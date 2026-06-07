import {
  fetchUrlData,
  fetchUrlDataById,
  fetchUrlDataByName,
} from "../services/checks.services";
import { AppError, PostgresError } from "../errors/AppError";
import { UrlResponseData } from "../types/types";
import { Request, Response } from "express";

export const getAllInfo = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as string;
  try {
    const getUrlInfo: UrlResponseData[] = await fetchUrlData(user_id);
    // console.log(getUrlInfo);
    return res.status(200).json(getUrlInfo);
  } catch (error) {
    // if (error instanceof Error) {
    //   return res.status(404).json({ message: error.message });
    // }
    // return res.status(500).json({ message: "Internal server error" });
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getInfoByName = async (req: Request, res: Response) => {
  const url = req.query.url;
  const user_id = req.user?.user_id as string;
  if (!url) {
    return res.status(400).json({
      message: "Invalid url",
    });
  }

  try {
    const getUrlInfoByName = await fetchUrlDataByName(url as string, user_id);
    // console.log(getUrlInfoByName);
    return res.status(200).json(getUrlInfoByName);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getInfoById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user_id = req.user?.user_id as string;
  try {
    const getUrlInfoById = await fetchUrlDataById(id as string, user_id);
    return res.status(200).json(getUrlInfoById);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof PostgresError) {
      return res.status(error.statusCode).json(error.message);
    } else if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
