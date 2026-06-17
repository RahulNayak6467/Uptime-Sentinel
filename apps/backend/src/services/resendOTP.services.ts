import { db } from "../db";
import { AppError } from "../errors/AppError";
import { addToEmailVerificationQueue } from "../queue/emailVerificationQueue.";
import redis from "../Redis";
import crypto, { X509Certificate } from "crypto";

interface verifiedProps {
  email_verified: boolean;
}

export const resendOtpRequest = async (email: string) => {
  try {
    const user_exist_query =
      "SELECT email_verified FROM user_details where email = $1 ";
    const user_exist_values = [email];

    const doesUserExist = await db.query(user_exist_query, user_exist_values);
    const userRows = doesUserExist.rows.length;
    const verifiedUser: verifiedProps[] = doesUserExist.rows;

    if (userRows === 0) {
      throw new AppError(404, "User not found");
    }

    if (verifiedUser[0]?.email_verified) {
      throw new AppError(409, "Already verified user");
    }

    const key = `ratelimit-resend-verification-${email}`;
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, 3600);
    }
    if (attempts > 3) {
      throw new AppError(429, "Too many attempts try again later");
    }
    const isCooldownOver = await redis.exists(`emailVerifyCooldown-${email}`);
    if (isCooldownOver === 1) {
      throw new AppError(429, "Please wait before requesting another OTP");
    }
    const generatedOTP = crypto.randomInt(100000, 999999).toString();
    const addOTP = await redis.set(
      `emailVerify-${email}`,
      generatedOTP,
      "EX",
      600,
    );
    const addCooldown = await redis.set(
      `emailVerifyCooldown-${email}`,
      "1",
      "EX",
      60,
    );
    if (!addOTP || !addCooldown) {
      throw new AppError(500, "Internal server error");
    }
    await addToEmailVerificationQueue(email, generatedOTP);
  } catch (err) {
    throw err;
  }
};
