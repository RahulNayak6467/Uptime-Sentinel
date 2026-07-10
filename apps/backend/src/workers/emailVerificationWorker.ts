import "../config/env";
import { Job, Worker } from "bullmq";
import redis from "../redis";
import crypto from "crypto";
import { AppError } from "../shared/errors/AppError";
import { sendEmailVerification } from "../modules/auth/services/emailVerification.services";
import logger from "../config/logger";

logger.info({}, "monitorWorkers module loaded");
logger.info({ status: redis.status }, "Redis connection state:");

redis.on("connect", () => logger.info("Redis connected in worker"));
redis.on("ready", () => logger.info("Redis ready in worker"));
redis.on("error", (err) =>
  logger.error({ err }, "Redis error in worker:", err),
);

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

  await sendEmailVerification(email, otp);
};

export const emailVerificationWorker = new Worker(
  "email-verification",
  processor,
  getEmailVerificationOptions(),
);

emailVerificationWorker.on("ready", () => {
  logger.info(
    { emailVerificationStatus: "READY" },
    "Email Worker connected to Redis and ready",
  );
});

emailVerificationWorker.on("error", (err) => {
  logger.error(
    { emailVerificationStatus: "ERROR", err },
    "Email Worker error:",
  );
});

emailVerificationWorker.on("completed", (job) => {
  logger.info(
    { emailVerificationStatus: "COMPLETED", jobId: job.id },
    "Email worker Job completed",
  );
});

emailVerificationWorker.on("failed", (job, err) => {
  logger.error(
    {
      emailVerificationStatus: "FAILED",
      err,
      jobId: job?.id,
      stack: err.stack,
    },
    "Email worker Job failed",
  );
});
