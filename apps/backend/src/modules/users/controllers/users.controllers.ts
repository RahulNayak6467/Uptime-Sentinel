import { NextFunction, Request, Response } from "express";
import { userSchema } from "../validations/userValidation";
import { insertUserData } from "../services/users.services";

export const handleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = userSchema.parse(req.body);
    await insertUserData(validatedData.password, validatedData.email);
    return res.status(201).json({
      data: { message: "User registered check your email to login" },
    });
  } catch (err) {
    return next(err);
  }
};
