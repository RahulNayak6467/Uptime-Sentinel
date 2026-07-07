import { v4 as uuidv4 } from "uuid";
import resend from "../config/resend";
import { SALT } from "../constants/constants";
import { db } from "../db";
import { AppError } from "../errors/AppError";
import redis from "../Redis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { formatDuration } from "../utils/formatDate";
import { env } from "../config/env";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "../auth-config";
import logger from "../config/logger";

export const sendEmailVerification = async (email: string, otp: string) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email — UptimeSentinel",
    html: `<p>Your verification code is: <strong>${otp}</strong></p>
           <p>This code expires in 10 minutes.</p>`,
  });
  if (error) {
    logger.error({ err: error }, "verification email send failed");
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
  logger.info({ emailId: data?.id }, "verification email sent");
  return data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const update_emailVerification_query =
    "UPDATE user_details set email_verified = true where email = $1 and email_verified = false RETURNING id";
  const update_emailVerification_value = [email];
  try {
    const getOTP = await redis.get(`emailVerify-${email}`);
    if (getOTP === null) {
      throw new AppError(
        400,
        "OTP has expired. Request a new verification code.",
        "OTP_EXPIRED",
      );
    }

    if (otp !== getOTP) {
      const attempt = await redis.incr(`verification:attempts-${email}`);
      if (attempt === 1) {
        await redis.expire(`verification:attempts-${email}`, 600);
      }
      const wrongOtpAttempts = await redis.get(
        `verification:attempts-${email}`,
      );
      if (Number(wrongOtpAttempts) >= 5) {
        await redis.del(`emailVerify-${email}`);
        await redis.del(`verification:attempts-${email}`);
        throw new AppError(
          429,
          "Too many attempts, request a new OTP",
          "OTP_MAX_ATTEMPTS_EXCEEDED",
        );
      }
      throw new AppError(400, "Invalid or expired OTP", "OTP_INVALID");
    }

    const updateEmailVerification = await db.query(
      update_emailVerification_query,
      update_emailVerification_value,
    );

    const updatedRowCount: number = updateEmailVerification.rowCount as number;

    const updatedRow: number = updateEmailVerification.rows.length;

    if (updatedRow === 0) {
      const email_exists_query =
        "SELECT email from user_details where email = $1 ";
      const email_exists_value = [email];
      const check_email_exists = await db.query(
        email_exists_query,
        email_exists_value,
      );

      const doesEmailExist = check_email_exists.rows.length;

      if (doesEmailExist === 0) {
        throw new AppError(404, "User Not Found", "USER_NOT_FOUND");
      }
      throw new AppError(
        409,
        "Email already verified",
        "EMAIL_ALREADY_VERIFIED",
      );
    }

    // if (updatedRow === 0) {
    //   throw new AppError(
    //     409,
    //     "Email already verified",
    //     "EMAIL_ALREADY_VERIFIED",
    //   );
    // }

    await redis.del(`emailVerify-${email}`);
    await redis.del(`verification:attempts-${email}`);
    const expiresIn = ACCESS_TOKEN_TTL_SECONDS;
    const refreshExpiresIn = REFRESH_TOKEN_TTL_SECONDS;
    const secretKey = env.JWT_SECRET;
    const refreshSecretKey = env.JWT_REFRESH_SECRET;
    if (!secretKey) {
      throw new AppError(
        500,
        "JWT secret is not configured",
        "JWT_SECRET_NOT_CONFIGURED",
      );
    }
    if (!refreshSecretKey) {
      throw new AppError(
        500,
        "Refresh secret is not configured",
        "REFRESH_SECRET_NOT_CONFIGURED",
      );
    }
    // const user_id = updateEmailVerificationAndGetId;
    const selectQuery = "SELECT id FROM user_details WHERE email = $1";
    const selectValues = [email];
    const requiredData = await db.query(selectQuery, selectValues);
    const user_id = requiredData.rows[0].id;
    const generatedToken = jwt.sign(
      { user_id, email, jti: uuidv4() },
      secretKey,
      {
        expiresIn,
        algorithm: "HS256",
      },
    );

    const generateRefreshToken = jwt.sign({ user_id }, refreshSecretKey, {
      expiresIn: refreshExpiresIn,
      algorithm: "HS256",
    });

    const hashedRefreshToken = await bcrypt.hash(generateRefreshToken, SALT);

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    // const expiresAt = new Date(Date.now() + 5 * 1000);
    const insert_Refresh_Query =
      //   "INSERT INTO refresh_tokens (user_id,token,expires_at) VALUES($1, $2, $3)";
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at";
    const values_Refresh_Query = [user_id, hashedRefreshToken, expiresAt];

    await db.query(insert_Refresh_Query, values_Refresh_Query);
    logger.info({ userId: user_id }, "email verified");
    return {
      message: "user successfully signedIn",
      token: generatedToken,
      refreshToken: generateRefreshToken,
    };
  } catch (err) {
    throw err;
  }
};

export const sendDownAlertEmail = async (
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
  errorMessage?: string | null,
) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `🔴 Monitor Down: ${monitorName}`,
    html: `
      <h2>Your monitor is down</h2>
      <p><strong>Monitor:</strong> ${monitorName}</p>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Down since:</strong> ${startedAt.toLocaleString()}</p>
      ${errorMessage ? `<p><strong>Error:</strong> ${errorMessage}</p>` : ""}
    `,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "down alert email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "down alert email sent");
  return data;
};

export const sendRecoveryEmail = async (
  email: string,
  urlName: string,
  url: string,
  startedAt: Date,
  resolvedAt: Date,
) => {
  const duration = formatDuration(startedAt, resolvedAt);
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `✅ Monitor Recovered: ${urlName}`,
    html: `
      <h2>Your monitor has recovered</h2>
      <p><strong>Monitor:</strong> ${urlName}</p>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Recovered at:</strong> ${resolvedAt.toLocaleString()}</p>
      <p><strong>Outage duration:</strong> ${duration}</p>
    `,
  });
  if (error) {
    logger.error({ err: error, monitorName: urlName }, "recovery email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName: urlName }, "recovery email sent");
  return data;
};

export const sendStillDownAlertEmail = async (
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
) => {
  const downtimeDuration = formatDuration(startedAt, new Date());

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `🔴 Still Down: ${monitorName} (${downtimeDuration})`,
    html: `
      <h2>Your monitor is still down</h2>
      <p><strong>Monitor:</strong> ${monitorName}</p>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Down since:</strong> ${startedAt.toLocaleString()}</p>
      <p><strong>Total downtime so far:</strong> ${downtimeDuration}</p>
    `,
  });

  if (error) {
    logger.error(
      { err: error, monitorName },
      "still-down alert email send failed",
    );
    return null;
  }

  logger.info(
    { emailId: data?.id, monitorName },
    "still-down alert email sent",
  );
  return data;
};
