import "../config/env";
import { Job, Worker } from "bullmq";
import redis from "../Redis";
import crypto from "crypto";
import { AppError } from "../errors/AppError";
import { sendEmailVerification } from "../services/emailVerification.services";

console.log("monitorWorkers module loaded");
console.log("Redis connection state:", redis.status);

redis.on("connect", () => console.log("Redis connected in worker"));
redis.on("ready", () => console.log("Redis ready in worker"));
redis.on("error", (err) => console.error("Redis error in worker:", err));

const getEmailVerificationOptions = () => {
  return {
    connection: redis,
    concurrency: 10,
    lockDuration: 30000,
    removeOnComplete: {
      age: 172800,
      count: 10,
    },
    removeOnFail: {
      age: 172800,
      count: 100,
    },
  };
};

const processor = async (job: Job) => {
  const { email, otp } = job.data;
  // const generatedOTP = crypto.randomInt(100000, 999999).toString();
  // const addOTP = await redis.set(
  //   `emailVerify-${email}`,
  //   generatedOTP,
  //   "EX",
  //   600,
  // );

  const sendEmail = await sendEmailVerification(email, otp);
  console.log(sendEmail);
  // if (sendEmail === null) {
  //   throw new Error("Email sent unsuccessful");
  // }
};

export const emailVerificationWorker = new Worker(
  "email-verification",
  processor,
  getEmailVerificationOptions(),
);

emailVerificationWorker.on("ready", () => {
  console.log("Email Worker connected to Redis and ready");
});

emailVerificationWorker.on("error", (error) => {
  console.error("Email Worker error:", error);
});

emailVerificationWorker.on("completed", (job) => {
  console.log(`Email Job ${job.id} completed`);
});

emailVerificationWorker.on("failed", (job, error) => {
  console.log(`Email Job ${job?.id} failed:`, error.message);
  console.error("Stack:", error.stack);
});
