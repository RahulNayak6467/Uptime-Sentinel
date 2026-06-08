import { Queue } from "bullmq";
import redis from "../Redis";

const emailVerificationQueue = new Queue("email-verification", {
  connection: redis, // your existing redis client
});

export const addToEmailVerificationQueue = async (
  email: string,
  otp: string,
) => {
  console.log("Email Job added to queue");
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

  return addJob;
};

export default emailVerificationQueue;
