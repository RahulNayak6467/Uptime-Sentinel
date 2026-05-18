import {
  fetchUrlData,
  fetchUrlDataById,
  fetchUrlDataByName,
} from "../services/checks.services";
import { AppError } from "../errors/AppError";
import { UrlResponseData } from "../types/types";
import { Request, Response } from "express";

export const getAllInfo = async (req: Request, res: Response) => {
  try {
    const getUrlInfo: UrlResponseData[] = await fetchUrlData();
    console.log(getUrlInfo);
    return res.status(200).json(getUrlInfo);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInfoByName = async (req: Request, res: Response) => {
  const url = req.query.url;
  if (!url) {
    return res.status(404).json({
      message: "Invalid url",
    });
  }
  const query = {
    text: "SELECT * FROM checks WHERE url = $1",
    values: [url],
  };
  try {
    const getUrlInfoByName = await fetchUrlDataByName(query);
    console.log(getUrlInfoByName);
    return res.status(200).json(getInfoByName);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInfoById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const getUrlInfoById = await fetchUrlDataById(id);
    return res.status(200).json(getUrlInfoById);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
