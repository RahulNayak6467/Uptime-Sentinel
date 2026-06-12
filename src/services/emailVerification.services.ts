import { v4 as uuidv4 } from "uuid";
import resend from "../config/resend";
import { SALT } from "../constants/constants";
import { db } from "../db";
import { AppError } from "../errors/AppError";
import redis from "../Redis";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { formatDuration } from "../utils/formatDate";

export const sendEmailVerification = async (email: string, otp: string) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email — StatusForge",
    html: `<p>Your verification code is: <strong>${otp}</strong></p>
           <p>This code expires in 10 minutes.</p>`,
  });
  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
  return data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const update_emailVerification_query =
    "UPDATE user_details set email_verified = true where email = $1 and email_verified = false RETURNING id";
  const update_emailVerification_value = [email];
  try {
    const getOTP = await redis.get(`emailVerify-${email}`);
    const wrongOtpAttempts = await redis.get(`verification:attempts-${email}`);

    if (Number(wrongOtpAttempts) > 5) {
      await redis.del(`emailVerify-${email}`);
      throw new AppError(429, "Too many attempts, request a new OTP");
    }

    if (otp !== getOTP) {
      await redis.incr(`verification:attempts-${email}`);
      throw new AppError(400, "Invalid or expired OTP");
    }

    const updateEmailVerification = await db.query(
      update_emailVerification_query,
      update_emailVerification_value,
    );

    const updatedRowCount: number = updateEmailVerification.rowCount as number;

    const updatedRow: number = updateEmailVerification.rows.length;

    console.log(updateEmailVerification);

    if (updatedRowCount === 0) {
      throw new AppError(404, "user not found");
    }

    if (updatedRow === 0) {
      throw new AppError(409, "Email already verified");
    }

    await redis.del(`emailVerify-${email}`);
    await redis.del(`verification:attempts-${email}`);
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    const secretKey = process.env.JWT_SECRET;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET;
    if (!secretKey) {
      throw new AppError(500, "JWT secret is not configured");
    }
    if (!refreshSecretKey) {
      throw new AppError(500, "Refresh secret is not configured");
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

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // const expiresAt = new Date(Date.now() + 5 * 1000);
    const insert_Refresh_Query =
      //   "INSERT INTO refresh_tokens (user_id,token,expires_at) VALUES($1, $2, $3)";
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at";
    const values_Refresh_Query = [user_id, hashedRefreshToken, expiresAt];

    await db.query(insert_Refresh_Query, values_Refresh_Query);
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
    throw new Error(`Failed to send down alert: ${error.message}`);
  }

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
    throw new Error(`Failed to send recovery alert: ${error.message}`);
  }

  return data;
};
