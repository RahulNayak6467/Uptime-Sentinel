import { NextFunction, Request, Response } from "express";
import { urlSchema } from "../validators/urlValidation";
import { ZodError } from "zod";
import { checkUrlRegistration } from "../services/registerUrl.services";
import { AppError } from "../errors/AppError";

export const registerUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    url,
    urlName,
    intervalSeconds,
  }: { url: string; urlName: string; intervalSeconds: number } = req.body;
  const user_id = req.user?.user_id;
  const missingParametres = [];
  if (!url) {
    missingParametres.push("url");
  }
  if (!urlName) {
    missingParametres.push("urlName");
  }
  if (!intervalSeconds) {
    missingParametres.push("intervalSeconds");
  }
  if (missingParametres.length > 0) {
    const missingString = missingParametres.reduce(
      (acc, el) => el + "," + acc,
      "",
    );
    return res.status(400).json({
      message: `Missing ${missingString}`,
    });
  }
  if (!user_id) {
    throw new AppError(401, "Unauthorized");
  }
  try {
    urlSchema.parse({ url, urlName, intervalSeconds });
  } catch (err) {
    // console.log("ERROR: ", error);
    // if (error instanceof ZodError) {
    //   return res.status(400).json(error.issues[0].message);
    // } else {
    //   return res.status(500).json({ message: "Internal server error" });
    // }
    return next(err);
  }
  try {
    const isUrlRegistered = await checkUrlRegistration(
      url,
      urlName,
      intervalSeconds,
      user_id,
    );
    return res.status(201).json({ message: isUrlRegistered });
  } catch (err) {
    // if (error instanceof AppError) {
    //   return res.status(error.statusCode).json({ message: error.message });
    // } else return res.status(500).json({ messafe: "Internal server error" });
    return next(err);
  }
};
