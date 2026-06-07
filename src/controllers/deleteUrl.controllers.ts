import { Request, Response } from "express";
import { deleteUrlById } from "../services/deleteUrl.services";
import { AppError } from "../errors/AppError";

export const removeUrlById = async (req: Request, res: Response) => {
  const url_id = req.params.id as string;
  if (!url_id) {
    return res.status(400).json({
      message: "Enter valid id",
    });
  }
  try {
    const deletedUrl = await deleteUrlById(url_id);
    return res.status(200).json({
      message: "url successfully deleted",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};
