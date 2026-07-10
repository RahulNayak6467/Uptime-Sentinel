import { Queue } from "bullmq";
import redis from "../redis";
import logger from "../config/logger";

const emailVerificationQueue = new Queue("email-verification", {
  connection: redis,
});

export const addToEmailVerificationQueue = async (
  email: string,
  otp: string,
) => {
  const addJob = await emailVerificationQueue.add(
    "email-verification",
    {
      email,
      otp,
    },
    {
      jobId: `email-verification-${email}-${Date.now()}`,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      priority: 1,
      removeOnComplete: {
        age: 172800,
        count: 10,
      },
      removeOnFail: {
        age: 172800,
        count: 100,
      },
    },
  );
  logger.debug({ jobId: addJob.id, email }, "email verification job added");

  return addJob;
};

export default emailVerificationQueue;
