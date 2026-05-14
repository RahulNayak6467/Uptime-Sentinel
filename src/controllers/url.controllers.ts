import { checkUrlHealth } from "../services/url.services";
import { Request, Response } from "express";

const TIMEOUT: number = 5000;
export const monitorUrl = async (req: Request, res: Response) => {
  let url: URL;
  try {
    url = new URL(req.body.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return res
        .status(400)
        .json({ message: "Url should only have http or https protocol" });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const response = await checkUrlHealth(url, TIMEOUT);
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
