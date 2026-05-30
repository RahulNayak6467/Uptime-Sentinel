import { checkUrlHealth } from "../services/url.services";
import { Request, Response } from "express";
import { urlSchema } from "../validators/urlValidation";
import z, { ZodError } from "zod";
import { TIMEOUT } from "../constants/constants";
import { AppError } from "../errors/AppError";

export const monitorUrl = async (req: Request, res: Response) => {
  const user_id = req.user?.user_id as string;
  const url_id = req.params.id as string;
  //   try {
  //     urlSchema.parse({ url, urlName });
  //   } catch (err) {
  //     console.log(err instanceof ZodError);
  //     if (err instanceof ZodError) {
  //       console.log(err);
  //       return res.status(400).json({ message: err.issues[0].message });
  //     }
  //     if (err instanceof Error) {
  //       if (err.name === "TypeError") {
  //         return res.status(200).json({ message: "Invalid url" });
  //       }
  //       console.log(err.message);
  //     } else return res.status(500).json({ message: "Internal server error" });
  //   }
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
