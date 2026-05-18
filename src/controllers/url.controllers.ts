import { checkUrlHealth } from "../services/url.services";
import { Request, Response } from "express";
import { urlSchema } from "../validators/urlValidation";
import z, { ZodError } from "zod";
import { TIMEOUT } from "../constants/constants";

export const monitorUrl = async (req: Request, res: Response) => {
  //   let url: URL;
  //   try {
  //     url = new URL(req.body.url);
  //     if (url.protocol !== "http:" && url.protocol !== "https:") {
  //       return res
  //         .status(400)
  //         .json({ message: "Url should only have http or https protocol" });
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       return res.status(400).json({ message: err.message });
  //     }
  //     return res.status(500).json({ message: "Internal server error" });
  //   }

  //   try {
  //     z.url().parse("helloworld");
  //   } catch (err) {
  //     console.log(err instanceof ZodError); // true
  //     console.log(err);
  //   }
  let url: URL = req.body.url;
  try {
    // urlSchema.parse("");
    // z.url().parse("");
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
