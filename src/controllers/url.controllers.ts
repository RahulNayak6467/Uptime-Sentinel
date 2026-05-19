import { checkUrlHealth } from "../services/url.services";
import { Request, Response } from "express";
import { urlSchema } from "../validators/urlValidation";
import z, { ZodError } from "zod";
import { TIMEOUT } from "../constants/constants";

export const monitorUrl = async (req: Request, res: Response) => {
  let url: URL = req.body.url;
  try {
    urlSchema.parse(url);
  } catch (err) {
    console.log(err instanceof ZodError);
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues[0].message });
    }
    if (err instanceof Error) {
      if (err.name === "TypeError") {
        return res.status(200).json({ message: "Invalid url" });
      }
      console.log(err.message);
    } else return res.status(500).json({ message: "Internal server error" });
  }
  try {
    const response = await checkUrlHealth(url, TIMEOUT);
    return res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
