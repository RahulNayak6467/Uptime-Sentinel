import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { updateUrl } from "../services/updateUrl.services";
import { urlSchema } from "../validators/urlValidation";
import { ZodError } from "zod";

export const updateUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { url, urlName, intervalSeconds } = req.body;

  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  if (!url && !urlName && !intervalSeconds) {
    return res.status(400).json({
      message: "One of the values must be updated",
    });
  }
  const url_id = req.params.id as string;
  if (!url_id) {
    return res.status(400).json({
      message: "Enter valid id",
    });
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
    next(err);
  }
  try {
    const updatedUrlResponseMessage = await updateUrl(
      url_id,
      user_id,
      url,
      urlName,
      intervalSeconds,
    );
    return res.status(200).json({ message: "successfully updated url" });
  } catch (err) {
    // if (error instanceof AppError) {
    //   return res.status(error.statusCode).json({ message: error.message });
    // } else if (error instanceof Error) {
    //   return res.status(500).json({
    //     message: error.message,
    //   });
    // } else {
    //   return res.status(500).json({ message: "Internal server error" });
    // }
    next(err);
  }
};
