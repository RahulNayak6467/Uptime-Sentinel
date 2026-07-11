import bcrypt from "bcrypt";
import { db } from "../../../db/index";
import jwt from "jsonwebtoken";
import { userSchema } from "../validations/userValidation";
import { SALT } from "../../../constants/constants";
import { AppError } from "../../../shared/errors/AppError";
import { v4 as uuidv4 } from "uuid";
import { addToEmailVerificationQueue } from "../../../queue/emailVerificationQueue.";
import redis from "../../../redis";
import crypto from "crypto";
import logger from "../../../config/logger";

export const insertUserData = async (password: string, email: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    const insertQuery =
      "INSERT INTO user_details (email, password) VALUES ($1, $2) RETURNING id";
    const insertValues = [email, hashedPassword];
    const userData = await db.query(insertQuery, insertValues);

    logger.info({ userId: userData.rows[0].id }, "user is registered");

    const generatedOTP = crypto.randomInt(100000, 999999).toString();
    const addOTP = await redis.set(
      `emailVerify-${email}`,
      generatedOTP,
      "EX",
      600,
    );
    const checkOTPAttemptLimit = await redis.set(
      `verification:attempts-${email}`,
      0,
      "EX",
      600,
    );
    const addCooldown = await redis.set(
      `emailVerifyCooldown-${email}`,
      "1",
      "EX",
      60,
    );
    if (!addOTP || !addCooldown || !checkOTPAttemptLimit) {
      logger.error(
        { err: "No Otp or cooldown or redis Otp attempt limit" },
        "REDIS_ERROR",
      );
      throw new AppError(500, "Internal server error", "REDIS_ERROR");
    }
    await addToEmailVerificationQueue(email, generatedOTP);
    logger.debug(
      { user_id: userData.rows[0].id },
      "adding to email verification queue",
    );
    return;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error) {
      if ((error as NodeJS.ErrnoException).code === "23505") {
        throw new AppError(409, "email already taken", "EMAIL_ALREADY_TAKEN");
      }
      throw new AppError(500, "Internal server error", "INTERNAL_ERROR");
    } else {
      throw new AppError(500, "Internal server error", "INTERNAL_ERROR");
    }
  }
};
