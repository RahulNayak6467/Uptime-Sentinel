import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { checkUrlHealth } from "../services/url.services";
import { TIMEOUT } from "../constants/constants";
import { pauseUrl, resumeUrl } from "../services/cronSchedule.services";

export const monitorUrlById = async (req: Request, res: Response) => {
  console.log(req);
  console.log(req.params);
  const url_id = req.params.id as string;
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!url_id) {
    return res.status(400).json({ message: "Enter valid id " });
  }

  try {
    const response = await checkUrlHealth(TIMEOUT, user_id, url_id);
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const pauseUrlById = async (req: Request, res: Response) => {
  const url_id: string = req.params.id as string;
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  if (!url_id) {
    return res.status(400).json({ message: "Enter valid id" });
  }
  try {
    const pause = await pauseUrl(url_id, user_id);
    return res.status(204).json({});
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const resumeUrlById = async (req: Request, res: Response) => {
  const url_id: string = req.params.id as string;
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  if (!url_id) {
    return res.status(400).json({ message: "Enter valid id" });
  }
  try {
    const pause = await resumeUrl(url_id, user_id);
    return res.status(204).json({});
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
